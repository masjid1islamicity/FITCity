import React, { useState } from 'react';
import { 
  Coins, 
  FileCheck2, 
  Building2, 
  CheckCircle, 
  Download, 
  Search, 
  ShieldCheck, 
  TrendingUp, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { BUDGET_ITEMS } from '../data/mockData';
import { BudgetItem } from '../types';
import { BudgetDepartmentChart } from './BudgetDepartmentChart';
import { BudgetRechartsDashboard } from './BudgetRechartsDashboard';

export const BudgetTransparency: React.FC = () => {
  const [budgetItems] = useState<BudgetItem[]>(BUDGET_ITEMS);
  const [selectedSector, setSelectedSector] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [auditedItemId, setAuditedItemId] = useState<string | null>(null);
  const [chartView, setChartView] = useState<'recharts' | 'department' | 'all'>('recharts');

  const totalAllocated = budgetItems.reduce((acc, curr) => acc + curr.allocatedAmount, 0);
  const totalRealized = budgetItems.reduce((acc, curr) => acc + curr.realizedAmount, 0);
  const overallRealizationRate = ((totalRealized / totalAllocated) * 100).toFixed(1);

  const filteredItems = budgetItems.filter((item) => {
    const matchSector = selectedSector === 'Semua' || item.sector === selectedSector;
    const matchSearch = item.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.responsibleAgency.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSector && matchSearch;
  });

  const formatIDR = (amount: number) => {
    if (amount >= 1_000_000_000) {
      return `Rp ${(amount / 1_000_000_000).toFixed(1)} Miliar`;
    }
    return `Rp ${(amount / 1_000_000).toFixed(0)} Juta`;
  };

  const handleCitizenAuditFeedback = (id: string) => {
    setAuditedItemId(id);
    setTimeout(() => setAuditedItemId(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Coins className="w-6 h-6 text-emerald-600" />
            <span>Dasbor Transparansi Anggaran Publik (Open APBD)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Akuntabilitas real-time seluruh alokasi dana perbaikan infrastruktur, bantuan sosial, dan efisiensi belanja publik kota.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Audit BPK Opini WTP Terverifikasi</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-1 transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Alokasi Program Utama
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {formatIDR(totalAllocated)}
          </div>
          <p className="text-xs text-slate-500">Mencakup 5 sektor prioritas pelayanan warga</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-1 transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Realisasi Serapan Anggaran
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {formatIDR(totalRealized)}
          </div>
          <p className="text-xs text-slate-500">Terserap akuntabel tanpa temuan fiktif</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-1 transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Persentase Progres Realisasi
          </span>
          <div className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
            {overallRealizationRate}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full"
              style={{ width: `${overallRealizationRate}%` }}
            />
          </div>
        </div>

      </div>

      {/* Visual Perspective Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 dark:text-white">Perspektif Analisis Visual APBD:</span>
          <span className="text-xs text-slate-400 hidden sm:inline">Pilih sudut pandang pengawasan belanja daerah</span>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartView('recharts')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              chartView === 'recharts'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Infrastruktur vs Layanan Sosial (Recharts)
          </button>
          <button
            type="button"
            onClick={() => setChartView('department')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              chartView === 'department'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Alokasi Dinas / SKPD (D3)
          </button>
          <button
            type="button"
            onClick={() => setChartView('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              chartView === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Tampilkan Keduanya
          </button>
        </div>
      </div>

      {/* Recharts Municipal Budget Allocation Breakdown Dashboard */}
      {(chartView === 'recharts' || chartView === 'all') && (
        <BudgetRechartsDashboard budgetItems={budgetItems} />
      )}

      {/* D3.js City Budget Allocation by Department Visualization Chart */}
      {(chartView === 'department' || chartView === 'all') && (
        <BudgetDepartmentChart budgetItems={budgetItems} />
      )}

      {/* Budget Programs Table & Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Daftar Paket Program & Rincian Penggunaan Dana
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Setiap warga berhak meneliti capaian milestone dan memberi masukan audit lapangan
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari program atau dinas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Sector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs overflow-x-auto">
          {['Semua', 'Infrastruktur & Transportasi Hijau', 'Kebersihan & Lingkungan', 'Bantuan Sosial & Gizi', 'Kesehatan & Puskesmas'].map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedSector === sec
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* List of Budget Projects */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 bg-slate-50/50 dark:bg-slate-800/40 transition-all space-y-3"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">{item.sector}</span>
                    <span aria-hidden="true">·</span>
                    <span>Wilayah: {item.district}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">Skor Audit Warga: {item.auditScore}/100</span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {item.programName}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>Milestone Lapangan:</strong> {item.recentMilestone}
                  </p>
                </div>

                <div className="text-left md:text-right shrink-0">
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {formatIDR(item.realizedAmount)} / {formatIDR(item.allocatedAmount)}
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Progres Fisik: {item.progressPercent}%
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${item.progressPercent}%` }}
                />
              </div>

              {/* Meta information & Citizen audit button */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                <div className="text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-3">
                  <span>Dinas Pengampu: <strong>{item.responsibleAgency}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Pelaksana: <strong>{item.contractor}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  {auditedItemId === item.id ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Audit Warga Terverifikasi
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCitizenAuditFeedback(item.id)}
                      className="px-3 py-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verifikasi & Nilai Transparansi</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
