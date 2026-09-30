import React, { useState, useEffect } from 'react';
import { 
  MoonStar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Heart, 
  Plus, 
  Lock, 
  Unlock, 
  Sparkles, 
  TrendingUp, 
  Volume2, 
  Calendar, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  BookmarkCheck, 
  Award,
  Mic,
  MicOff,
  X,
  Radio,
  RotateCcw,
  Download
} from 'lucide-react';
import { 
  PRAYER_TIMES, 
  INITIAL_WORSHIP_CHECKLIST, 
  INITIAL_JOURNAL_ENTRIES, 
  COMMUNITY_POSTS 
} from '../data/mockData';
import { 
  PrayerTimeData, 
  WorshipChecklistItem, 
  SpiritualJournalEntry, 
  CommunityPost 
} from '../types';
import { sound } from '../services/audio';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { VoiceDictationButton } from './VoiceDictationButton';
import { exportWorshipDisciplinePDF } from '../services/pdfExport';

export const WorshipDisciplineTracker: React.FC = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimeData[]>(PRAYER_TIMES);
  const [checklist, setChecklist] = useState<WorshipChecklistItem[]>(INITIAL_WORSHIP_CHECKLIST);
  const [journalEntries, setJournalEntries] = useState<SpiritualJournalEntry[]>(INITIAL_JOURNAL_ENTRIES);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(COMMUNITY_POSTS);

  // New Journal Form State
  const [newReflection, setNewReflection] = useState('');
  const [newGratitude1, setNewGratitude1] = useState('');
  const [newGratitude2, setNewGratitude2] = useState('');
  const [newQuranProgress, setNewQuranProgress] = useState('');
  const [newMood, setNewMood] = useState<SpiritualJournalEntry['mood']>('Khusyuk & Tenang');
  const [isPrivateJournal, setIsPrivateJournal] = useState(false);
  const [showAddJournal, setShowAddJournal] = useState(false);

  // Dedicated Voice Recording Studio Modal State
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceDraftText, setVoiceDraftText] = useState('');
  const [voiceRecordingSeconds, setVoiceRecordingSeconds] = useState(0);
  const [voiceMood, setVoiceMood] = useState<SpiritualJournalEntry['mood']>('Khusyuk & Tenang');

  // Voice-to-Text State
  const [voiceTarget, setVoiceTarget] = useState<'reflection' | 'community' | 'modal-reflection' | null>(null);

  const { isListening, startListening, stopListening, toggleListening, isSupported, errorMsg } = useSpeechToText((spokenText) => {
    if (voiceTarget === 'modal-reflection') {
      setVoiceDraftText(spokenText);
    } else if (voiceTarget === 'reflection') {
      setNewReflection((prev) => (!prev.trim() ? spokenText : `${prev} ${spokenText}`));
    } else if (voiceTarget === 'community') {
      setNewCommunityMessage((prev) => (!prev.trim() ? spokenText : `${prev} ${spokenText}`));
    }
  });

  // Track recording timer for voice modal
  useEffect(() => {
    let interval: any = null;
    if (isListening && showVoiceModal) {
      interval = setInterval(() => {
        setVoiceRecordingSeconds((sec) => sec + 1);
      }, 1000);
    } else {
      setVoiceRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isListening, showVoiceModal]);

  const handleOpenVoiceModal = () => {
    sound.playPeacefulChime();
    setVoiceTarget('modal-reflection');
    setVoiceDraftText('');
    setShowVoiceModal(true);
    startListening();
  };

  const handleSaveFromVoiceModal = () => {
    if (!voiceDraftText.trim()) return;
    const now = new Date();
    const dateStr = `${now.getDate()} Sept 2026`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    const entry: SpiritualJournalEntry = {
      id: `jrn-${Date.now()}`,
      date: dateStr,
      timestamp: timeStr,
      gratitudeList: ['Direkam menggunakan fitur Dikte Suara Hands-Free FITCity'],
      reflections: voiceDraftText,
      mood: voiceMood,
      quranProgress: 'Refleksi Dikte Suara',
      isPrivate: false,
      isVoiceRecorded: true
    };

    setJournalEntries([entry, ...journalEntries]);
    stopListening();
    setShowVoiceModal(false);
    setVoiceDraftText('');
    sound.playPeacefulChime();
  };

  const handleTransferToForm = () => {
    setNewReflection(voiceDraftText);
    setNewMood(voiceMood);
    setShowAddJournal(true);
    stopListening();
    setShowVoiceModal(false);
    sound.playPeacefulChime();
  };

  const reflectionSamplePrompts = [
    'Alhamdulillah diberi kelapangan nafas dan stamina segar untuk shalat berjamaah subuh di masjid',
    'Muhasabah hari ini: menjaga lisan serta meluruskan niat menjaga kebugaran jasmani murni untuk memperkuat ibadah',
    'Menyadari bahwa tubuh yang sehat dan kuat adalah modal utama untuk lebih khusyuk dalam ruku dan sujud'
  ];

  const communitySamplePrompts = [
    'Semoga Allah senantiasa memberkahi ikhtiar kebugaran jasmani dan ketulusan ibadah kita semua!',
    'Mari saling mengingatkan dalam kebaikan dan menjaga shalat fardhu awal waktu berjamaah.'
  ];

  // Community post form state
  const [newCommunityMessage, setNewCommunityMessage] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);

  // Stats
  const completedCount = checklist.filter((item) => item.completed).length;
  const totalScore = checklist.filter((item) => item.completed).reduce((acc, curr) => acc + curr.points, 0);
  const maxPossibleScore = checklist.reduce((acc, curr) => acc + curr.points, 0);
  const completionPercentage = Math.round((completedCount / checklist.length) * 100);

  const toggleChecklistItem = (id: string) => {
    sound.playPeacefulChime();
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const togglePrayerNotification = (prayerName: string) => {
    sound.playPeacefulChime();
    setPrayerTimes((prev) =>
      prev.map((p) =>
        p.name === prayerName ? { ...p, notificationEnabled: !p.notificationEnabled } : p
      )
    );
  };

  const handleCreateJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReflection.trim()) return;

    const now = new Date();
    const dateStr = `${now.getDate()} Sept 2026`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    const entry: SpiritualJournalEntry = {
      id: `jrn-${Date.now()}`,
      date: dateStr,
      timestamp: timeStr,
      gratitudeList: [newGratitude1, newGratitude2].filter(Boolean),
      reflections: newReflection,
      mood: newMood,
      quranProgress: newQuranProgress || 'Membaca Al-Qur\'an',
      isPrivate: isPrivateJournal
    };

    setJournalEntries([entry, ...journalEntries]);
    setNewReflection('');
    setNewGratitude1('');
    setNewGratitude2('');
    setNewQuranProgress('');
    setShowAddJournal(false);
    sound.playPeacefulChime();
  };

  const handlePostCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommunityMessage.trim()) return;

    const post: CommunityPost = {
      id: `post-${Date.now()}`,
      author: 'Ahmad Faiz (Anda)',
      district: 'Pusat Kota',
      avatarColor: 'bg-emerald-700',
      timeAgo: 'Baru saja',
      category: 'Motivasi Ibadah',
      content: newCommunityMessage,
      likesCount: 1,
      userLiked: true,
      commentsCount: 0,
      verifiedCitizen: true
    };

    setCommunityPosts([post, ...communityPosts]);
    setNewCommunityMessage('');
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 4000);
  };

  const handleLikePost = (id: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isLiked = p.userLiked;
          return {
            ...p,
            likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1,
            userLiked: !isLiked
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MoonStar className="w-6 h-6 text-emerald-600" />
            <span>Peningkatan Disiplin Ibadah & Refleksi Spiritual</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Memonitor kedisiplinan ibadah harian, catatan muhasabah jiwa, dan saling menyemangati dalam kebaikan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Download PDF Report Button */}
          <button
            onClick={() => exportWorshipDisciplinePDF(checklist, journalEntries, prayerTimes)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-xs transition-colors cursor-pointer"
            title="Unduh rekap kedisiplinan ibadah dan muhasabah dalam format PDF"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Unduh Laporan (PDF)</span>
          </button>

          <button
            onClick={() => sound.playPeacefulChime()}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-emerald-600" />
            <span>Uji Suara Pengingat Shalat</span>
          </button>
        </div>
      </div>

      {/* Top Card: Prayer Times Row with Countdown */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-emerald-700/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Jadwal Shalat Presisi Wilayah Kota
            </span>
            <div className="text-lg font-bold flex items-center gap-2 mt-0.5">
              <span>Waktu Shalat Berikutnya: <strong>Ashar (15:08 WIB)</strong></span>
              <span className="text-xs bg-emerald-700/80 px-2 py-0.5 rounded font-mono">
                Tersisa 1 Jam 40 Menit
              </span>
            </div>
          </div>

          <div className="text-xs text-emerald-200/80 font-arabic text-lg sm:text-right">
            حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ
          </div>
        </div>

        {/* 6 Times Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {prayerTimes.map((p) => (
            <div
              key={p.name}
              className={`p-3 rounded-xl border transition-all ${
                p.isNext
                  ? 'bg-emerald-700/80 border-emerald-400 shadow-md ring-2 ring-emerald-300/40'
                  : 'bg-emerald-950/40 border-emerald-800/60 hover:bg-emerald-950/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-200">{p.name}</span>
                <button
                  onClick={() => togglePrayerNotification(p.name)}
                  className="cursor-pointer"
                  title={p.notificationEnabled ? "Pengingat aktif" : "Aktifkan pengingat"}
                >
                  <Volume2 className={`w-3.5 h-3.5 ${p.notificationEnabled ? 'text-emerald-300' : 'text-emerald-700'}`} />
                </button>
              </div>

              <div className="text-xl font-black tracking-tight mt-1">
                {p.time}
              </div>

              {p.sunnahTarget && (
                <div className="text-[10px] text-emerald-300/90 mt-1 truncate">
                  {p.sunnahTarget}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Worship Checklist & Trends (Left) + Spiritual Journal & Community (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Daily Target Checklist & Weekly Trends (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Daily Checklist Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookmarkCheck className="w-5 h-5 text-emerald-600" />
                  <span>Target Kedisiplinan Ibadah Harian</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Centang amalan yang telah ditunaikan dengan penuh keikhlasan
                </p>
              </div>

              <div className="text-right">
                <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                  {completedCount} / {checklist.length}
                </span>
                <span className="text-[10px] text-slate-400 block">{completionPercentage}% Tercapai</span>
              </div>
            </div>

            {/* Checklist items list */}
            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    item.completed
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
                    )}
                    <div>
                      <span className={`text-xs font-semibold block ${item.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{item.target} · {item.category}</span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    +{item.points} Poin
                  </span>
                </div>
              ))}
            </div>

            {/* Progress summary banner */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Total Poin Kebaikan Hari Ini</span>
              <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold text-sm">
                {totalScore} / {maxPossibleScore} Poin
              </strong>
            </div>
          </div>

          {/* Weekly Worship Discipline Trend */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tren Kedisiplinan Ibadah Mingguan
                </h3>
              </div>
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">Rata-rata 86%</span>
            </div>

            {/* Visual Bar Progression */}
            <div className="grid grid-cols-7 gap-2 pt-2 items-end h-32">
              {[
                { day: 'Sen', pct: 85 },
                { day: 'Sel', pct: 90 },
                { day: 'Rab', pct: 75 },
                { day: 'Kam', pct: 95 },
                { day: 'Jum', pct: 100 },
                { day: 'Sab', pct: 80 },
                { day: 'Ahd', pct: 92 },
              ].map((d) => (
                <div key={d.day} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] text-slate-400 font-semibold">{d.pct}%</span>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden flex items-end h-20">
                    <div
                      className="w-full bg-emerald-600 rounded-t-lg transition-all duration-500"
                      style={{ height: `${d.pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{d.day}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
              Konsistensi ibadah tertinggi terjadi di hari Jumat dengan pemenuhan Shalat Berjamaah dan Tilawah Al-Kahfi lengkap.
            </p>
          </div>

        </div>

        {/* Right: Spiritual Daily Journal & Community Feed (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Spiritual Journal Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span>Jurnal Harian Refleksi Spiritual (Muhasabah)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Mencatat rasa syukur, muhasabah batin, dan perkembangan tilawah
                </p>
              </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenVoiceModal}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer ring-1 ring-emerald-600"
                title="Rekam dikte suara refleksi spiritual & jurnal harian (hands-free)"
              >
                <Mic className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
                <span>Rekam Dikte Suara</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddJournal(!showAddJournal)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tulis Manual</span>
              </button>
            </div>
            </div>

            {/* Add Reflection Form */}
            {showAddJournal && (
              <form onSubmit={handleCreateJournal} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs animate-in fade-in">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hal yang Paling Disyukuri Hari Ini (1)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Diberi kelapangan rezeki dan kesehatan keluarga..."
                    value={newGratitude1}
                    onChange={(e) => setNewGratitude1(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hal yang Paling Disyukuri Hari Ini (2)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Berhasil shalat subuh tepat waktu berjamaah..."
                    value={newGratitude2}
                    onChange={(e) => setNewGratitude2(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pencapaian Tilawah Al-Qur'an
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Surah Al-Kahf ayat 1-110 selesai..."
                    value={newQuranProgress}
                    onChange={(e) => setNewQuranProgress(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Catatan Muhasabah & Evaluasi Diri
                    </label>

                    {/* Voice Dictation for Reflections */}
                    <VoiceDictationButton
                      isListening={isListening && voiceTarget === 'reflection'}
                      onToggle={() => {
                        setVoiceTarget('reflection');
                        toggleListening();
                      }}
                      isSupported={isSupported}
                      samplePrompts={reflectionSamplePrompts}
                      onSelectSample={(sample) => setNewReflection(sample)}
                      label="Dikte Refleksi"
                    />
                  </div>

                  {isListening && voiceTarget === 'reflection' && (
                    <div className="mb-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-pulse">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                        <span>Mendengarkan muhasabah lisan Anda... Bicara dengan tenang.</span>
                      </div>
                      <button
                        type="button"
                        onClick={toggleListening}
                        className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        Selesai
                      </button>
                    </div>
                  )}

                  <textarea
                    rows={3}
                    required
                    placeholder="Renungkan amalan hari ini, luruskan niat menjaga kebugaran demi ibadah, atau gunakan tombol Dikte Refleksi..."
                    value={newReflection}
                    onChange={(e) => setNewReflection(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={isPrivateJournal}
                      onChange={(e) => setIsPrivateJournal(e.target.checked)}
                      className="accent-emerald-600"
                    />
                    <span>Kunci sebagai Jurnal Pribadi (Privat)</span>
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddJournal(false)}
                      className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 cursor-pointer"
                    >
                      Simpan Catatan
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* List of Journal Entries */}
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {journalEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {entry.date} · {entry.timestamp}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      {entry.isPrivate ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Unlock className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{entry.isPrivate ? 'Privat' : 'Terbuka'}</span>
                    </span>
                  </div>

                  {entry.gratitudeList.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                        Rasa Syukur:
                      </span>
                      <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc pl-4 space-y-0.5">
                        {entry.gratitudeList.map((g, idx) => (
                          <li key={idx}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    "{entry.reflections}"
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span>Tilawah: {entry.quranProgress}</span>
                      {entry.isVoiceRecorded && (
                        <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 text-[10px]">
                          <Mic className="w-3 h-3 text-emerald-600" />
                          <span>Dilisankan via Dikte Suara</span>
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">{entry.mood}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Motivation Feed */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Komunitas Saling Memotivasi & Mengingatkan Kebaikan
                </h3>
              </div>
              <span className="text-xs text-slate-400">Tanpa Riya'</span>
            </div>

            {/* Quick post encouragement */}
            <form onSubmit={handlePostCommunity} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Tulis atau Diktekan Pesan:
                </span>
                <VoiceDictationButton
                  isListening={isListening && voiceTarget === 'community'}
                  onToggle={() => {
                    setVoiceTarget('community');
                    toggleListening();
                  }}
                  isSupported={isSupported}
                  samplePrompts={communitySamplePrompts}
                  onSelectSample={(sample) => setNewCommunityMessage(sample)}
                  label="Dikte Pesan"
                />
              </div>

              {isListening && voiceTarget === 'community' && (
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    <span>Mendengarkan doa/motivasi Anda...</span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleListening}
                    className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Selesai
                  </button>
                </div>
              )}

              <textarea
                rows={2}
                placeholder="Tuliskan kata motivasi ibadah atau doa kebaikan untuk sesama warga (atau gunakan tombol Dikte Pesan)..."
                value={newCommunityMessage}
                onChange={(e) => setNewCommunityMessage(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white leading-relaxed"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Kirim Doa / Motivasi
                </button>
              </div>
            </form>

            {/* Posts stream */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {communityPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full ${post.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                        {post.author[0]}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{post.author}</span>
                        <span className="text-[10px] text-slate-400">{post.district} · {post.timeAgo}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                      {post.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                        post.userLiked ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Aamiin / Dukung ({post.likesCount})</span>
                    </button>
                    <span className="text-[11px] text-slate-400">{post.commentsCount} Balasan Doa</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Dedicated Voice Recording Studio Modal for Spiritual Reflections */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Studio Dikte Suara Refleksi Spiritual
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Dokumentasikan muhasabah harian Anda secara lisan (hands-free)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  stopListening();
                  setShowVoiceModal(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Microphone Recording Center Stage */}
            <div className="text-center py-2 space-y-3">
              <div className="relative inline-flex items-center justify-center">
                {isListening && voiceTarget === 'modal-reflection' && (
                  <span className="absolute w-24 h-24 rounded-full bg-emerald-400/20 dark:bg-emerald-500/20 animate-ping pointer-events-none" />
                )}
                <button
                  type="button"
                  onClick={() => {
                    sound.playAlertTone();
                    if (isListening) {
                      stopListening();
                    } else {
                      setVoiceTarget('modal-reflection');
                      startListening();
                    }
                  }}
                  className={`w-20 h-20 rounded-full flex flex-col items-center justify-center text-white transition-all cursor-pointer shadow-lg ${
                    isListening && voiceTarget === 'modal-reflection'
                      ? 'bg-rose-600 hover:bg-rose-700 ring-4 ring-rose-400/40 animate-pulse'
                      : 'bg-emerald-700 hover:bg-emerald-800 ring-4 ring-emerald-300 dark:ring-emerald-800'
                  }`}
                >
                  {isListening && voiceTarget === 'modal-reflection' ? (
                    <>
                      <MicOff className="w-6 h-6" />
                      <span className="text-[10px] font-bold mt-1">Berhenti</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-6 h-6" />
                      <span className="text-[10px] font-bold mt-1">Mulai</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status and Timer */}
              <div className="flex items-center justify-center gap-2 text-xs">
                {isListening && voiceTarget === 'modal-reflection' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="font-semibold text-rose-600 dark:text-rose-400">
                      Merekam Dikte Suara: 00:{String(voiceRecordingSeconds).padStart(2, '0')}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400">
                    Klik tombol untuk mulai berbicara (Bahasa Indonesia)
                  </span>
                )}
              </div>

              {/* Audio Waveform Equalizer Graphic */}
              <div className="flex items-center justify-center gap-1 h-6">
                {[6, 12, 18, 24, 14, 20, 26, 16, 10, 22, 14, 8].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      isListening && voiceTarget === 'modal-reflection'
                        ? 'bg-emerald-500 animate-pulse'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    style={{
                      height: isListening && voiceTarget === 'modal-reflection' ? `${Math.max(4, (h * (voiceRecordingSeconds % 3 + 1)) % 24)}px` : '4px'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Live Transcription Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Hasil Transkripsi Suara Real-Time:
                </span>
                {voiceDraftText && (
                  <button
                    type="button"
                    onClick={() => setVoiceDraftText('')}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Hapus Teks</span>
                  </button>
                )}
              </div>

              <textarea
                rows={3}
                value={voiceDraftText}
                onChange={(e) => setVoiceDraftText(e.target.value)}
                placeholder="Ucapkan refleksi spiritual, rasa syukur, atau muhasabah Anda... Kata-kata akan langsung muncul di sini secara otomatis."
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white leading-relaxed"
              />
            </div>

            {/* Mood Selector for Voice Entry */}
            <div className="space-y-1 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                Kondisi Hati Saat Refleksi:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(['Khusyuk & Tenang', 'Penuh Semangat', 'Butuh Muhasabah', 'Bersyukur Mendalam'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setVoiceMood(m)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-medium transition-colors cursor-pointer text-center ${
                      voiceMood === m
                        ? 'bg-emerald-700 text-white shadow-xs font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Sample Prompts for Instant Testing */}
            <div className="space-y-1 text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Atau pilih contoh refleksi suara cepat:</span>
              </span>
              <div className="flex flex-col gap-1">
                {reflectionSamplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      sound.playAlertTone();
                      setVoiceDraftText(prompt);
                    }}
                    className="text-left p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 text-[11px] border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer truncate"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  stopListening();
                  setShowVoiceModal(false);
                }}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleTransferToForm}
                disabled={!voiceDraftText.trim()}
                className="px-3.5 py-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold rounded-xl hover:bg-emerald-200 transition-colors cursor-pointer disabled:opacity-40"
              >
                Lengkapi di Form
              </button>

              <button
                type="button"
                onClick={handleSaveFromVoiceModal}
                disabled={!voiceDraftText.trim()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Simpan Langsung ke Jurnal</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
