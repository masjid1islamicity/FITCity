import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  UserPlus, 
  Flame, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  Target, 
  Clock, 
  Droplets,
  Zap,
  Users
} from 'lucide-react';
import { FamilyMemberFitness, FamilyChallenge } from '../types';
import { sound } from '../services/audio';

interface FamilyLeaderboardProps {
  familyMembers: FamilyMemberFitness[];
  onOpenInviteModal: () => void;
}

const DEFAULT_CHALLENGES: FamilyChallenge[] = [
  {
    id: 'ch-01',
    title: '70.000 Langkah Sinergi Keluarga Sepekan',
    badge: '🏆 Bintang Sehat',
    description: 'Akumulasi langkah seluruh anggota keluarga untuk menjaga kesehatan kardiovaskular.',
    targetMetric: 'Langkah Bersama',
    currentValue: 58650,
    goalValue: 70000,
    progressPercent: 84,
    deadline: 'Sisa 2 Hari',
    participantsCount: 5,
    rewardPoints: 500,
    category: 'Langkah',
  },
  {
    id: 'ch-02',
    title: 'Jalan Subuh Berjamaah 5 Hari Berturut-turut',
    badge: '🕌 Stamina Ibadah',
    description: 'Berjalan kaki menuju shalat Subuh di masjid lingkungan untuk memetik udara segar dan berkah pagi.',
    targetMetric: 'Hari Konsisten',
    currentValue: 4,
    goalValue: 5,
    progressPercent: 80,
    deadline: 'Sisa 1 Hari',
    participantsCount: 4,
    rewardPoints: 350,
    category: 'Ibadah & Stamina',
  },
  {
    id: 'ch-03',
    title: 'Disiplin Hidrasi 2,5 Liter Air Hangat Madu',
    badge: '💧 Hidrasi Optimal',
    description: 'Menjaga cairan tubuh agar sujud dan ruku’ shalat malam senantiasa nyaman tanpa kram.',
    targetMetric: 'Kepatuhan Harian',
    currentValue: 88,
    goalValue: 100,
    progressPercent: 88,
    deadline: 'Hari Ini',
    participantsCount: 5,
    rewardPoints: 200,
    category: 'Hidrasi',
  },
];

