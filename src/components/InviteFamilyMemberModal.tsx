import React, { useState } from 'react';
import { 
  UserPlus, 
  X, 
  Copy, 
  Check, 
  Share2, 
  QrCode, 
  Heart, 
  Sparkles, 
  MessageCircle, 
  Users,
  CheckCircle2
} from 'lucide-react';
import { FamilyMemberFitness, ScheduleIntensity } from '../types';
import { sound } from '../services/audio';

interface InviteFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (newMember: FamilyMemberFitness) => void;
}

export const InviteFamilyMemberModal: React.FC<InviteFamilyMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Bibi');
  const [customRelation, setCustomRelation] = useState('');
  const [targetSteps, setTargetSteps] = useState(7500);
  const [copiedLink, setCopiedLink] = useState(false);
  const [inviteMethod, setInviteMethod] = useState<'link' | 'qr' | 'wa'>('link');

  const familyCode = 'FITCITY-FAM-7729';
  const inviteUrl = `https://fitcity.madani.id/join?code=${familyCode}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(inviteUrl);
    setCopiedLink(true);
    sound.playAlertTone();
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalRelation = relation === 'Lainnya' ? (customRelation || 'Keluarga') : relation;

    const newMember: FamilyMemberFitness = {
      id: `fam-${Date.now()}`,
      name: name.trim(),
      relation: finalRelation,
      dailySteps: Math.round(targetSteps * 0.4), // initial start steps
      targetSteps: targetSteps,
      activeMinutes: 25,
      waterLiters: 1.8,
      sleepHours: 7.0,
      streakDays: 1,
      smartGoal: {
        enabled: true,
        scheduleIntensity: 'normal' as ScheduleIntensity,
        historicalBaselineSteps: targetSteps,
        adaptiveTargetSteps: targetSteps,
        targetActiveMinutes: 40,
        recommendedTimeWindow: '06:00 - 07:00 WIB (Setelah Subuh)',
        reason: `Anggota baru bergabung! Target awal ${targetSteps.toLocaleString('id-ID')} langkah untuk membangun rutinitas sehat.`,
      },
    };

    onAddMember(newMember);
    sound.playPeacefulChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Undang Anggota Keluarga Baru</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  Komunitas Sehat
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ajak keluarga besar bersinergi menjaga kebugaran jasmani & stamina ibadah
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

        {/* Tab Toggle: Tambah Langsung vs Bagikan Tautan */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setInviteMethod('link')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              inviteMethod === 'link'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Tambah Profil
          </button>
          <button
            type="button"
            onClick={() => setInviteMethod('wa')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              inviteMethod === 'wa'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={() => setInviteMethod('qr')}
            className={`py-1.5 rounded-lg transition-colors cursor-pointer ${
              inviteMethod === 'qr'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Kode QR
          </button>
        </div>

        {/* Method 1: Direct Form Registration */}
        {inviteMethod === 'link' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Nama Lengkap / Panggilan:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Bibi Maryam, Kak Farhan"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Hubungan Keluarga:
                </label>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Nenek">Nenek</option>
                  <option value="Kakek">Kakek</option>
                  <option value="Bibi">Bibi / Tante</option>
                  <option value="Paman">Paman / Om</option>
                  <option value="Kakak">Kakak</option>
                  <option value="Adik">Adik</option>
                  <option value="Sepupu">Sepupu</option>
                  <option value="Lainnya">Lainnya...</option>
                </select>
              </div>

              {relation === 'Lainnya' ? (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Keterangan Hubungan:
                  </label>
                  <input
                    type="text"
                    value={customRelation}
                    onChange={(e) => setCustomRelation(e.target.value)}
                    placeholder="Misal: Keponakan"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Target Awal:
                  </label>
                  <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {targetSteps.toLocaleString('id-ID')} langkah
                  </div>
                </div>
              )}
            </div>

            {/* Target Steps Slider */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Target Langkah Harian Awal:
                </span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {targetSteps.toLocaleString('id-ID')} langkah
                </span>
              </div>
              <input
                type="range"
                min={3000}
                max={15000}
                step={500}
                value={targetSteps}
                onChange={(e) => setTargetSteps(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Santai (3.000)</span>
                <span>Standar (7.500)</span>
                <span>Aktif (12.000+)</span>
              </div>
            </div>

            {/* Family Motto Reminder */}
            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 text-xs space-y-1">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-emerald-600" />
                <span>Semangat Kebersamaan:</span>
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Anggota baru akan langsung masuk ke Papan Peringkat (Leaderboard) dan dapat berpartisipasi dalam tantangan mingguan bersama keluarga.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-200" />
                <span>Tambahkan ke Papan Keluarga</span>
              </button>
            </div>
          </form>
        )}

        {/* Method 2: Share via WhatsApp */}
        {inviteMethod === 'wa' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 space-y-2">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                Pesan Undangan WhatsApp Siap Kirim:
              </span>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                "Assalamu'alaikum Warahmatullahi Wabarakatuh! Yuk bergabung di Tantangan Kebugaran Keluarga FITCity bersama kami. Klik tautan ini untuk sinkronkan jam tangan atau smartphone Anda: {inviteUrl} (Kode: {familyCode})"
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Assalamu'alaikum! Yuk gabung di Tantangan Kebugaran Keluarga FITCity: ${inviteUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-center flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Buka WhatsApp & Kirim</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Method 3: QR Code Invitation */}
        {inviteMethod === 'qr' && (
          <div className="space-y-4 text-center py-2">
            <div className="inline-block p-4 bg-white dark:bg-slate-800 rounded-2xl border-2 border-emerald-500/40 shadow-md">
              <div className="w-44 h-44 mx-auto bg-slate-100 dark:bg-slate-900 rounded-xl flex flex-col items-center justify-center p-3 relative overflow-hidden">
                {/* SVG Mock QR Code Pattern */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-800 dark:text-emerald-400">
                  <rect x="10" y="10" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="17.5" y="17.5" width="10" height="10" fill="currentColor" />
                  <rect x="65" y="10" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="72.5" y="17.5" width="10" height="10" fill="currentColor" />
                  <rect x="10" y="65" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="17.5" y="72.5" width="10" height="10" fill="currentColor" />
                  <circle cx="50" cy="50" r="10" fill="currentColor" />
                  <rect x="42" y="15" width="6" height="12" fill="currentColor" />
                  <rect x="42" y="75" width="6" height="12" fill="currentColor" />
                  <rect x="15" y="42" width="12" height="6" fill="currentColor" />
                  <rect x="75" y="42" width="12" height="6" fill="currentColor" />
                  <rect x="65" y="65" width="8" height="8" fill="currentColor" />
                  <rect x="80" y="80" width="8" height="8" fill="currentColor" />
                </svg>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Pindai dengan Kamera Smartphone atau Smartwatch
              </span>
              <p className="text-[11px] text-slate-400">
                Kode Keluarga: <strong className="text-emerald-600 dark:text-emerald-400 font-mono tracking-wider">{familyCode}</strong>
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2 px-3 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Tautan Undangan Tersalin!' : 'Salin Tautan Undangan'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
