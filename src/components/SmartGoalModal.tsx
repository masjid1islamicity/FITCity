import React, { useState } from 'react';
import { 
  Target, 
  Sparkles, 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  X, 
  Zap, 
  Flame, 
  Award,
  AlertCircle,
  Sliders,
  Sun
} from 'lucide-react';
import { FamilyMemberFitness, ScheduleIntensity, SmartGoalConfig } from '../types';
import { sound } from '../services/audio';

interface SmartGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyMembers: FamilyMemberFitness[];
  selectedMemberId: string | null;
  onUpdateMemberGoal: (memberId: string, updatedTarget: number, smartGoalConfig: SmartGoalConfig) => void;
  onBatchUpdateAll: (intensity: ScheduleIntensity) => void;
}

export const SmartGoalModal: React.FC<SmartGoalModalProps> = ({
  isOpen,
  onClose,
  familyMembers,
  selectedMemberId,
  onUpdateMemberGoal,
  onBatchUpdateAll,
}) => {
  if (!isOpen) return null;

  const initialMember = familyMembers.find((m) => m.id === selectedMemberId) || familyMembers[0];
  const [currentMemberId, setCurrentMemberId] = useState<string>(initialMember?.id || familyMembers[0]?.id);
  const activeMember = familyMembers.find((m) => m.id === currentMemberId) || familyMembers[0];

  const [intensity, setIntensity] = useState<ScheduleIntensity>(
    activeMember?.smartGoal?.scheduleIntensity || 'normal'
  );
  const [customSteps, setCustomSteps] = useState<number>(activeMember?.targetSteps || 10000);
  const [customMinutes, setCustomMinutes] = useState<number>(activeMember?.smartGoal?.targetActiveMinutes || 45);
  const [weatherOptIn, setWeatherOptIn] = useState<boolean>(true);

  // When switching member in dropdown
  const handleSelectMember = (id: string) => {
    setCurrentMemberId(id);
    const m = familyMembers.find((item) => item.id === id);
    if (m) {
      const sch = m.smartGoal?.scheduleIntensity || 'normal';
      setIntensity(sch);
      setCustomSteps(m.targetSteps);
      setCustomMinutes(m.smartGoal?.targetActiveMinutes || 45);
    }
  };

  // Calculate dynamic recommendation based on historical performance + schedule
  const recommendation = React.useMemo(() => {
    if (!activeMember) return null;

    const base = activeMember.dailySteps;
    const streak = activeMember.streakDays;
    let multiplier = 1.0;
    let windowStr = '05:30 - 06:45 WIB (Setelah Subuh)';
    let reasonText = '';

    switch (intensity) {
      case 'padat':
        multiplier = 0.8;
        windowStr = '06:00 - 06:30 WIB & 17:00 - 17:30 WIB (Pecah 2 Sesi Cepat)';
        reasonText = 'Jadwal hari ini padat aktivitas. Target diturunkan 20% agar realistis tanpa memicu kelelahan berlebih, dipecah menjadi 2 sesi jalan mikro.';
        break;
      case 'normal':
        multiplier = streak >= 10 ? 1.08 : 1.0;
        windowStr = '05:30 - 06:45 WIB (Setelah Subuh)';
        reasonText = streak >= 10 
          ? `Konsistensi luar biasa (${streak} hari beruntun). AI menaikkan target +8% untuk stimulasi kebugaran kardiovaskular secara bertahap.`
          : 'Jadwal standar dengan target seimbang untuk menjaga ketahanan fisik ibadah harian.';
        break;
      case 'akhir-pekan':
        multiplier = 1.25;
        windowStr = '06:30 - 08:30 WIB (Jalan Santai RTH & Taman Lingkungan)';
        reasonText = 'Waktu luang akhir pekan optimal. Target dinaikkan +25% untuk jalan santai bersama keluarga di Ruang Terbuka Hijau bebas kendaraan.';
        break;
      case 'pemulihan':
        multiplier = 0.65;
        windowStr = '06:00 - 06:45 WIB (Jalan Santai Sinar Matahari Pagi)';
        reasonText = 'Mode pemulihan stamina atau fleksibilitas sendi. Target langkah dikurangi 35%, fokus pada hidrasi dan peregangan ringan.';
        break;
    }

    const calculatedSteps = Math.round((base * multiplier) / 250) * 250;
    const calculatedMinutes = Math.round(activeMember.activeMinutes * multiplier);

    return {
      suggestedSteps: Math.max(3500, Math.min(16000, calculatedSteps)),
      suggestedMinutes: Math.max(20, Math.min(90, calculatedMinutes)),
      window: windowStr,
      reason: reasonText,
    };
  }, [activeMember, intensity]);

  // Apply intensity changes to live custom slider
  const handleIntensityChange = (newIntensity: ScheduleIntensity) => {
    setIntensity(newIntensity);
    if (!activeMember) return;

    let mult = 1.0;
    if (newIntensity === 'padat') mult = 0.8;
    else if (newIntensity === 'akhir-pekan') mult = 1.25;
    else if (newIntensity === 'pemulihan') mult = 0.65;
    else if (newIntensity === 'normal') mult = activeMember.streakDays >= 10 ? 1.08 : 1.0;

    const newTarget = Math.max(3500, Math.min(16000, Math.round((activeMember.dailySteps * mult) / 250) * 250));
    setCustomSteps(newTarget);
    setCustomMinutes(Math.round(activeMember.activeMinutes * mult));
  };

  const handleSaveIndividualGoal = () => {
    if (!activeMember || !recommendation) return;

    const updatedConfig: SmartGoalConfig = {
      enabled: true,
      scheduleIntensity: intensity,
      historicalBaselineSteps: activeMember.dailySteps,
      adaptiveTargetSteps: customSteps,
      targetActiveMinutes: customMinutes,
      recommendedTimeWindow: recommendation.window,
      reason: recommendation.reason,
    };

    onUpdateMemberGoal(activeMember.id, customSteps, updatedConfig);
    sound.playPeacefulChime();
    onClose();
  };

  const handleApplyToAll = () => {
    onBatchUpdateAll(intensity);
    sound.playPeacefulChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Pengaturan Smart Goal Kebugaran Dinamis</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  AI Adaptive
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Menyesuaikan target aktivitas harian secara cerdas berdasarkan riwayat performa & kepadatan jadwal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Selector Strip */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Pilih Anggota Keluarga:
          </label>
          <div className="flex flex-wrap gap-2">
            {familyMembers.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectMember(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentMemberId === m.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{m.name}</span>
                <span className="text-[10px] opacity-75">({m.relation})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Historical Performance Glance */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold">Rata-Rata Langkah</span>
            <strong className="text-slate-900 dark:text-white text-sm">
              {activeMember?.dailySteps.toLocaleString('id-ID')}
            </strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold">Konsistensi Streak</span>
            <strong className="text-emerald-600 dark:text-emerald-400 text-sm">
              {activeMember?.streakDays} Hari
            </strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-bold">Tidur & Pemulihan</span>
            <strong className="text-slate-900 dark:text-white text-sm">
              {activeMember?.sleepHours} Jam
            </strong>
          </div>
        </div>

        {/* Schedule Intensity Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">
              Kepadatan Jadwal Hari Ini:
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Target otomatis dikalibrasi
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              {
                id: 'padat',
                label: 'Jadwal Padat',
                desc: 'Rapat & Tugas Luar',
                tag: '-20% Target',
                color: 'hover:border-amber-400',
              },
              {
                id: 'normal',
                label: 'Jadwal Normal',
                desc: 'Kerja/Sekolah Standar',
                tag: 'Progresif (+5%)',
                color: 'hover:border-emerald-400',
              },
              {
                id: 'akhir-pekan',
                label: 'Akhir Pekan',
                desc: 'Hari Libur & RTH',
                tag: '+25% Langkah',
                color: 'hover:border-teal-400',
              },
              {
                id: 'pemulihan',
                label: 'Pemulihan',
                desc: 'Istirahat / Sendi',
                tag: 'Mobilitas Ringan',
                color: 'hover:border-blue-400',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleIntensityChange(opt.id as ScheduleIntensity)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${opt.color} ${
                  intensity === opt.id
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {opt.label}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block leading-tight">
                  {opt.desc}
                </span>
                <span className="inline-block text-[9px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                  {opt.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Rational Recommendation Box */}
        {recommendation && (
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Rasional Rekomendasi Cerdas AI:</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              {recommendation.reason}
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Jendela Waktu Terbaik: {recommendation.window}</span>
            </div>
          </div>
        )}

        {/* Target Slider Customization */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span>Target Langkah Disesuaikan</span>
              </span>
              <span className="text-[10px] text-slate-400">Geser untuk memodifikasi target langkah hari ini</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {customSteps.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-slate-400 block font-normal">langkah</span>
            </div>
          </div>

          <input
            type="range"
            min={3000}
            max={15000}
            step={250}
            value={customSteps}
            onChange={(e) => setCustomSteps(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />

          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Ringan (3.000)</span>
            <span>Standar Sehat (8.000)</span>
            <span>Tinggi (12.000+)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <button
            type="button"
            onClick={handleApplyToAll}
            className="w-full sm:w-auto px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer text-center"
          >
            Terapkan Mode "{intensity.toUpperCase()}" ke Semua Anggota
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSaveIndividualGoal}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Terapkan Smart Goal</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