export const FamilyLeaderboard: React.FC<FamilyLeaderboardProps> = ({
  familyMembers,
  onOpenInviteModal,
}) => {
  const [rankingTab, setRankingTab] = useState<'steps' | 'percent' | 'streak' | 'points'>('steps');
  const [challenges, setChallenges] = useState<FamilyChallenge[]>(DEFAULT_CHALLENGES);
  const [claimedChallengeId, setClaimedChallengeId] = useState<string | null>(null);

  // Compute points for each member:
  // Points = (dailySteps * 0.1) + (activeMinutes * 5) + (waterLiters * 100) + (streakDays * 50)
  const sortedMembers = [...familyMembers].sort((a, b) => {
    if (rankingTab === 'steps') {
      return b.dailySteps - a.dailySteps;
    } else if (rankingTab === 'percent') {
      const pctA = a.dailySteps / a.targetSteps;
      const pctB = b.dailySteps / b.targetSteps;
      return pctB - pctA;
    } else if (rankingTab === 'streak') {
      return b.streakDays - a.streakDays;
    } else {
      const ptsA = Math.round(a.dailySteps * 0.1 + a.activeMinutes * 5 + a.waterLiters * 100 + a.streakDays * 50);
      const ptsB = Math.round(b.dailySteps * 0.1 + b.activeMinutes * 5 + b.waterLiters * 100 + b.streakDays * 50);
      return ptsB - ptsA;
    }
  });

  const getMemberPoints = (m: FamilyMemberFitness) => {
    return Math.round(m.dailySteps * 0.1 + m.activeMinutes * 5 + m.waterLiters * 100 + m.streakDays * 50);
  };

  const handleSupportChallenge = (id: string) => {
    sound.playPeacefulChime();
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          const nextVal = Math.min(ch.goalValue, ch.currentValue + (ch.goalValue <= 10 ? 1 : 1500));
          return {
            ...ch,
            currentValue: nextVal,
            progressPercent: Math.min(100, Math.round((nextVal / ch.goalValue) * 100)),
          };
        }
        return ch;
      })
    );
    setClaimedChallengeId(id);
    setTimeout(() => setClaimedChallengeId(null), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
      
      {/* Header with Title and Invite Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Papan Peringkat & Tantangan Kebugaran Keluarga (Family Leaderboard)</span>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                  Fastabiqul Khairat
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Berlomba-lomba dalam kebaikan dan menjaga kesehatan bersama seluruh anggota keluarga
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenInviteModal}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Undang Anggota Keluarga</span>
        </button>
      </div>

      {/* Podium for Top 3 Leaders */}
      {sortedMembers.length >= 3 && (
        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-800/40 dark:to-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-500" />
              <span>Podium Kebugaran Hari Ini</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Update real-time dari smartwatch & sensor
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 pb-2">
            
            {/* Rank 2 (Perak) */}
            <div className="flex flex-col items-center space-y-2 order-1">
              <div className="relative">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-black text-slate-700 dark:text-slate-200 text-base sm:text-lg border-2 border-slate-300 dark:border-slate-500 shadow-sm">
                  {sortedMembers[1].name.split(' ')[0]}
                </div>
                <div className="absolute -top-2.5 -right-2 bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white rounded-full w-6 h-6 flex items-center justify-center font-black text-xs shadow-xs border border-white dark:border-slate-800">
                  2
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white block truncate max-w-[90px] sm:max-w-none">
                  {sortedMembers[1].name}
                </span>
                <span className="text-[10px] text-slate-500 block">{sortedMembers[1].relation}</span>
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block mt-0.5">
                  {sortedMembers[1].dailySteps.toLocaleString('id-ID')} lkh
                </span>
              </div>
              <div className="w-full h-14 bg-slate-200/80 dark:bg-slate-700/60 rounded-t-xl flex items-center justify-center text-slate-500 text-xs font-bold">
                🥈 Perak
              </div>
            </div>

            {/* Rank 1 (Emas - Highest) */}
            <div className="flex flex-col items-center space-y-2 order-2">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center font-black text-amber-950 text-lg sm:text-xl border-4 border-amber-300 shadow-md">
                  {sortedMembers[0].name.split(' ')[0]}
                </div>
                <div className="absolute -top-3.5 -right-2 bg-amber-500 text-white rounded-full w-7 h-7 flex items-center justify-center font-black text-sm shadow-sm border-2 border-white">
                  👑
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs sm:text-sm font-extrabold text-amber-700 dark:text-amber-400 block truncate max-w-[100px] sm:max-w-none">
                  {sortedMembers[0].name}
                </span>
                <span className="text-[10px] text-slate-500 block">{sortedMembers[0].relation}</span>
                <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5">
                  {sortedMembers[0].dailySteps.toLocaleString('id-ID')} lkh
                </span>
              </div>
              <div className="w-full h-20 bg-amber-100 dark:bg-amber-950/60 border-t-2 border-amber-400 rounded-t-xl flex items-center justify-center text-amber-800 dark:text-amber-300 text-xs font-black shadow-xs">
                🥇 Juara 1
              </div>
            </div>

            {/* Rank 3 (Perunggu) */}
            <div className="flex flex-col items-center space-y-2 order-3">
              <div className="relative">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-800/20 dark:bg-amber-950/40 flex items-center justify-center font-black text-amber-800 dark:text-amber-300 text-base sm:text-lg border-2 border-amber-600/40 shadow-sm">
                  {sortedMembers[2].name.split(' ')[0]}
                </div>
                <div className="absolute -top-2.5 -right-2 bg-amber-700 text-white rounded-full w-6 h-6 flex items-center justify-center font-black text-xs shadow-xs border border-white dark:border-slate-800">
                  3
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white block truncate max-w-[90px] sm:max-w-none">
                  {sortedMembers[2].name}
                </span>
                <span className="text-[10px] text-slate-500 block">{sortedMembers[2].relation}</span>
                <span className="text-xs font-extrabold text-amber-800 dark:text-amber-300 block mt-0.5">
                  {sortedMembers[2].dailySteps.toLocaleString('id-ID')} lkh
                </span>
              </div>
              <div className="w-full h-10 bg-amber-900/10 dark:bg-amber-900/30 rounded-t-xl flex items-center justify-center text-amber-700 dark:text-amber-400 text-xs font-bold">
                🥉 Perunggu
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Leaderboard Table with Ranking Filter */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Daftar Lengkap Peringkat Anggota ({sortedMembers.length} Orang):
          </span>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setRankingTab('steps')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                rankingTab === 'steps'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Langkah
            </button>
            <button
              type="button"
              onClick={() => setRankingTab('percent')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                rankingTab === 'percent'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              % Target
            </button>
            <button
              type="button"
              onClick={() => setRankingTab('streak')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                rankingTab === 'streak'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Streak
            </button>
            <button
              type="button"
              onClick={() => setRankingTab('points')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                rankingTab === 'points'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Poin Kebaikan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Posisi</th>
                <th className="py-2.5 px-3">Nama Anggota</th>
                <th className="py-2.5 px-3">Langkah / Target</th>
                <th className="py-2.5 px-3">Menit Aktif</th>
                <th className="py-2.5 px-3">Streak Rutin</th>
                <th className="py-2.5 px-3 text-right">Poin Kebaikan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedMembers.map((member, index) => {
                const pct = Math.min(100, Math.round((member.dailySteps / member.targetSteps) * 100));
                const points = getMemberPoints(member);
                const isTop3 = index < 3;

                return (
                  <tr
                    key={member.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                      index === 0 ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold ${
                          index === 0
                            ? 'bg-amber-500 text-white'
                            : index === 1
                            ? 'bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-white'
                            : index === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {member.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {member.relation}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="space-y-1 max-w-[130px]">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {member.dailySteps.toLocaleString('id-ID')}
                          </span>
                          <span className="text-slate-400">({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-1 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                      {member.activeMinutes} mnt
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md text-[11px]">
                        <Flame className="w-3 h-3 text-amber-500" />
                        <span>{member.streakDays} hari</span>
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span className="font-extrabold text-amber-600 dark:text-amber-400 text-xs">
                        +{points.toLocaleString('id-ID')} pts
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Friendly Challenges Section */}
      <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Tantangan Bersama Keluarga Pekan Ini
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">
            Dukung progres bersama untuk raih lencana keluarga bugar
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.map((ch) => {
            const isCompleted = ch.progressPercent >= 100;
            return (
              <div
                key={ch.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {ch.badge}
                    </span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                      +{ch.rewardPoints} Poin
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                    {ch.title}
                  </h5>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {ch.description}
                  </p>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">{ch.targetMetric}</span>
                      <strong className="text-slate-800 dark:text-slate-200">
                        {ch.currentValue.toLocaleString('id-ID')} / {ch.goalValue.toLocaleString('id-ID')}
                      </strong>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${ch.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>{ch.progressPercent}% tercapai</span>
                      <span>{ch.deadline}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleSupportChallenge(ch.id)}
                    className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tantangan Tuntas!</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>Dukung Progres (+Langkah)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
