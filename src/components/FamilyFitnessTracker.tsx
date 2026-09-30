import React, { useState } from 'react';
import { 
  Activity, 
  Watch, 
  Users, 
  TrendingUp, 
  Flame, 
  Droplets, 
  Moon, 
  Award, 
  Share2, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  Plus, 
  RefreshCw, 
  Clock, 
  Download,
  Target,
  Sliders,
  UserPlus,
  Trophy
} from 'lucide-react';
import { INITIAL_FAMILY_FITNESS } from '../data/mockData';
import { FamilyMemberFitness, ScheduleIntensity, SmartGoalConfig, DailyActivityPlan } from '../types';
import { sound } from '../services/audio';
import { exportFamilyFitnessPDF } from '../services/pdfExport';
import { SmartGoalModal } from './SmartGoalModal';
import { FamilyLeaderboard } from './FamilyLeaderboard';
import { InviteFamilyMemberModal } from './InviteFamilyMemberModal';
import { SetDailyActivityModal } from './SetDailyActivityModal';

export const FamilyFitnessTracker: React.FC = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberFitness[]>(INITIAL_FAMILY_FITNESS);
  const [isSyncingWatch, setIsSyncingWatch] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [reminderSaved, setReminderSaved] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Set Daily Activity state
  const [showSetActivityModal, setShowSetActivityModal] = useState(false);
  const [selectedMemberForActivity, setSelectedMemberForActivity] = useState<string | null>(null);

  // Smart Goal state
  const [showSmartGoalModal, setShowSmartGoalModal] = useState(false);
  const [selectedMemberForModal, setSelectedMemberForModal] = useState<string | null>(null);
  const [smartGoalFeedback, setSmartGoalFeedback] = useState<string | null>(null);
  const [isRecalibrating, setIsRecalibrating] = useState(false);

  // Totals
  const totalFamilySteps = familyMembers.reduce((acc, curr) => acc + curr.dailySteps, 0);
  const familyTargetSteps = familyMembers.reduce((acc, curr) => acc + curr.targetSteps, 0);
  const familyProgressPct = Math.min(100, Math.round((totalFamilySteps / familyTargetSteps) * 100));

  const handleAddFamilyMember = (newMember: FamilyMemberFitness) => {
    setFamilyMembers((prev) => [...prev, newMember]);
    setSmartGoalFeedback(
      `${newMember.name} (${newMember.relation}) berhasil bergabung ke Papan Kebugaran Keluarga!`
    );
    setTimeout(() => setSmartGoalFeedback(null), 5000);
  };

  const handleOpenSetActivity = (memberId?: string) => {
    setSelectedMemberForActivity(memberId || familyMembers[0].id);
    setShowSetActivityModal(true);
  };

  const handleSaveDailyActivity = (memberId: string, activityPlan: DailyActivityPlan) => {
    setFamilyMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              activeMinutes: m.activeMinutes + activityPlan.durationMinutes,
              caloriesBurned: (m.caloriesBurned || 0) + activityPlan.estimatedCalories,
              dailyActivity: activityPlan,
            }
          : m
      )
    );

    const member = familyMembers.find((m) => m.id === memberId);
    setSmartGoalFeedback(
      `Aktivitas '${activityPlan.activityName}' (${activityPlan.intensity.toUpperCase()}) untuk ${member?.name || 'anggota'} tersimpan! Estimasi ~${activityPlan.estimatedCalories} Kkal terbakar.`
    );
    setTimeout(() => setSmartGoalFeedback(null), 5000);
  };

  const handleOpenSmartGoal = (memberId?: string) => {
    setSelectedMemberForModal(memberId || familyMembers[0].id);
    setShowSmartGoalModal(true);
  };

  const handleUpdateMemberGoal = (
    memberId: string,
    updatedTarget: number,
    smartGoalConfig: SmartGoalConfig
  ) => {
    setFamilyMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              targetSteps: updatedTarget,
              smartGoal: smartGoalConfig,
            }
          : m
      )
    );

    const member = familyMembers.find((m) => m.id === memberId);
    setSmartGoalFeedback(
      `Smart Goal untuk ${member?.name || 'anggota'} berhasil diperbarui ke ${updatedTarget.toLocaleString('id-ID')} langkah (${smartGoalConfig.scheduleIntensity.toUpperCase()}).`
    );
    setTimeout(() => setSmartGoalFeedback(null), 4500);
  };

  const handleBatchUpdateAll = (intensity: ScheduleIntensity) => {
    let multiplier = 1.0;
    if (intensity === 'padat') multiplier = 0.8;
    else if (intensity === 'akhir-pekan') multiplier = 1.25;
    else if (intensity === 'pemulihan') multiplier = 0.65;
    else if (intensity === 'normal') multiplier = 1.05;

    setFamilyMembers((prev) =>
      prev.map((m) => {
        const newTarget = Math.max(3500, Math.min(16000, Math.round((m.dailySteps * multiplier) / 250) * 250));
        return {
          ...m,
          targetSteps: newTarget,
          smartGoal: {
            enabled: true,
            scheduleIntensity: intensity,
            historicalBaselineSteps: m.dailySteps,
            adaptiveTargetSteps: newTarget,
            targetActiveMinutes: Math.round(m.activeMinutes * multiplier),
            recommendedTimeWindow:
              intensity === 'padat'
                ? '06:00 - 06:30 WIB (Sesi Singkat)'
                : '05:30 - 06:45 WIB (Setelah Subuh)',
            reason: `Target dinamis seluruh keluarga disesuaikan ke mode [${intensity.toUpperCase()}].`,
          },
        };
      })
    );

    setSmartGoalFeedback(`Seluruh anggota keluarga berhasil disinkronkan ke mode jadwal [${intensity.toUpperCase()}].`);
    setTimeout(() => setSmartGoalFeedback(null), 4500);
  };

  const handleAutoAdaptiveRecalibrate = () => {
    setIsRecalibrating(true);
    sound.playAlertTone();
    setTimeout(() => {
      // Intelligently nudge targets based on streak & sleep
      setFamilyMembers((prev) =>
        prev.map((m) => {
          const bonus = m.streakDays >= 10 ? 500 : 250;
          const adjusted = Math.round((m.dailySteps + bonus) / 250) * 250;
          return {
            ...m,
            targetSteps: Math.max(4000, Math.min(14000, adjusted)),
            smartGoal: {
              enabled: true,
              scheduleIntensity: m.smartGoal?.scheduleIntensity || 'normal',
              historicalBaselineSteps: m.dailySteps,
              adaptiveTargetSteps: adjusted,
              targetActiveMinutes: m.activeMinutes,
              recommendedTimeWindow: '05:30 - 06:45 WIB (Setelah Subuh)',
              reason: `Kalkulasi AI: Rekomendasi progresif berdasarkan streak ${m.streakDays} hari dan waktu istirahat ${m.sleepHours} jam.`,
            },
          };
        })
      );
      setIsRecalibrating(false);
      sound.playPeacefulChime();
      setSmartGoalFeedback('AI Adaptive Engine berhasil mengalibrasi target aktivitas seluruh keluarga hari ini!');
      setTimeout(() => setSmartGoalFeedback(null), 4500);
    }, 700);
  };

  const handleSimulateWatchSync = () => {
    setIsSyncingWatch(true);
    sound.playAlertTone();
    setTimeout(() => {
      setFamilyMembers((prev) =>
        prev.map((m) => {
          if (m.relation === 'Ayah') {
            return {
              ...m,
              dailySteps: m.dailySteps + 350,
              activeMinutes: m.activeMinutes + 5,
              waterLiters: +(m.waterLiters + 0.2).toFixed(1)
            };
          }
          return m;
        })
      );
      setIsSyncingWatch(false);
    }, 700);
  };

  const handleShareProgress = () => {
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 4000);
  };

  const handleSaveReminder = () => {
    sound.playPeacefulChime();
    setReminderSaved(true);
    setTimeout(() => setReminderSaved(false), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header section with motto emphasis */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" />
            <span>Gerakan Sehat Keluarga & Integrasi Pelacak Kebugaran</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Menjaga kebugaran jasmani bersama keluarga sebagai sarana memelihara kesehatan dan memperkuat stamina ibadah.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Set Daily Activity & Calorie Calculator Button */}
          <button
            onClick={() => handleOpenSetActivity()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xs transition-colors cursor-pointer"
            title="Atur aktivitas harian, pilih intensitas latihan, dan hitung estimasi kalori otomatis"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Set Aktivitas Harian</span>
          </button>

          {/* Invite Family Member Button */}
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 shadow-xs transition-colors cursor-pointer"
            title="Undang anggota keluarga baru untuk bergabung di leaderboard"
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-600" />
            <span>Undang Anggota</span>
          </button>

          {/* Smart Goal Dynamic Settings Button */}
          <button
            onClick={() => handleOpenSmartGoal()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 shadow-xs transition-colors cursor-pointer"
            title="Atur target aktivitas dinamis berbasis jadwal & performa (Smart Goal)"
          >
            <Target className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Smart Goal Dinamis</span>
          </button>

          {/* Download PDF Report Button */}
          <button
            onClick={() => exportFamilyFitnessPDF(familyMembers)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-xs transition-colors cursor-pointer"
            title="Unduh rekap kebugaran mingguan dalam format PDF"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Unduh Laporan (PDF)</span>
          </button>

          {/* Smartwatch Sync Button */}
          <button
            onClick={handleSimulateWatchSync}
            disabled={isSyncingWatch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Watch className={`w-4 h-4 ${isSyncingWatch ? 'animate-spin' : ''}`} />
            <span>{isSyncingWatch ? 'Menyinkronkan...' : 'Sinkronkan Jam Pintar'}</span>
          </button>
        </div>
      </div>

      {smartGoalFeedback && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{smartGoalFeedback}</span>
          </div>
          <button
            onClick={() => setSmartGoalFeedback(null)}
            className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {shareSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pencapaian langkah keluarga berhasil dibagikan ke Feed Komunitas FITCity!</span>
        </div>
      )}

      {reminderSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pengingat aktivitas cerdas berbasis waktu shalat berhasil disimpan.</span>
        </div>
      )}

      {/* Motto Card Spotlight */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white shadow-md border border-emerald-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-widest">
            <Heart className="w-4 h-4 text-emerald-400" />
            <span>Motto Kebugaran FITCity</span>
          </div>
          <p className="text-base sm:text-lg font-bold italic text-emerald-100">
            "FIT Mahkota Jihad dijalan Allah untuk menjaga kebugaran jasmani agar lebih semangat dalam beribadah."
          </p>
          <p className="text-xs text-emerald-200/80">
            Kekuatan fisik yang prima memampukan kita berdiri lebih khusyuk dalam tahajjud, melangkah giat ke masjid, dan berkhidmat untuk sesama.
          </p>
        </div>

        <button
          onClick={handleShareProgress}
          className="self-start md:self-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
        >
          <Share2 className="w-4 h-4" />
          <span>Bagikan Kemajuan ke Komunitas</span>
        </button>
      </div>

      {/* Family Steps Challenge Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-1 transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Langkah Keluarga Hari Ini
          </span>
          <div className="text-3xl font-black text-slate-900 dark:text-white flex items-baseline gap-2">
            {totalFamilySteps.toLocaleString('id-ID')}
            <span className="text-xs text-slate-400 font-normal">/ {familyTargetSteps.toLocaleString('id-ID')}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full"
              style={{ width: `${familyProgressPct}%` }}
            />
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            {familyProgressPct}% dari Target Harian Keluarga Terpenuhi
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-1 transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Kalori Aktif Terbakar
          </span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Flame className="w-6 h-6 text-amber-500" />
            <span>1.640 kkal</span>
          </div>
          <p className="text-xs text-slate-500">Meningkatkan metabolisme dan elastisitas pembuluh darah</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-1 transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Konsistensi (Streak) Keluarga
          </span>
          <div className="text-3xl font-black text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
            <Award className="w-6 h-6 text-emerald-500" />
            <span>14 Hari Beruntun</span>
          </div>
          <p className="text-xs text-slate-500">Keluarga Bugar Teladan Wilayah Pusat Kota</p>
        </div>

      </div>

      {/* Smart Goal Adaptive Hub Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Fitur Smart Goal: Target Aktivitas Dinamis Keluarga</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  AI Calibrated
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Target harian beradaptasi otomatis terhadap riwayat performa langkah, jam istirahat, dan kepadatan jadwal hari ini.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleAutoAdaptiveRecalibrate}
              disabled={isRecalibrating}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Kalkulasi ulang rekomendasi target otomatis"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isRecalibrating ? 'animate-spin' : ''}`} />
              <span>{isRecalibrating ? 'Mengalibrasi...' : 'Kalkulasi Ulang AI'}</span>
            </button>

            <button
              onClick={() => handleOpenSmartGoal()}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-200" />
              <span>Sesuaikan Jadwal & Target</span>
            </button>
          </div>
        </div>

        {/* Quick Mode Status Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-[11px] font-semibold text-slate-400">Mode Jadwal Aktif Anggota:</span>
          {familyMembers.map((m) => (
            <button
              key={m.id}
              onClick={() => handleOpenSmartGoal(m.id)}
              className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="font-bold">{m.name.split(' ')[0]}:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold uppercase text-[10px]">
                {m.smartGoal?.scheduleIntensity || 'NORMAL'}
              </span>
              <span className="text-slate-400">({m.targetSteps.toLocaleString('id-ID')} lkh)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Family Leaderboard & Friendly Challenges */}
      <FamilyLeaderboard
        familyMembers={familyMembers}
        onOpenInviteModal={() => setShowInviteModal(true)}
      />

      {/* Family Members Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Papan Pemantauan Anggota Keluarga
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Data aktivitas fisik mingguan dan hidrasi harian terhubung otomatis
            </p>
          </div>
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
            {familyMembers.length} Anggota Keluarga
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {familyMembers.map((member) => {
            const pct = Math.min(100, Math.round((member.dailySteps / member.targetSteps) * 100));
            return (
              <div
                key={member.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {member.name}
                      </h4>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{member.relation}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {member.streakDays} Hari Rutin
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Langkah Harian</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {member.dailySteps.toLocaleString('id-ID')} / {member.targetSteps.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block truncate">Menit</span>
                      <strong className="text-slate-800 dark:text-slate-200">{member.activeMinutes}m</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block truncate">Kalori</span>
                      <strong className="text-amber-600 dark:text-amber-400 font-bold">
                        {member.caloriesBurned ? `${member.caloriesBurned}` : `${Math.round(member.dailySteps * 0.04)}`}k
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block truncate">Air</span>
                      <strong className="text-slate-800 dark:text-slate-200">{member.waterLiters}L</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block truncate">Tidur</span>
                      <strong className="text-slate-800 dark:text-slate-200">{member.sleepHours}j</strong>
                    </div>
                  </div>

                  {/* Daily Activity Active Plan Badge */}
                  {member.dailyActivity && (
                    <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1 truncate">
                          <Flame className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="truncate">{member.dailyActivity.activityName}</span>
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 uppercase">
                          {member.dailyActivity.intensity.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                        <span>{member.dailyActivity.durationMinutes} menit latihan</span>
                        <strong className="text-amber-600 dark:text-amber-400 font-bold">
                          ~{member.dailyActivity.estimatedCalories} Kkal
                        </strong>
                      </div>
                    </div>
                  )}

                  {/* Smart Goal Adaptive Details */}
                  {member.smartGoal && (
                    <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <Target className="w-3 h-3 text-emerald-600" />
                          <span>Smart Goal [{member.smartGoal.scheduleIntensity.toUpperCase()}]</span>
                        </span>
                        <button
                          onClick={() => handleOpenSmartGoal(member.id)}
                          className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          Sesuaikan
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                        {member.smartGoal.reason}
                      </p>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 pt-0.5">
                        <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{member.smartGoal.recommendedTimeWindow}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenSetActivity(member.id)}
                    className="py-1.5 px-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Atur aktivitas & hitung kalori harian"
                  >
                    <Flame className="w-3 h-3 text-amber-500" />
                    <span>Set Aktivitas</span>
                  </button>

                  <button
                    onClick={() => handleOpenSmartGoal(member.id)}
                    className="py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Sliders className="w-3 h-3 text-emerald-600" />
                    <span>Smart Goal</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personalized AI Weekly Health Report & Smart Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: AI Personalized Health Progress Report */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Laporan Perkembangan Mingguan Personal AI
            </h3>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              <strong>Capaian Minggu Ini:</strong> Rata-rata langkah harian Anda (Ahmad Faiz) mencapai <strong>9.450 langkah/hari</strong> (+14% dibandingkan pekan lalu).
            </p>
            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-1.5">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                Evaluasi Kebugaran & Stamina Ibadah:
              </span>
              <p className="text-slate-700 dark:text-slate-300">
                Peningkatan volume jalan pagi setelah Subuh memberikan dampak positif pada ritme denyut jantung istirahat (resting heart rate turun dari 72 bpm ke 66 bpm). Durasi sujud dan ruku’ shalat malam dapat dipertahankan lebih stabil tanpa kelelahan punggung bawah.
              </p>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Saran: Pertahankan hidrasi 2,8 liter per hari, dan lakukan terapi peregangan sendi sebelum Shalat Isya berjamaah.
            </p>
          </div>
        </div>

        {/* Right: Smart Notification Reminders Based on Personal Preferences */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pengingat Aktivitas Cerdas Berbasis Preferensi
              </h3>
            </div>
            <span className="text-[11px] text-slate-400">Adaptif Waktu Shalat</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Jalan Pagi Menuju Shalat Subuh Masjid
                </span>
                <span className="text-slate-500 text-[11px]">Pengingat aktif pukul 04:10 WIB (20 mnt sebelum adzan)</span>
              </div>
              <input type="checkbox" defaultChecked className="accent-emerald-600 w-4 h-4 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Peregangan Relaksasi Sendi Sebelum Ashar
                </span>
                <span className="text-slate-500 text-[11px]">Pengingat aktif pukul 14:45 WIB saat jeda kerja</span>
              </div>
              <input type="checkbox" defaultChecked className="accent-emerald-600 w-4 h-4 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Cukupi 1 Gelas Air Hangat Madu Menjelang Tidur
                </span>
                <span className="text-slate-500 text-[11px]">Pengingat aktif pukul 21:00 WIB setelah shalat witir</span>
              </div>
              <input type="checkbox" defaultChecked className="accent-emerald-600 w-4 h-4 cursor-pointer" />
            </div>

            <button
              onClick={handleSaveReminder}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-xl transition-colors cursor-pointer text-center"
            >
              Simpan Pengingat Cerdas
            </button>
          </div>
        </div>

      </div>

      {/* Set Daily Activity Modal with Automatic Calorie Calculator */}
      <SetDailyActivityModal
        isOpen={showSetActivityModal}
        onClose={() => setShowSetActivityModal(false)}
        familyMembers={familyMembers}
        initialMemberId={selectedMemberForActivity || undefined}
        onSaveActivity={handleSaveDailyActivity}
      />

      {/* Smart Goal Configuration Modal */}
      <SmartGoalModal
        isOpen={showSmartGoalModal}
        onClose={() => setShowSmartGoalModal(false)}
        familyMembers={familyMembers}
        selectedMemberId={selectedMemberForModal}
        onUpdateMemberGoal={handleUpdateMemberGoal}
        onBatchUpdateAll={handleBatchUpdateAll}
      />

      {/* Invite Family Member Modal */}
      <InviteFamilyMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onAddMember={handleAddFamilyMember}
      />

    </div>
  );
};
