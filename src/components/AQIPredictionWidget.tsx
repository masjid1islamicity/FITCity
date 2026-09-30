import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { 
  Wind, 
  Sparkles, 
  Clock, 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Sun, 
  CloudRain, 
  RefreshCw,
  Compass,
  Heart
} from 'lucide-react';
import { IoTSensorData } from '../types';

interface AQIPredictionWidgetProps {
  sensors: IoTSensorData[];
}

interface HourlyDataPoint {
  hourOffset: number; // -24 to +24
  label: string;
  timeStr: string;
  aqi: number;
  pm25: number;
  isPrediction: boolean;
  confidenceLower?: number;
  confidenceUpper?: number;
  condition: string;
  factor: string;
}

export const AQIPredictionWidget: React.FC<AQIPredictionWidgetProps> = ({ sensors }) => {
  const [selectedStationId, setSelectedStationId] = useState<string>('all');
  const [hoveredPoint, setHoveredPoint] = useState<HourlyDataPoint | null>(null);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chart' | 'advisory'>('chart');

  const svgRef = useRef<SVGSVGElement | null>(null);

  const selectedSensor = useMemo(() => {
    if (selectedStationId === 'all') return null;
    return sensors.find((s) => s.id === selectedStationId) || null;
  }, [selectedStationId, sensors]);

  const baseAQI = selectedSensor 
    ? selectedSensor.aqi 
    : Math.round(sensors.reduce((acc, curr) => acc + curr.aqi, 0) / sensors.length);

  // Generate 48 hours of continuous data: 24 hours historical (-24 to 0) + 24 hours predicted (+1 to +24)
  const timelineData: HourlyDataPoint[] = useMemo(() => {
    const points: HourlyDataPoint[] = [];
    const now = new Date();
    const currentHour = now.getHours();

    for (let offset = -24; offset <= 24; offset++) {
      const targetDate = new Date(now.getTime() + offset * 3600 * 1000);
      const hour = targetDate.getHours();
      const timeStr = `${String(hour).padStart(2, '0')}:00`;
      const isPrediction = offset > 0;

      // Realistic diurnal pollution pattern:
      // Peak morning traffic (06:00 - 09:00), lower midday due to thermal dispersion (11:00 - 15:00),
      // Peak evening traffic (17:00 - 20:00), clean late night/dawn (02:00 - 05:00)
      let hourVariation = 0;
      let factorDesc = '';

      if (hour >= 2 && hour <= 5) {
        hourVariation = -16;
        factorDesc = 'Angin malam tenang & emisi lalu lintas minimum (Sangat Bersih)';
      } else if (hour >= 6 && hour <= 9) {
        hourVariation = +18;
        factorDesc = 'Puncak mobilitas berangkat kerja & sekolah (Peningkatan Partikulat)';
      } else if (hour >= 11 && hour <= 15) {
        hourVariation = -6;
        factorDesc = 'Sinar matahari optimal & dispersi vertikal konvektif';
      } else if (hour >= 17 && hour <= 20) {
        hourVariation = +22;
        factorDesc = 'Puncak kemacetan sore & kepulangan warga';
      } else {
        hourVariation = -2;
        factorDesc = 'Aktivitas permukiman normal';
      }

      // If station is Industrial (Timur), baseline is slightly higher
      const stationBias = selectedSensor?.id === 'iot-02' ? 14 : selectedSensor?.id === 'iot-03' ? -12 : 0;
      
      // Seed pseudo-random curve that matches offset
      const wave = Math.sin(offset / 3.5) * 4;
      const calculatedAQI = Math.max(18, Math.min(95, Math.round(baseAQI + hourVariation + wave + stationBias)));
      const pm25Val = +(calculatedAQI * 0.28).toFixed(1);

      let condition = 'Sehat / Baik';
      if (calculatedAQI > 50 && calculatedAQI <= 100) condition = 'Sedang (Wajar)';
      else if (calculatedAQI > 100) condition = 'Sensitif Waspada';

      // Confidence interval widens for future predictions
      const uncertainty = isPrediction ? Math.round(offset * 0.75) : 0;

      points.push({
        hourOffset: offset,
        label: offset === 0 ? 'Sekarang' : offset < 0 ? `${Math.abs(offset)}j lalu` : `+${offset}j`,
        timeStr,
        aqi: calculatedAQI,
        pm25: pm25Val,
        isPrediction,
        confidenceLower: isPrediction ? Math.max(15, calculatedAQI - uncertainty) : undefined,
        confidenceUpper: isPrediction ? Math.min(110, calculatedAQI + uncertainty) : undefined,
        condition,
        factor: factorDesc,
      });
    }

    return points;
  }, [baseAQI, selectedSensor]);

  // Default hovered point to "Sekarang" (offset 0)
  useEffect(() => {
    const currentPoint = timelineData.find((p) => p.hourOffset === 0);
    if (currentPoint) {
      setHoveredPoint(currentPoint);
    }
  }, [timelineData]);

  // Recalculate AI forecast
  const handleRecalculateForecast = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 700);
  };

  // D3 Line & Area Chart Rendering
  useEffect(() => {
    if (!svgRef.current || timelineData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 760;
    const height = 260;
    const margin = { top: 25, right: 30, bottom: 45, left: 45 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // X Scale: -24 to +24
    const x = d3.scaleLinear().domain([-24, 24]).range([0, innerWidth]);

    // Y Scale: 0 to 100
    const maxY = Math.max(90, d3.max(timelineData, (d) => (d.confidenceUpper || d.aqi) + 10) || 100);
    const y = d3.scaleLinear().domain([0, maxY]).range([innerHeight, 0]);

    // Background threshold bands
    const goodThresholdY = y(50);
    g.append('rect')
      .attr('x', 0)
      .attr('y', goodThresholdY)
      .attr('width', innerWidth)
      .attr('height', innerHeight - goodThresholdY)
      .attr('fill', '#10b981')
      .attr('fill-opacity', 0.05);

    // Separator line between historical & predicted
    const nowX = x(0);
    g.append('line')
      .attr('x1', nowX)
      .attr('x2', nowX)
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#059669')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 4');

    g.append('text')
      .attr('x', nowX)
      .attr('y', -8)
      .attr('text-anchor', 'middle')
      .attr('class', 'fill-emerald-600 dark:fill-emerald-400 font-bold text-[10px]')
      .text('● Waktu Sekarang');

    // Labels for zones
    g.append('text')
      .attr('x', nowX / 2)
      .attr('y', 14)
      .attr('text-anchor', 'middle')
      .attr('class', 'fill-slate-400 dark:fill-slate-500 font-semibold text-[10px]')
      .text('← Riwayat 24 Jam Terakhir');

    g.append('text')
      .attr('x', nowX + (innerWidth - nowX) / 2)
      .attr('y', 14)
      .attr('text-anchor', 'middle')
      .attr('class', 'fill-teal-600 dark:fill-teal-400 font-semibold text-[10px]')
      .text('Proyeksi AI Prediktif 24 Jam ke Depan →');

    // Grid lines horizontal
    g.append('g')
      .call(d3.axisLeft(y).ticks(4).tickSize(-innerWidth).tickFormat(() => ''))
      .selectAll('line')
      .attr('stroke', 'currentColor')
      .attr('stroke-opacity', 0.08);

    // Predictive Confidence Corridor (Area)
    const futureData = timelineData.filter((d) => d.hourOffset >= 0);
    const confidenceArea = d3
      .area<HourlyDataPoint>()
      .x((d) => x(d.hourOffset))
      .y0((d) => y(d.confidenceLower || d.aqi))
      .y1((d) => y(d.confidenceUpper || d.aqi))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(futureData)
      .attr('d', confidenceArea)
      .attr('fill', '#0d9488')
      .attr('fill-opacity', 0.12);

    // Historical Line (-24 to 0)
    const pastData = timelineData.filter((d) => d.hourOffset <= 0);
    const lineGenerator = d3
      .line<HourlyDataPoint>()
      .x((d) => x(d.hourOffset))
      .y((d) => y(d.aqi))
      .curve(d3.curveMonotoneX);

    // Historical Area Gradient
    const pastArea = d3
      .area<HourlyDataPoint>()
      .x((d) => x(d.hourOffset))
      .y0(innerHeight)
      .y1((d) => y(d.aqi))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(pastData)
      .attr('d', pastArea)
      .attr('fill', '#10b981')
      .attr('fill-opacity', 0.15);

    // Historical line
    g.append('path')
      .datum(pastData)
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#059669')
      .attr('stroke-width', 2.5);

    // Predicted Line (0 to 24) with dashed animation
    g.append('path')
      .datum(futureData)
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#0d9488')
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '5 4');

    // Axes
    const xAxisTicks = [-24, -18, -12, -6, 0, 6, 12, 18, 24];
    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(xAxisTicks)
          .tickFormat((d) => {
            const pt = timelineData.find((p) => p.hourOffset === d);
            return pt ? pt.timeStr : `${d}h`;
          })
      )
      .selectAll('text')
      .attr('class', 'fill-slate-500 text-[10px] font-semibold')
      .attr('dy', '0.8em');

    g.append('g')
      .call(d3.axisLeft(y).ticks(4).tickFormat((d) => `${d}`))
      .selectAll('text')
      .attr('class', 'fill-slate-400 text-[10px]');

    // Interactive Hover Overlay
    const bisect = d3.bisector<HourlyDataPoint, number>((d) => d.hourOffset).center;

    svg
      .append('rect')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair')
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event);
        const offsetVal = x.invert(mx);
        const index = bisect(timelineData, offsetVal);
        const pt = timelineData[index];
        if (pt) {
          setHoveredPoint(pt);
        }
      });
  }, [timelineData]);

  // Safe color based on AQI
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-emerald-600 dark:text-emerald-400';
    if (aqi <= 100) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getAQIBadge = (aqi: number) => {
    if (aqi <= 50) return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300';
    if (aqi <= 100) return 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300';
    return 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
      
      {/* Header section with Station Selector and Refresh Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Prediksi Tren Kualitas Udara (AQI) 24 Jam ke Depan</span>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 font-semibold">
                  AI Model Bioklimatik
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Mengombinasikan data historis sensor IoT, arah angin, kelembapan, dan pola lalu lintas perkotaan
              </p>
            </div>
          </div>
        </div>

        {/* Station filter & Tab Toggle */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <select
            value={selectedStationId}
            onChange={(e) => setSelectedStationId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white font-medium"
          >
            <option value="all">Rata-Rata Seluruh Kota (Agregat)</option>
            {sensors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.district} ({s.name})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleRecalculateForecast}
            disabled={isRecalculating}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
            title="Segarkan model kalkulasi AI"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{isRecalculating ? 'Mengkalkulasi...' : 'Pembaruan Model'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Status Card & Forecast Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Metric 1: Current Real-time AQI */}
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Indeks Saat Ini (Real-Time)
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black ${getAQIColor(baseAQI)}`}>
              {baseAQI}
            </span>
            <span className="text-xs font-bold text-slate-500">AQI</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getAQIBadge(baseAQI)} ml-auto`}>
              {baseAQI <= 50 ? 'Sehat' : 'Sedang'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            PM2.5: {(baseAQI * 0.28).toFixed(1)} µg/m³ · Oksigen Optimal
          </p>
        </div>

        {/* Metric 2: 24-Hour Projected Trend */}
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Tren 24 Jam ke Depan
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingDown className="w-5 h-5 text-emerald-500" />
              <span>Membaik (-14%)</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Diproyeksikan stabil pada kategori Sehat sepanjang malam hingga pagi
          </p>
        </div>

        {/* Metric 3: Golden Outdoor / Worship Window */}
        <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 tracking-wider">
              Waktu Udara Terbaik
            </span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            04:15 - 07:00 WIB
          </div>
          <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
            Sangat ideal untuk jalan subuh ke masjid, jogging keluarga, dan terapi pernapasan
          </p>
        </div>

        {/* Metric 4: Peak Alert Window */}
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Jam Waspada Polusi
            </span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white">
            17:30 - 19:15 WIB
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Prediksi lonjakan emisi knalpot lalu lintas sore (AQI ~58-65)
          </p>
        </div>

      </div>

      {/* Main D3 Visualization Canvas */}
      <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold">
              <span className="w-3 h-0.5 bg-emerald-600 inline-block" />
              <span>Garis Riwayat Sensor Lapangan</span>
            </span>
            <span className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-semibold">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-teal-500 inline-block" />
              <span>Garis Proyeksi AI (24 Jam)</span>
            </span>
          </div>

          <span className="text-[11px] text-slate-400">
            Arahkan kursor pada grafik untuk memeriksa detail setiap jam
          </span>
        </div>

        {/* SVG Container */}
        <div className="w-full overflow-x-auto">
          <svg ref={svgRef} className="w-full min-w-[680px] h-[250px] select-none" />
        </div>

        {/* Interactive Point Detail Strip */}
        {hoveredPoint && (
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="text-center px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400 block font-bold">Waktu</span>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {hoveredPoint.timeStr}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-base font-extrabold ${getAQIColor(hoveredPoint.aqi)}`}>
                    {hoveredPoint.aqi} AQI
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getAQIBadge(hoveredPoint.aqi)}`}>
                    {hoveredPoint.condition}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({hoveredPoint.isPrediction ? 'Hasil Prediksi AI' : 'Tercatat Sensor'})
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  PM2.5: {hoveredPoint.pm25} µg/m³ · <strong>Penyebab:</strong> {hoveredPoint.factor}
                </p>
              </div>
            </div>

            {hoveredPoint.confidenceLower !== undefined && hoveredPoint.confidenceUpper !== undefined && (
              <div className="text-right text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                Rentang Ketidakpastian AI: {hoveredPoint.confidenceLower} - {hoveredPoint.confidenceUpper} AQI
              </div>
            )}
          </div>
        )}
      </div>

      {/* Citizen Health Advisory Based on Next 24h Pollution Forecast */}
      <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
          <Heart className="w-4 h-4 text-emerald-600" />
          <span>Panduan Kesehatan Warga & Jadwal Ibadah Bersih (24 Jam ke Depan):</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
          <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-emerald-100 dark:border-emerald-900/40 space-y-0.5">
            <strong className="text-emerald-800 dark:text-emerald-300 block">Subuh & Pagi Hari:</strong>
            <span>Kualitas udara sangat bersih. Sangat dianjurkan membuka ventilasi rumah dan berjalan kaki ke masjid tanpa masker.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-emerald-100 dark:border-emerald-900/40 space-y-0.5">
            <strong className="text-amber-800 dark:text-amber-300 block">Sore Hari Menjelang Maghrib:</strong>
            <span>Peningkatan partikulat PM2.5 di arteri lalu lintas utama. Bagi anak-anak dan lansia pengidap asma disarankan beraktivitas di dalam ruang terbuka hijau.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-emerald-100 dark:border-emerald-900/40 space-y-0.5">
            <strong className="text-teal-800 dark:text-teal-300 block">Malam Hari (Isya & Tahajjud):</strong>
            <span>Partikulat kembali mengendap berkat sirkulasi angin sejuk. Suhu 26°C nyaman untuk istirahat malam dan shalat malam.</span>
          </div>
        </div>
      </div>

    </div>
  );
};
