import React, { useState } from 'react';
import { 
  Leaf, 
  Wind, 
  Sun, 
  Droplets, 
  Activity, 
  TrendingDown, 
  ArrowUpRight, 
  Zap, 
  RefreshCw,
  Sparkles,
  ShieldAlert,
  MapPin
} from 'lucide-react';
import { IOT_SENSORS } from '../data/mockData';
import { IoTSensorData } from '../types';
import { AQIPredictionWidget } from './AQIPredictionWidget';

export const IoTCustomCarbon: React.FC = () => {
  const [sensors, setSensors] = useState<IoTSensorData[]>(IOT_SENSORS);
  const [refreshing, setRefreshing] = useState(false);

  const totalCarbonOffset = sensors.reduce((acc, curr) => acc + curr.carbonOffsetTonsThisMonth, 0);
  const totalSolarKwh = sensors.reduce((acc, curr) => acc + curr.solarEnergyGeneratedKwh, 0);
  const averageAQI = Math.round(sensors.reduce((acc, curr) => acc + curr.aqi, 0) / sensors.length);

  const handleRefreshSensors = () => {
    setRefreshing(true);
    setTimeout(() => {
      setSensors((prev) =>
        prev.map((s) => ({
          ...s,
          temperature: +(s.temperature + (Math.random() * 0.4 - 0.2)).toFixed(1),
          aqi: Math.max(15, Math.min(80, Math.round(s.aqi + (Math.random() * 4 - 2)))),
          lastUpdated: 'Baru saja'
        }))
      );
      setRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-600" />
            <span>Pengurangan Jejak Karbon & Pemantauan Lingkungan IoT</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Jaringan sensor cerdas perkotaan untuk pemantauan kualitas udara, efisiensi energi surya, dan reduksi emisi CO2.
          </p>
        </div>

        <button
          onClick={handleRefreshSensors}
          disabled={refreshing}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Segarkan Sensor IoT</span>
        </button>
      </div>

      {/* Top Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Metric 1: Total CO2 Offset */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-200 font-medium">
            <span>Reduksi Emisi Bulan Ini</span>
            <TrendingDown className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="text-3xl font-black tracking-tight">
            {totalCarbonOffset.toFixed(1)} <span className="text-lg font-normal text-emerald-200">Ton CO2e</span>
          </div>
          <p className="text-xs text-emerald-100/80">
            Setara dengan menanam 24.800 pohon rimbun di ruang terbuka hijau kota
          </p>
        </div>

        {/* Metric 2: Solar Clean Energy */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Energi Surya Terpasang (PLTS)</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {totalSolarKwh.toLocaleString('id-ID')} <span className="text-lg font-normal text-slate-500">kWh</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dihasilkan dari atap fasilitas publik, halte cerdas, dan stasiun pengisian
          </p>
        </div>

        {/* Metric 3: City Air Quality Index */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider">Indeks Kualitas Udara (AQI Rata-rata)</span>
            <Wind className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 flex items-baseline gap-2">
            {averageAQI}
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Kategori: Baik / Sehat
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            PM2.5 rata-rata 10.1 µg/m³ memenuhi standar baku mutu WHO
          </p>
        </div>

      </div>

      {/* Real-Time AQI Visualization & 24-Hour AI Predictive Trend Widget */}
      <AQIPredictionWidget sensors={sensors} />

      {/* Sensor Station Nodes Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Stasiun Sensor Lingkungan Tersebar (Real-Time LoRaWAN)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Data telemetri ditransmisikan setiap 60 detik tanpa jeda
            </p>
          </div>
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
            {sensors.length} Stasiun Aktif
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Nama Stasiun Sensor</th>
                <th className="py-3 px-3">Wilayah</th>
                <th className="py-3 px-3">AQI / PM2.5</th>
                <th className="py-3 px-3">Suhu & Kelembapan</th>
                <th className="py-3 px-3">Reduksi CO2 (Bln)</th>
                <th className="py-3 px-3">Produksi Surya</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {sensors.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{s.name}</span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">{s.district}</td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{s.aqi} AQI</span>
                    <span className="text-slate-400 ml-1">({s.pm25} µg/m³)</span>
                  </td>
                  <td className="py-3.5 px-3">
                    {s.temperature}°C · {s.humidity}%
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                    {s.carbonOffsetTonsThisMonth} Ton
                  </td>
                  <td className="py-3.5 px-3 text-amber-600 dark:text-amber-400 font-medium">
                    {s.solarEnergyGeneratedKwh.toLocaleString('id-ID')} kWh
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                      ● {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
