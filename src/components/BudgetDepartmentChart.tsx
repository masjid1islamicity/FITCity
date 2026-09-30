import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BudgetItem } from '../types';
import { PieChart, BarChart3, Info, Building2, CheckCircle2, TrendingUp } from 'lucide-react';

interface DepartmentBudgetData {
  department: string;
  shortName: string;
  allocatedAmount: number;
  realizedAmount: number;
  progressPercent: number;
  sector: string;
  programsCount: number;
  color: string;
}

interface BudgetDepartmentChartProps {
  budgetItems: BudgetItem[];
}

export const BudgetDepartmentChart: React.FC<BudgetDepartmentChartProps> = ({ budgetItems }) => {
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');
  const [activeDepartment, setActiveDepartment] = useState<DepartmentBudgetData | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Group budget items by responsible agency (department)
  const departmentData: DepartmentBudgetData[] = React.useMemo(() => {
    const palette = [
      '#059669', // Emerald 600
      '#0d9488', // Teal 600
      '#0284c7', // Sky 600
      '#10b981', // Emerald 500
      '#f59e0b', // Amber 500
      '#6366f1', // Indigo 500
    ];

    const map = new Map<string, { allocated: number; realized: number; sector: string; count: number }>();

    budgetItems.forEach((item) => {
      const existing = map.get(item.responsibleAgency) || { allocated: 0, realized: 0, sector: item.sector, count: 0 };
      existing.allocated += item.allocatedAmount;
      existing.realized += item.realizedAmount;
      existing.count += 1;
      map.set(item.responsibleAgency, existing);
    });

    const entries = Array.from(map.entries());
    return entries.map(([dept, data], idx) => {
      // Shorten department name for clean display
      const shortName = dept
        .replace('Dinas ', '')
        .replace(' & Badan Pengelola Transportasi', '')
        .replace(' & Pengendalian Banjir', '')
        .replace(' & Tim Penggerak Kesejahteraan Keluarga', '')
        .replace(' & Asosiasi Pengobat Tradisional', '')
        .replace(' & Tata Ruang', '');

      return {
        department: dept,
        shortName,
        allocatedAmount: data.allocated,
        realizedAmount: data.realized,
        progressPercent: Math.round((data.realized / data.allocated) * 100),
        sector: data.sector,
        programsCount: data.count,
        color: palette[idx % palette.length],
      };
    });
  }, [budgetItems]);

  const totalAllocated = departmentData.reduce((acc, curr) => acc + curr.allocatedAmount, 0);

  // Default active department to first one
  useEffect(() => {
    if (departmentData.length > 0 && !activeDepartment) {
      setActiveDepartment(departmentData[0]);
    }
  }, [departmentData, activeDepartment]);

  // Render D3 Chart
  useEffect(() => {
    if (!svgRef.current || departmentData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 440;
    const height = 300;

    if (chartType === 'donut') {
      const radius = Math.min(width, height) / 2 - 20;
      const innerRadius = radius * 0.58;

      const g = svg
        .attr('viewBox', `0 0 ${width} ${height}`)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

      const pie = d3
        .pie<DepartmentBudgetData>()
        .value((d) => d.allocatedAmount)
        .sort(null);

      const arc = d3
        .arc<d3.PieArcDatum<DepartmentBudgetData>>()
        .innerRadius(innerRadius)
        .outerRadius(radius)
        .cornerRadius(6)
        .padAngle(0.025);

      const hoverArc = d3
        .arc<d3.PieArcDatum<DepartmentBudgetData>>()
        .innerRadius(innerRadius - 4)
        .outerRadius(radius + 8)
        .cornerRadius(6)
        .padAngle(0.025);

      const arcs = g
        .selectAll('.arc')
        .data(pie(departmentData))
        .enter()
        .append('g')
        .attr('class', 'arc')
        .style('cursor', 'pointer');

      arcs
        .append('path')
        .attr('d', arc)
        .attr('fill', (d) => d.data.color)
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2)
        .style('transition', 'all 0.25s ease')
        .on('mouseenter', function (_event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('d', hoverArc as any)
            .attr('opacity', 1);
          setActiveDepartment(d.data);
        })
        .on('mouseleave', function () {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('d', arc as any);
        });

      // Center text in donut
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.3em')
        .attr('class', 'fill-slate-400 dark:fill-slate-500 text-[11px] font-semibold uppercase tracking-wider')
        .text('Total Alokasi');

      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1em')
        .attr('class', 'fill-slate-900 dark:fill-white font-extrabold text-lg')
        .text(`Rp ${(totalAllocated / 1_000_000_000).toFixed(0)} M`);
    } else {
      // Bar Chart: Alokasi vs Realisasi
      const margin = { top: 20, right: 24, bottom: 65, left: 40 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const g = svg
        .attr('viewBox', `0 0 ${width} ${height}`)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const x0 = d3
        .scaleBand()
        .domain(departmentData.map((d) => d.shortName))
        .rangeRound([0, innerWidth])
        .paddingInner(0.2);

      const x1 = d3
        .scaleBand()
        .domain(['Alokasi', 'Realisasi'])
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05);

      const maxVal = d3.max(departmentData, (d) => Math.max(d.allocatedAmount, d.realizedAmount)) || 1;
      const y = d3
        .scaleLinear()
        .domain([0, maxVal / 1_000_000_000 * 1.15])
        .range([innerHeight, 0]);

      // Y-axis grid lines
      g.append('g')
        .attr('class', 'grid')
        .call(
          d3
            .axisLeft(y)
            .ticks(4)
            .tickSize(-innerWidth)
            .tickFormat(() => '')
        )
        .selectAll('line')
        .attr('stroke', 'currentColor')
        .attr('stroke-opacity', 0.08);

      // Bars
      const deptGroup = g
        .selectAll('.dept-group')
        .data(departmentData)
        .enter()
        .append('g')
        .attr('class', 'dept-group')
        .attr('transform', (d) => `translate(${x0(d.shortName)}, 0)`)
        .style('cursor', 'pointer')
        .on('mouseenter', (_event, d) => {
          setActiveDepartment(d);
        });

      // Allocated bar
      deptGroup
        .append('rect')
        .attr('x', () => x1('Alokasi') || 0)
        .attr('y', (d) => y(d.allocatedAmount / 1_000_000_000))
        .attr('width', x1.bandwidth())
        .attr('height', (d) => innerHeight - y(d.allocatedAmount / 1_000_000_000))
        .attr('fill', (d) => d.color)
        .attr('rx', 3)
        .attr('opacity', 0.85);

      // Realized bar
      deptGroup
        .append('rect')
        .attr('x', () => x1('Realisasi') || 0)
        .attr('y', (d) => y(d.realizedAmount / 1_000_000_000))
        .attr('width', x1.bandwidth())
        .attr('height', (d) => innerHeight - y(d.realizedAmount / 1_000_000_000))
        .attr('fill', '#059669')
        .attr('rx', 3);

      // X Axis
      g.append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(x0))
        .selectAll('text')
        .attr('transform', 'rotate(-25)')
        .style('text-anchor', 'end')
        .attr('dx', '-0.5em')
        .attr('dy', '0.6em')
        .attr('class', 'fill-slate-600 dark:fill-slate-400 text-[10px] font-semibold');

      // Y Axis text
      g.append('g')
        .call(d3.axisLeft(y).ticks(4).tickFormat((d) => `${d}M`))
        .selectAll('text')
        .attr('class', 'fill-slate-400 text-[10px]');
    }
  }, [departmentData, chartType, totalAllocated]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
      
      {/* Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Visualisasi Alokasi Anggaran Kota per OPD (D3.js Interactive Chart)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Peta proporsi belanja daerah agar informasi keuangan lebih mudah dipahami oleh seluruh warga
          </p>
        </div>

        {/* View Switcher buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartType('donut')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              chartType === 'donut'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Proporsi Donat</span>
          </button>

          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium rounded-md transition-colors cursor-pointer ${
              chartType === 'bar'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Alokasi vs Realisasi</span>
          </button>
        </div>
      </div>

      {/* Main Grid: D3 Chart SVG + Department Interactive Focus Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Interactive D3 SVG Render (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <svg
            ref={svgRef}
            className="w-full max-w-[440px] h-[280px] sm:h-[300px] select-none"
          />

          {chartType === 'bar' && (
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600 dark:text-slate-300 pb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-slate-400 inline-block" />
                <span>Pagu Alokasi (Miliar)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
                <span>Realisasi Fisik (Miliar)</span>
              </span>
            </div>
          )}
          {chartType === 'donut' && (
            <span className="text-[11px] text-slate-400 pb-1">
              Arahkan kursor atau klik potongan donat untuk meneliti rincian OPD
            </span>
          )}
        </div>

        {/* Right: Active Department Breakdown & Citizen Context (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {activeDepartment ? (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3.5 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: activeDepartment.color }}
                    />
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {activeDepartment.sector}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {activeDepartment.department}
                  </h4>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {activeDepartment.progressPercent}%
                  </span>
                  <span className="text-[10px] text-slate-400 block">Terserap</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${activeDepartment.progressPercent}%`,
                    backgroundColor: activeDepartment.color,
                  }}
                />
              </div>

              {/* Numerical breakdown */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Total Pagu Alokasi</span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Rp {(activeDepartment.allocatedAmount / 1_000_000_000).toFixed(1)} Miliar
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    ({((activeDepartment.allocatedAmount / totalAllocated) * 100).toFixed(1)}% dari APBD Kota)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Realisasi Lapangan</span>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                    Rp {(activeDepartment.realizedAmount / 1_000_000_000).toFixed(1)} Miliar
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Sisa pagu: Rp {((activeDepartment.allocatedAmount - activeDepartment.realizedAmount) / 1_000_000_000).toFixed(1)} M
                  </span>
                </div>
              </div>

              {/* Citizen-Friendly Takeaway */}
              <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-xs space-y-1">
                <div className="font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dampak Nyata Bagi Warga FITCity:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  Alokasi ini membiayai pengoperasian sarana publik bebas pungli, pemeliharaan infrastruktur berkelanjutan, serta penguatan pelayanan masyarakat di seluruh kelurahan.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Pilih salah satu bagian grafik untuk melihat rincian OPD.
            </div>
          )}

          {/* Quick Department Legend Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {departmentData.map((d) => (
              <button
                key={d.shortName}
                type="button"
                onClick={() => setActiveDepartment(d)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] border transition-all cursor-pointer ${
                  activeDepartment?.shortName === d.shortName
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 font-bold text-slate-900 dark:text-white shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span>{d.shortName}</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  ({((d.allocatedAmount / totalAllocated) * 100).toFixed(0)}%)
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
