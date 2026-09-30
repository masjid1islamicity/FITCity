import React, { useState } from 'react';
import { 
  TrendingUp, 
  Leaf, 
  Users, 
  ShieldCheck, 
  Zap, 
  Activity, 
  ArrowUpRight, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  AlertCircle,
  Bus,
  CheckCircle2,
  Calendar,
  Heart
} from 'lucide-react';
import { AppTab } from '../types';
import { sound } from '../services/audio';

interface DashboardExecutiveProps {
  setActiveTab: (tab: AppTab) => void;
  isSyncing: boolean;
  triggerManualSync: () => void;
  triggerGeoAlert: (district: string, message: string) => void;
}

export const DashboardExecutive: React.FC<DashboardExecutiveProps> = ({
  setActiveTab,
  isSyncing,
  triggerManualSync,
  triggerGeoAlert
}) => {
  const [predictiveTimeframe, setPredictiveTimeframe] = useState<'7 Hari' | '30 Hari' | 'Triwulan'>('30 Hari');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleSimulateWarningBroadcast = () => {
    sound.playAlertTone();
    triggerGeoAlert('Kawasan Barat', 'Peringatan Dini: Debit Aliran Sungai Barat naik ke status Waspada. Pompa otomatis 1, 2, dan 3 telah diaktifkan.');
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Executive Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative Islamic geometric lattice motif in background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-300">
            <span className="bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-md">
              Sistem Operasi Cerdas Kota Madani
            </span>
            <span>·</span>
            <span>Pusat Komando & Analitik Real-Time</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Sensor Lapangan Aktif (99.8%)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Dasbor Eksekutif Pelayanan Publik, Jejak Karbon & Kebugaran Terpadu
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-light">
            Mengintegrasikan seluruh data kota mulai dari transportasi rendah emisi, transparansi APBD, penanganan keluhan cerdas bertenaga AI, hingga ketahanan pangan sosial dan pembinaan kebugaran jasmani masyarakat perkotaan.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('complaint-ai')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Pantau Tiket Perbaikan AI</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleSimulateWarningBroadcast}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <AlertCircle className="w-4 h-4 text-amber-300" />
              <span>{broadcastSent ? 'Peringatan Terkirim ke Kawasan Barat!' : 'Kirim Peringatan Dini Wilayah'}</span>
            </button>

            <button
              onClick={() => setActiveTab('worship-journal')}
              className="px-4 py-2 bg-emerald-950/70 hover:bg-emerald-950 text-emerald-200 border border-emerald-600/40 font-semibold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-emerald-400" />
              <span>Target Ibadah & Kebugaran Hari Ini</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Public Service CSAT */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Kepuasan Publik (CSAT)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">96.4%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              +3.2%
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Berdasarkan 14.280 ulasan warga terverifikasi biometrik
          </p>
        </div>

        {/* KPI 2: AI Complaint SLA */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Kecepatan Respons SLA</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">7.4 Jam</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              Target 24 Jam
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Triage otomatis AI langsung ke tim reaksi cepat OPD
          </p>
        </div>

        {/* KPI 3: Carbon Reduction */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Penurunan Jejak Karbon</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">-18.4%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              512 Ton CO2e
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Elektrifikasi armada bus TransFIT & PLTS atap cerdas
          </p>
        </div>

        {/* KPI 4: Social Aid Accuracy */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Ketepatan Bansos & Gizi</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">99.1%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              Nol Pungli
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Distribusi presisi via barcode QR & verifikasi NIK warga
          </p>
        </div>
      </div>

      {/* Main Two-Column Row: Predictive Analytics Engine & Quick Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Predictive Civic & Carbon Engine */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Sistem Analitik Data Prediktif Kota Berkelanjutan
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Proyeksi beban layanan perkotaan, efisiensi energi hijau, dan pola pergerakan warga
              </p>
            </div>

            {/* Timeframe Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
              {(['7 Hari', '30 Hari', 'Triwulan'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setPredictiveTimeframe(t)}
                  className={`px-3 py-1 font-medium rounded-md transition-colors cursor-pointer ${
                    predictiveTimeframe === t
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Predictive Metrics Card Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-xs text-slate-500 dark:text-slate-400">Puncak Lonjakan Penumpang</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                06:30 - 08:30 WIB
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <span>Rekomendasi: Tambah 4 unit TransFIT koridor 1</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-xs text-slate-500 dark:text-slate-400">Injeksi Tenaga Surya (PLTS)</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                485.6 kW Peak
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <span>Menyuplai 42% kebutuhan gedung balai kota</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <span className="text-xs text-slate-500 dark:text-slate-400">Prediksi Potensi Genangan Air</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                Indeks Rendah (12%)
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <span>Kapasitas waduk retensi mencukupi hujan 80mm</span>
              </div>
            </div>
          </div>

          {/* AI Decision Recommendations */}
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-2.5">
            <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Rekomendasi Cerdas Pengambilan Kebijakan Pemkot (Minggu Ini)</span>
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Prioritas Infrastruktur:</strong> Peningkatan perkerasan jalan di koridor Jl. Merpati Putih telah menurunkan risiko kecelakaan kendaraan roda dua sebesar 85%.
              </li>
              <li>
                <strong>Ketahanan Pangan:</strong> Stok bansos di Sentra Islamic Center Pusat diproyeksikan mencukupi kebutuhan 2.000 KK penerima hingga akhir pekan depan.
              </li>
              <li>
                <strong>Gerakan Sehat Masyarakat:</strong> Partisipasi warga dalam "Gerakan 10.000 Langkah Subuh Berjamaah" meningkat 28%, berkontribusi pada penurunan keluhan nyeri sendi dan hipertensi ringan di puskesmas.
              </li>
            </ul>
          </div>
        </div>

        {/* Right 1 Col: Quick Control & City Health Status */}
        <div className="space-y-4">
          
          {/* Cloud Sync Status Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Status Sinkronisasi Cloud
              </h4>
              <button
                onClick={triggerManualSync}
                disabled={isSyncing}
                className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Segarkan</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Perangkat Pengguna</span>
                <span className="font-semibold text-slate-900 dark:text-white">HP Android & Smartwatch</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Koneksi IoT Lapangan</span>
                <span className="font-semibold text-emerald-600">Online 100% LoRaWAN</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Status Keamanan</span>
                <span className="font-semibold text-slate-900 dark:text-white">Enkripsi End-to-End</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveTab('family-fitness')}
                className="w-full py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 text-center transition-colors cursor-pointer"
              >
                Buka Pelacak Kebugaran Keluarga →
              </button>
            </div>
          </div>

          {/* The Beauty Health Center & World Bekam Spotlight */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-5 shadow-xs space-y-3 border border-emerald-700/40">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Heart className="w-4 h-4 text-emerald-400" />
              <span>The Beauty Health Center</span>
            </div>
            
            <h4 className="text-sm font-bold text-white">
              World Bekam Islamicity & Thibbun Nabawi
            </h4>

            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Pusat riset internasional dengan pembuktian ilmiah medis (evidence-based medicine) tentang manfaat bekam sunnah, penurunan biomarker peradangan, dan vitalitas stamina ibadah.
            </p>

            <button
              onClick={() => setActiveTab('beauty-health-bekam')}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Jelajahi Riset & Konsultasi AI →
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
