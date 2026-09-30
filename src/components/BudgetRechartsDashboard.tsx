import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { 
  Building2, 
  HeartHandshake, 
  PieChart as PieIcon, 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Coins, 
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { BudgetItem } from '../types';

interface BudgetRechartsDashboardProps {
  budgetItems: BudgetItem[];
}

export const BudgetRechartsDashboard: React.FC<BudgetRechartsDashboardProps> = ({ budgetItems }) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'macro' | 'sectors'>('comparison');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'infrastructure' | 'social'>('all');

  const formatIDR = (val: number) => {
    if (val >= 1_000_000_000) {
      return `Rp ${(val / 1_000_000_000).toFixed(1)} M`;
    }
    return `Rp ${(val / 1_000_000).toFixed(0)} Jt`;
  };

  const formatFullIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Classify each budget item into Macro Group:
  // "Infrastruktur Publik" vs "Layanan Sosial & Kesehatan"
  const classifiedItems = useMemo(() => {
    return budgetItems.map((item) => {
      const isInfra = 
        item.sector === 'Infrastruktur & Transportasi Hijau' || 
        item.sector === 'Kebersihan & Lingkungan';
      return {
        ...item,
        macroGroup: isInfra ? 'Infrastruktur Publik' : 'Layanan Sosial & Kesehatan',
      };
    });
  }, [budgetItems]);

  // Macro Totals
  const macroStats = useMemo(() => {
    let infraAllocated = 0;
    let infraRealized = 0;
    let socialAllocated = 0;
    let socialRealized = 0;

    classifiedItems.forEach((item) => {
      if (item.macroGroup === 'Infrastruktur Publik') {
        infraAllocated += item.allocatedAmount;
        infraRealized += item.realizedAmount;
      } else {
        socialAllocated += item.allocatedAmount;
        socialRealized += item.realizedAmount;
      }
    });

    const totalAllocated = infraAllocated + socialAllocated;
    const infraPct = Math.round((infraAllocated / totalAllocated) * 100);
    const socialPct = 100 - infraPct;

    return {
      infraAllocated,
      infraRealized,
      infraPct,
      infraRealizationRate: Math.round((infraRealized / infraAllocated) * 100),
      socialAllocated,
      socialRealized,
      socialPct,
      socialRealizationRate: Math.round((socialRealized / socialAllocated) * 100),
    };
  }, [classifiedItems]);

  // Macro Pie Data for Recharts
  const macroPieData = useMemo(() => {
    return [
      {
        name: 'Infrastruktur Publik & Transportasi Hijau',
        value: macroStats.infraAllocated / 1_000_000_000,
        realized: macroStats.infraRealized / 1_000_000_000,
        color: '#059669', // Emerald 600
        category: 'Infrastruktur',
      },
      {
        name: 'Layanan Sosial, Gizi & Kesehatan Warga',
        value: macroStats.socialAllocated / 1_000_000_000,
        realized: macroStats.socialRealized / 1_000_000_000,
        color: '#0d9488', // Teal 600
        category: 'Sosial',
      },
    ];
  }, [macroStats]);

  // Detailed Sector Comparison Bar Data for Recharts
  const sectorBarData = useMemo(() => {
    const map = new Map<string, { sector: string; allocated: number; realized: number; macro: string }>();

    classifiedItems.forEach((item) => {
      const existing = map.get(item.sector) || {
        sector: item.sector,
        allocated: 0,
        realized: 0,
        macro: item.macroGroup,
      };
      existing.allocated += item.allocatedAmount;
      existing.realized += item.realizedAmount;
      map.set(item.sector, existing);
    });

    return Array.from(map.values())
      .filter((d) => {
        if (selectedCategory === 'infrastructure') return d.macro === 'Infrastruktur Publik';
        if (selectedCategory === 'social') return d.macro === 'Layanan Sosial & Kesehatan';
        return true;
      })
      .map((d) => ({
        name: d.sector.replace(' & ', '\n& '),
        shortName: d.sector
          .replace('Infrastruktur & Transportasi Hijau', 'Transportasi Hijau')
          .replace('Kebersihan & Lingkungan', 'Banjir & Lingkungan')
          .replace('Bantuan Sosial & Gizi', 'Bansos & Gizi')
          .replace('Kesehatan & Puskesmas', 'Kesehatan & Bekam')
          .replace('Pendidikan & Digital', 'Pendidikan'),
        Alokasi: +(d.allocated / 1_000_000_000).toFixed(1),
        Realisasi: +(d.realized / 1_000_000_000).toFixed(1),
        Persentase: Math.round((d.realized / d.allocated) * 100),
        macro: d.macro,
      }));
  }, [classifiedItems, selectedCategory]);

  // Detailed Program Level Area / Trend Data
  const programTrendData = useMemo(() => {
    return classifiedItems.map((item, idx) => ({
      name: `Prog-${idx + 1} (${item.contractor.split(' ')[1] || item.district.split(' ')[0]})`,
      programTitle: item.programName,
      Alokasi: +(item.allocatedAmount / 1_000_000_000).toFixed(1),
      Realisasi: +(item.realizedAmount / 1_000_000_000).toFixed(1),
      AuditScore: item.auditScore,
      sector: item.sector,
    }));
  }, [classifiedItems]);

  const PIE_COLORS = ['#059669', '#0d9488', '#0284c7', '#f59e0b', '#8b5cf6'];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
      
      {/* Header section with category toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Visualisasi Alokasi APBD: Infrastruktur Publik vs Layanan Sosial</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  Recharts Analytics
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pengawasan komprehensif proporsi belanja modal pembangunan kota dan jaminan kesejahteraan sosial warga
              </p>
            </div>
          </div>
        </div>

        {/* Chart View Mode Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Komparasi Sektor (Bar)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('macro')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'macro'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5 text-teal-600" />
            <span>Proporsi Makro (Donut)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sectors')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'sectors'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
            <span>Tren Realisasi (Area)</span>
          </button>
        </div>
      </div>

      {/* High-level Macro Cards: Infrastructure vs Social Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Infrastruktur Publik */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Infrastruktur Publik & Lingkungan Hijau</span>
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-200/70 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200">
              {macroStats.infraPct}% Porsi APBD
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {formatIDR(macroStats.infraAllocated)}
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">
                Realisasi: <strong>{formatIDR(macroStats.infraRealized)}</strong> ({macroStats.infraRealizationRate}%)
              </span>
            </div>

            <div className="text-right text-xs">
              <span className="font-semibold text-emerald-700 dark:text-emerald-400 block">3 Paket Program</span>
              <span className="text-slate-400 text-[11px]">Bus Listrik, Banjir IoT, PJU Surya</span>
            </div>
          </div>

          <div className="w-full bg-emerald-200/50 dark:bg-emerald-900/40 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full"
              style={{ width: `${macroStats.infraRealizationRate}%` }}
            />
          </div>
        </div>

        {/* Card 2: Layanan Sosial & Kesehatan */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-50/80 to-sky-50/50 dark:from-teal-950/30 dark:to-sky-950/20 border border-teal-200/80 dark:border-teal-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-teal-600" />
              <span>Layanan Sosial, Gizi & Kesehatan Warga</span>
            </span>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-teal-200/70 dark:bg-teal-900/60 text-teal-900 dark:text-teal-200">
              {macroStats.socialPct}% Porsi APBD
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {formatIDR(macroStats.socialAllocated)}
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">
                Realisasi: <strong>{formatIDR(macroStats.socialRealized)}</strong> ({macroStats.socialRealizationRate}%)
              </span>
            </div>

            <div className="text-right text-xs">
              <span className="font-semibold text-teal-700 dark:text-teal-400 block">2 Paket Program</span>
              <span className="text-slate-400 text-[11px]">Sembako Stunting, Bekam Dinkes</span>
            </div>
          </div>

          <div className="w-full bg-teal-200/50 dark:bg-teal-900/40 rounded-full h-2 overflow-hidden">
            <div
              className="bg-teal-600 h-2 rounded-full"
              style={{ width: `${macroStats.socialRealizationRate}%` }}
            />
          </div>
        </div>

      </div>

      {/* Recharts Visualizations Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/70 dark:border-slate-800 space-y-4">
        
        {/* Sub-header Filter for Sector Tab */}
        {activeTab === 'comparison' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Komparasi Alokasi Pagu vs Realisasi Serapan per Sektor (dalam Miliar Rupiah)
            </span>

            <div className="flex items-center gap-1">
              <span className="text-slate-400 text-[11px] mr-1">Filter Kategori:</span>
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('infrastructure')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                  selectedCategory === 'infrastructure'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Infrastruktur
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('social')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                  selectedCategory === 'social'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Sosial & Sehat
              </button>
            </div>
          </div>
        )}

        {/* View 1: Recharts Grouped Bar Chart (Allocation vs Realization) */}
        {activeTab === 'comparison' && (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sectorBarData}
                margin={{ top: 10, right: 20, left: 10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis 
                  dataKey="shortName" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  dy={8}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `Rp ${v}M`}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `Rp ${value} Miliar`,
                    name === 'Alokasi' ? 'Pagu Alokasi APBD' : 'Realisasi Serapan'
                  ]}
                  labelFormatter={(label) => `Sektor: ${label}`}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }} 
                />
                <Bar dataKey="Alokasi" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={45} />
                <Bar dataKey="Realisasi" fill="#0d9488" radius={[4, 4, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* View 2: Recharts Donut / Pie Chart (Macro Breakdown) */}
        {activeTab === 'macro' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {macroPieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      `Rp ${value} Miliar (${Math.round((value / ((macroStats.infraAllocated + macroStats.socialAllocated) / 1_000_000_000)) * 100)}%)`,
                      name
                    ]}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Distribusi Pagu Anggaran Menurut Karakteristik Belanja:
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block">
                        Infrastruktur Publik & Lingkungan
                      </strong>
                      <span className="text-[11px] text-slate-400">Belanja modal aset fisik jangka panjang</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      {macroStats.infraPct}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">{formatIDR(macroStats.infraAllocated)}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" />
                    <div>
                      <strong className="text-slate-900 dark:text-white block">
                        Layanan Sosial, Gizi & Puskesmas
                      </strong>
                      <span className="text-[11px] text-slate-400">Intervensi langsung kesejahteraan masyarakat</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-teal-600 dark:text-teal-400 text-sm">
                      {macroStats.socialPct}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">{formatIDR(macroStats.socialAllocated)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View 3: Recharts Area Chart (Program Level Spending & Audit Score Trend) */}
        {activeTab === 'sectors' && (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={programTrendData}
                margin={{ top: 10, right: 20, left: 10, bottom: 25 }}
              >
                <defs>
                  <linearGradient id="colorAlloc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorRealiz" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  dy={8}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `Rp ${v}M`}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `Rp ${value} Miliar`,
                    name === 'Alokasi' ? 'Alokasi Kontrak' : 'Serapan Realisasi'
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="Alokasi" stroke="#059669" fillOpacity={1} fill="url(#colorAlloc)" />
                <Area type="monotone" dataKey="Realisasi" stroke="#0d9488" fillOpacity={1} fill="url(#colorRealiz)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>

      {/* Governance & Citizen Oversight Footnote */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Setiap rupiah dalam alokasi infrastruktur dan layanan sosial diaudit langsung oleh BPK RI serta terbuka untuk audit partisipatif warga.
          </span>
        </div>

        <span className="font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
          Opini WTP (Wajar Tanpa Pengecualian)
        </span>
      </div>

    </div>
  );
};
