import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ThumbsUp, 
  MapPin, 
  Camera, 
  Filter, 
  Layers,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Mic
} from 'lucide-react';
import { INITIAL_COMPLAINTS } from '../data/mockData';
import { CitizenComplaint } from '../types';
import { analyzeComplaintWithAI } from '../services/api';
import { sound } from '../services/audio';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { VoiceDictationButton } from './VoiceDictationButton';

interface ComplaintSystemAIProps {
  onNewComplaintCreated?: (complaint: CitizenComplaint) => void;
}

export const ComplaintSystemAI: React.FC<ComplaintSystemAIProps> = ({ onNewComplaintCreated }) => {
  const [complaints, setComplaints] = useState<CitizenComplaint[]>(INITIAL_COMPLAINTS);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState('Pusat Kota');
  const [locationDetail, setLocationDetail] = useState('');
  const [categoryHint, setCategoryHint] = useState('Kebersihan & Lingkungan');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<CitizenComplaint | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('Semua');

  // Voice-to-Text Speech Recognition Hook
  const { isListening, toggleListening, isSupported, errorMsg } = useSpeechToText((spokenText) => {
    setDescription((prev) => {
      // If previous description was empty, set it directly, otherwise append
      if (!prev.trim()) return spokenText;
      return `${prev} ${spokenText}`;
    });
  });

  const complaintSamplePrompts = [
    'Timbunan sampah organik dan plastik menumpuk di saluran air depan pasar madani',
    'Lubang aspal sedalam 15 cm di perempatan lampu merah membahayakan jamaah subuh',
    'Lampu penerangan tenaga surya padam total di gang musholla'
  ];

  const handleSelectSample = (sample: string) => {
    setDescription(sample);
    if (!title) {
      setTitle(sample.slice(0, 48) + '...');
    }
  };

  const handleUpvote = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, upvotesCount: c.upvotesCount + 1 } : c))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsAnalyzing(true);
    sound.playAlertTone();

    try {
      const aiAnalysis = await analyzeComplaintWithAI({
        title,
        description,
        district,
        categoryHint
      });

      const newId = `LAPOR-2026-0${Math.floor(82 + Math.random() * 50)}`;
      const now = new Date();
      const timeStr = `${now.getDate()} Sept 2026, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

      const newComplaint: CitizenComplaint = {
        id: newId,
        title,
        description,
        district,
        locationDetail: locationDetail || `Wilayah ${district}`,
        category: aiAnalysis.category,
        urgency: aiAnalysis.urgency,
        severityScore: aiAnalysis.severityScore,
        assignedDepartment: aiAnalysis.assignedDepartment,
        status: 'terverifikasi_ai',
        createdAt: timeStr,
        updatedAt: timeStr,
        estimatedSLA: aiAnalysis.estimatedSLA,
        recommendedAction: aiAnalysis.recommendedAction,
        citizenNotice: aiAnalysis.citizenNotice,
        reporterName: 'Warga Peduli (Anda)',
        upvotesCount: 1
      };

      setComplaints((prev) => [newComplaint, ...prev]);
      setSubmissionFeedback(newComplaint);
      if (onNewComplaintCreated) {
        onNewComplaintCreated(newComplaint);
      }

      // Reset form
      setTitle('');
      setDescription('');
      setLocationDetail('');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    if (filterCategory === 'Semua') return true;
    return c.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  const getStatusText = (status: CitizenComplaint['status']) => {
    switch (status) {
      case 'diajukan': return 'Diajukan Warga';
      case 'terverifikasi_ai': return 'Tervalidasi AI & Terdisposisi';
      case 'petugas_diterjunkan': return 'Petugas Lapangan Dikerahkan';
      case 'dalam_pengerjaan': return 'Dalam Pengerjaan Fisik';
      case 'selesai_terverifikasi': return 'Selesai 100% Terverifikasi';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-emerald-600" />
          <span>Sistem Pelaporan Keluhan & Kebersihan Lingkungan (AI Terintegrasi)</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Layanan keluhan cerdas: sistem AI menganalisis tingkat keparahan, menentukan dinas terkait seketika, dan memberikan estimasi SLA penanganan.
        </p>
      </div>

      {/* Main Grid: Submit Form + Latest AI Triage Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Submit Report (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Kirim Laporan Kendala Mandiri Berbasis Lokasi
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Judul Laporan Singkat
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Saluran air tersumbat sampah di depan masjid..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Wilayah / Distrik
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white"
                >
                  <option value="Pusat Kota">Pusat Kota</option>
                  <option value="Kawasan Timur">Kawasan Timur</option>
                  <option value="Kawasan Barat">Kawasan Barat</option>
                  <option value="Kawasan Selatan">Kawasan Selatan</option>
                  <option value="Kawasan Utara">Kawasan Utara</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dugaan Kategori
                </label>
                <select
                  value={categoryHint}
                  onChange={(e) => setCategoryHint(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white"
                >
                  <option value="Kebersihan & Sampah">Kebersihan & Sampah</option>
                  <option value="Infrastruktur Jalan">Infrastruktur Jalan</option>
                  <option value="Drainase & Banjir">Drainase & Banjir</option>
                  <option value="Penerangan Jalan">Penerangan Jalan</option>
                  <option value="Fasilitas Umum & Masjid">Fasum & Masjid</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Detail Lokasi Spesifik
              </label>
              <input
                type="text"
                placeholder="Contoh: Jl. Ahmad Dahlan No. 12 RT 04 / RW 02..."
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Deskripsi Kendala & Dampak Bagi Warga
                </label>
                
                {/* Voice-to-Text Button */}
                <VoiceDictationButton
                  isListening={isListening}
                  onToggle={toggleListening}
                  isSupported={isSupported}
                  samplePrompts={complaintSamplePrompts}
                  onSelectSample={handleSelectSample}
                  label="Dikte Suara (Hands-Free)"
                />
              </div>

              {isListening && (
                <div className="mb-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-[11px] text-rose-800 dark:text-rose-200 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                    <span>Mikrofon aktif: Silakan bicara dalam Bahasa Indonesia, suara Anda dikonversi ke teks secara real-time...</span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleListening}
                    className="font-bold text-rose-700 dark:text-rose-300 hover:underline cursor-pointer"
                  >
                    Selesai
                  </button>
                </div>
              )}

              {errorMsg && (
                <div className="mb-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200">
                  {errorMsg} (Anda tetap dapat mengetik manual atau memilih contoh suara cepat).
                </div>
              )}

              <textarea
                required
                rows={3}
                placeholder="Jelaskan kondisi di lapangan secara jelas untuk membantu akurasi pemindaian AI atau gunakan tombol Dikte Suara..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Foto Bukti Lapangan Tersemat Otomatis (Geo-Tag)</span>
              </div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">GPS Terhubung</span>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI Sedang Memindai & Mengklasifikasi...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Laporan & Triage AI Otomatis</span>
                </>
              )}
            </button>
          </form>

          {/* AI Result Card */}
          {submissionFeedback && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Hasil Analisis AI FITCity ({submissionFeedback.id})
                </span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  Urgensi: {submissionFeedback.urgency}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                <strong>Disposisi:</strong> {submissionFeedback.assignedDepartment} (SLA: {submissionFeedback.estimatedSLA})
              </p>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 italic">
                "{submissionFeedback.citizenNotice}"
              </p>
            </div>
          )}
        </div>

        {/* Right List: Live Complaints & Infrastructure Status (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pemantauan Lapangan & Progres Penanganan Perbaikan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Transparansi tindakan lapangan dari laporan warga terverifikasi
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs overflow-x-auto">
              {['Semua', 'Sampah', 'Jalan', 'Penerangan'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterCategory(f)}
                  className={`px-2.5 py-1 font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                    filterCategory === f
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Complaints Feed */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {filteredComplaints.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">{item.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.district}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium">{item.category}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{item.locationDetail}</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      {getStatusText(item.status)}
                    </div>
                    <span className="text-[10px] text-slate-400">SLA: {item.estimatedSLA}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* AI Recommendation Box */}
                <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-xs space-y-1">
                  <div className="font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tindakan OPD Terkait: {item.assignedDepartment}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    {item.recommendedAction}
                  </p>
                </div>

                {/* Bottom Meta & Upvote */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Dilaporkan oleh: {item.reporterName} · {item.createdAt}
                  </span>

                  <button
                    onClick={() => handleUpvote(item.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3 h-3 text-emerald-600" />
                    <span>Dukung ({item.upvotesCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
