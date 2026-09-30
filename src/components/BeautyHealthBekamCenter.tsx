import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  BookOpen, 
  ExternalLink, 
  Send, 
  Calendar, 
  ShieldCheck, 
  Search, 
  FileText, 
  Award, 
  Activity, 
  CheckCircle2, 
  Compass, 
  HelpCircle,
  Loader2,
  Share2
} from 'lucide-react';
import { BEKAM_RESEARCH_PAPERS, THIBBUN_NABAWI_ITEMS } from '../data/mockData';
import { BekamResearchPaper, ThibbunNabawiItem, PushNotificationItem } from '../types';
import { askHolisticAdvisor, HolisticAdvisorResult } from '../services/api';
import { sound } from '../services/audio';
import { BekamAppointmentScheduler } from './BekamAppointmentScheduler';

interface BeautyHealthBekamCenterProps {
  onScheduleNotification?: (notif: PushNotificationItem) => void;
}

export const BeautyHealthBekamCenter: React.FC<BeautyHealthBekamCenterProps> = ({
  onScheduleNotification,
}) => {
  const [researchPapers] = useState<BekamResearchPaper[]>(BEKAM_RESEARCH_PAPERS);
  const [thibbunItems] = useState<ThibbunNabawiItem[]>(THIBBUN_NABAWI_ITEMS);
  const [selectedPaperCategory, setSelectedPaperCategory] = useState<string>('Semua');
  const [activeTab, setActiveTab] = useState<'bekam' | 'thibbun' | 'ai-consultation' | 'appointments'>('bekam');

  // AI Holistic Consultation State
  const [consultQuery, setConsultQuery] = useState('');
  const [isConsulting, setIsConsulting] = useState(false);
  const [consultResult, setConsultResult] = useState<HolisticAdvisorResult | null>(null);

  const filteredPapers = researchPapers.filter((p) => {
    if (selectedPaperCategory === 'Semua') return true;
    return p.category.includes(selectedPaperCategory);
  });

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultQuery.trim()) return;

    setIsConsulting(true);
    sound.playPeacefulChime();

    try {
      const res = await askHolisticAdvisor({
        query: consultQuery,
        userHealthData: {
          dailySteps: 9450,
          restingHeartRate: 66,
          sleepHours: 7.2
        }
      });
      setConsultResult(res);
    } finally {
      setIsConsulting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-700/60 relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-emerald-300">
            <span className="bg-emerald-950/80 border border-emerald-600/40 px-2.5 py-1 rounded-md">
              The Beauty Health Center
            </span>
            <span>·</span>
            <span>World Bekam Islamicity & Thibbun Nabawi International</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Harmoni Kesehatan Fisik & Spiritual Berbasis Riset Medis & Sunnah
          </h2>

          <p className="text-sm text-emerald-100/90 leading-relaxed font-light">
            Menyajikan data penelitian klinis terbaru (evidence-based medicine) mengenai manfaat bekam basah (hijama), mikrosirkulasi kapiler, pelepasan endorfin, dan ensiklopedia obat nabawi untuk menunjang kebugaran ibadah maksimal.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('bekam')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'bekam'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              Riset Ilmiah Bekam Internasional
            </button>

            <button
              onClick={() => setActiveTab('thibbun')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'thibbun'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              Ensiklopedia Thibbun Nabawi
            </button>

            <button
              onClick={() => setActiveTab('ai-consultation')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'ai-consultation'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              Konsultasi AI Kebugaran & Bekam
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'appointments'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Janji Temu Bekam & Pengingat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Islamicity Ecosystem Links Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-800">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-emerald-600" />
            Jaringan Kanal Resmi Islamicity & World Bekam
          </span>
          <span className="text-slate-400">Akses Langsung Portal Kesehatan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <a
            href="https://t.me/FITCity313"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all flex items-center justify-between group"
          >
            <div>
              <strong className="block text-slate-900 dark:text-white group-hover:text-emerald-600">t.me/FITCity313</strong>
              <span className="text-[10px] text-slate-400">Telegram Resmi</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
          </a>

          <a
            href="http://f.fit.islamicity.tv"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all flex items-center justify-between group"
          >
            <div>
              <strong className="block text-slate-900 dark:text-white group-hover:text-emerald-600">f.fit.islamicity.tv</strong>
              <span className="text-[10px] text-slate-400">Portal Kebugaran</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
          </a>

          <a
            href="http://global.health.islamicity.tv"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all flex items-center justify-between group"
          >
            <div>
              <strong className="block text-slate-900 dark:text-white group-hover:text-emerald-600">global.health.islamicity.tv</strong>
              <span className="text-[10px] text-slate-400">Kesehatan Global</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
          </a>

          <a
            href="http://health.islamicity.tv"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all flex items-center justify-between group"
          >
            <div>
              <strong className="block text-slate-900 dark:text-white group-hover:text-emerald-600">health.islamicity.tv</strong>
              <span className="text-[10px] text-slate-400">World Bekam Center</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
          </a>

          <a
            href="http://tni.islamicity.tv"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-all flex items-center justify-between group"
          >
            <div>
              <strong className="block text-slate-900 dark:text-white group-hover:text-emerald-600">tni.islamicity.tv</strong>
              <span className="text-[10px] text-slate-400">Thibbun Nabawi TNI</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600" />
          </a>
        </div>
      </div>

      {/* Tab 1: International Bekam Research Center */}
      {activeTab === 'bekam' && (
        <div className="space-y-6">
          
          {/* Hijama Sunnah Calendar Highlight */}
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Kalender Sunnah Bekam (Hijama) Terdekat</span>
              </div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                Tanggal 17, 19, & 21 Rabi'ul Awwal 1448 H (Insya Allah 3 Hari Lagi)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Penjelasan gravitasi & biofisika: Pada tanggal-tanggal ini, gaya gravitasi bulan berada pada fase kesetimbangan pasang-surut yang mempercepat eliminasi akumulasi filtrat metabolik mikrokapiler.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Standar Higienitas</span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">100% Jarum & Kop Sekali Pakai</span>
              </div>
              <button
                onClick={() => setActiveTab('appointments')}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-stretch sm:self-auto justify-center"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Jadwalkan Sesi Sunnah</span>
              </button>
            </div>
          </div>

          {/* Research Database Filter & List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Pusat Penelitian Ilmiah Bekam (World Bekam Islamicity Research)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Publikasi jurnal peer-reviewed, uji klinis acak (RCT), dan studi biokimia biomolekuler
                </p>
              </div>

              {/* Category filter */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs overflow-x-auto">
                {['Semua', 'Kardiovaskular', 'Imunologi', 'Nyeri', 'Detoksifikasi'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedPaperCategory(cat)}
                    className={`px-3 py-1 font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                      selectedPaperCategory === cat
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPapers.map((paper) => (
                <div
                  key={paper.id}
                  className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">{paper.category}</span>
                      <span>{paper.evidenceLevel} · {paper.publicationYear}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {paper.title}
                    </h4>

                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Jurnal: <span className="font-normal italic text-slate-500">{paper.journal}</span> ({paper.pmid || paper.doi})
                    </p>

                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
                      <strong className="text-emerald-900 dark:text-emerald-300 block">Temuan Kunci (Key Findings):</strong>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {paper.keyFindings}
                      </p>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-400 pt-1">
                      <strong>Mekanisme Biologis:</strong> {paper.biologicalMechanism}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Terindeks PubMed & Scopus</span>
                    <a
                      href="http://health.islamicity.tv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Baca Naskah Lengkap</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Thibbun Nabawi Library */}
      {activeTab === 'thibbun' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>Ensiklopedia Terpadu Thibbun Nabawi (Kedokteran Kenabian)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kajian hadits shahih, kandungan nutrisi biokimia, dan panduan penggunaan medis modern
              </p>
            </div>
            <a
              href="http://tni.islamicity.tv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Katalog Lengkap TNI</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {thibbunItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{item.description}</p>
                  </div>
                  <span className="font-arabic text-xl text-emerald-700 dark:text-emerald-400 shrink-0 ml-2">
                    {item.arabicName}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-xs">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-0.5">Dalil Shahih Sunnah:</span>
                  <p className="text-slate-700 dark:text-slate-300 italic">
                    "{item.sunnahReference}"
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <strong className="text-slate-800 dark:text-slate-200 block">Kajian Ilmiah Modern:</strong>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.modernScienceBenefit}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-1">
                  <span><strong>Panduan Pakai:</strong> {item.usageInstruction}</span>
                  <span className="text-amber-700 dark:text-amber-400"><strong>Peringatan/Kontraindikasi:</strong> {item.precaution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Interactive AI Holistic & Thibbun Nabawi Consultant */}
      {activeTab === 'ai-consultation' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Konsultan Cerdas The Beauty Health Center & World Bekam
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Konsultasikan keluhan pegal otot, titik bekam anjuran, pola makan sunnah, dan olahraga teratur
              </p>
            </div>
          </div>

          <form onSubmit={handleAskAI} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Pertanyaan atau Keluhan Kebugaran Anda:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Contoh: Leher sering tegang dan mudah mengantuk saat shalat malam, apakah bekam dianjurkan dan titik mana yang tepat?"
                value={consultQuery}
                onChange={(e) => setConsultQuery(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={isConsulting}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isConsulting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menganalisis...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Konsultasikan</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* AI Consultation Response */}
          {consultResult && (
            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-800 text-xs">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Rekomendasi Holistik Beauty Health Center
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  World Bekam Islamicity Certified
                </span>
              </div>

              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {consultResult.summary}
              </p>

              {/* Bekam points & recommendations */}
              {consultResult.bekamRecommendation && (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-800/80 space-y-2 text-xs">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-emerald-600" />
                    <span>Rekomendasi Terapi Bekam Basah (Al-Hijama):</span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>Titik Sunnah Utama:</strong> {consultResult.bekamRecommendation.points.join(', ')}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong>Waktu Terbaik:</strong> {consultResult.bekamRecommendation.bestDates}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong>Penjelasan Ilmiah:</strong> {consultResult.bekamRecommendation.scientificBenefit}
                  </p>
                  <p className="text-amber-800 dark:text-amber-300 text-[11px]">
                    <strong>Perhatian:</strong> {consultResult.bekamRecommendation.precautions}
                  </p>
                </div>
              )}

              {/* Physical Activity & Spiritual Boost */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/60 dark:border-emerald-800/60 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">Aktivitas Fisik & Kebugaran:</span>
                  <p className="text-slate-600 dark:text-slate-300">{consultResult.physicalActivity.exerciseType}</p>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-semibold">
                    Target {consultResult.physicalActivity.dailySteps} Langkah · {consultResult.physicalActivity.timing}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/60 dark:border-emerald-800/60 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">Nutrisi & Thibbun Nabawi:</span>
                  <ul className="text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
                    {consultResult.nutritionAdvice.map((nut, idx) => (
                      <li key={idx}>{nut}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Spiritual boost quote */}
              <div className="p-3 rounded-xl bg-emerald-900 text-white text-xs space-y-1">
                <span className="text-emerald-300 font-bold block">Penyemangat Ibadah & Doa:</span>
                <p className="text-emerald-100 italic leading-relaxed">
                  "{consultResult.spiritualBoost.doaOrDzikir}"
                </p>
                <p className="text-emerald-200/80 text-[11px]">
                  {consultResult.spiritualBoost.worshipAdvice}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Appointment Scheduler with Integrated Notifications */}
      {activeTab === 'appointments' && (
        <BekamAppointmentScheduler onScheduleNotification={onScheduleNotification} />
      )}

    </div>
  );
};
