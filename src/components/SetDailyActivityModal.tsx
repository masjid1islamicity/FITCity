import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Flame, 
  Clock, 
  Scale, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Heart, 
  Zap, 
  TrendingUp, 
  Info, 
  Droplets,
  Calendar,
  User
} from 'lucide-react';
import { FamilyMemberFitness, WorkoutIntensityLevel, DailyActivityPlan } from '../types';
import { sound } from '../services/audio';

interface SetDailyActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyMembers: FamilyMemberFitness[];
  initialMemberId?: string;
  onSaveActivity: (memberId: string, activityPlan: DailyActivityPlan) => void;
}

interface ActivityPreset {
  name: string;
  defaultIntensity: WorkoutIntensityLevel;
  met: number;
  category: 'jalan' | 'lari' | 'sepeda' | 'senam' | 'renang' | 'kekuatan';
  icon: string;
  description: string;
}

const ACTIVITY_PRESETS: ActivityPreset[] = [
  {
    name: 'Jalan Santai Subuh & Tadabbur Alam',
    defaultIntensity: 'ringan',
    met: 3.0,
    category: 'jalan',
    icon: '🚶',
    description: 'Aktivitas pemulihan pasca Subuh, menyerap sinar matahari pagi dan menjaga kelenturan sendi.',
  },
  {
    name: 'Peregangan Sendi & Relaksasi Otot Lansia',
    defaultIntensity: 'ringan',
    met: 2.5,
    category: 'senam',
    icon: '🧘',
    description: 'Latihan mobilitas aman berbenturan rendah untuk kakek/nenek dan kelenturan punggung.',
  },
  {
    name: 'Jalan Cepat Bugar (Brisk Walk)',
    defaultIntensity: 'sedang',
    met: 4.8,
    category: 'jalan',
    icon: '🚶‍♂️',
    description: 'Melatih ritme detak jantung di zona aerobik sehat dan membakar cadangan glukosa.',
  },
  {
    name: 'Senam Kesegaran Jasmani (SKJ) Keluarga',
    defaultIntensity: 'sedang',
    met: 5.2,
    category: 'senam',
    icon: '🤸',
    description: 'Gerakan ritmis ceria bersama anak dan pasangan untuk koordinasi motorik dan semangat.',
  },
  {
    name: 'Bersepeda Santai Jalur Hijau Kota',
    defaultIntensity: 'sedang',
    met: 6.0,
    category: 'sepeda',
    icon: '🚴',
    description: 'Menjelajahi jalur sepeda ramah lingkungan FITCity sembari melatih otot paha dan betis.',
  },
  {
    name: 'Jogging / Lari Ringan (7-8 km/jam)',
    defaultIntensity: 'tinggi',
    met: 7.8,
    category: 'lari',
    icon: '🏃',
    description: 'Latihan kardio intensif meningkatkan kapasitas paru-paru dan daya tahan tubuh.',
  },
  {
    name: 'Berenang Gaya Bebas / Dada',
    defaultIntensity: 'tinggi',
    met: 8.0,
    category: 'renang',
    icon: '🏊',
    description: 'Sunnah olahraga melatih seluruh otot tubuh tanpa beban tumpuan pada sendi lutut.',
  },
  {
    name: 'Kalistenik & Latihan Beban Tubuh Mandiri',
    defaultIntensity: 'tinggi',
    met: 8.0,
    category: 'kekuatan',
    icon: '💪',
    description: 'Push-up, squat, dan plank untuk menguatkan massa otot inti (core) dan stabilitas shalat.',
  },
  {
    name: 'Lari Cepat Interval Sprint (HIIT)',
    defaultIntensity: 'sangat_tinggi',
    met: 11.5,
    category: 'lari',
    icon: '⚡',
    description: 'Interval intensitas tinggi untuk pembakaran kalori maksimal dan peningkatan ambang laktat.',
  },
];

// MET Multipliers based on chosen intensity
const INTENSITY_MET_MAP: Record<WorkoutIntensityLevel, { baseMet: number; label: string; badgeColor: string; hrZone: string; desc: string }> = {
  ringan: {
    baseMet: 3.0,
    label: 'Ringan (Low Intensity)',
    badgeColor: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    hrZone: '50% - 60% Detak Jantung Maks',
    desc: 'Bagus untuk pemulihan, membakar lemak ringan tanpa rasa lelah berlebih.',
  },
  sedang: {
    baseMet: 5.0,
    label: 'Sedang (Moderate Intensity)',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    hrZone: '60% - 70% Detak Jantung Maks',
    desc: 'Zona aerobik ideal harian: menjaga kesehatan kardiovaskular dan stamina ibadah.',
  },
  tinggi: {
    baseMet: 8.0,
    label: 'Tinggi (Vigorous Cardio)',
    badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    hrZone: '70% - 85% Detak Jantung Maks',
    desc: 'Meningkatkan VO2 max, kapasitas paru, dan daya tahan otot secara signifikan.',
  },
  sangat_tinggi: {
    baseMet: 11.0,
    label: 'Sangat Tinggi (HIIT Peak)',
    badgeColor: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    hrZone: '85% - 95% Detak Jantung Maks',
    desc: 'Pembakaran kalori intens dan peningkatan efek afterburn (EPOC) hingga beberapa jam ke depan.',
  },
};

export const SetDailyActivityModal: React.FC<SetDailyActivityModalProps> = ({
  isOpen,
  onClose,
  familyMembers,
  initialMemberId,
  onSaveActivity,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    initialMemberId || (familyMembers[0]?.id ?? '')
  );

  const selectedMember = familyMembers.find((m) => m.id === selectedMemberId) || familyMembers[0];

  // Default weights based on relation
  const defaultWeight = useMemo(() => {
    if (!selectedMember) return 65;
    if (selectedMember.relation === 'Ayah') return 72;
    if (selectedMember.relation === 'Ibu') return 58;
    if (selectedMember.relation.includes('Pertama')) return 45;
    if (selectedMember.relation.includes('Kedua')) return 35;
    if (selectedMember.relation === 'Kakek') return 62;
    return 65;
  }, [selectedMember]);

  const [selectedPreset, setSelectedPreset] = useState<ActivityPreset>(ACTIVITY_PRESETS[2]); // Default Brisk Walk
  const [customActivityName, setCustomActivityName] = useState('');
  const [intensity, setIntensity] = useState<WorkoutIntensityLevel>('sedang');
  const [durationMinutes, setDurationMinutes] = useState<number>(35);
  const [bodyWeightKg, setBodyWeightKg] = useState<number>(defaultWeight);
  const [preferredTimeWindow, setPreferredTimeWindow] = useState('06:00 - 06:45 WIB (Pagi)');
  const [activityNotes, setActivityNotes] = useState('');

  // Update default weight when member changes
  const handleMemberChange = (id: string) => {
    setSelectedMemberId(id);
    const m = familyMembers.find((item) => item.id === id);
    if (m) {
      if (m.relation === 'Ayah') setBodyWeightKg(72);
      else if (m.relation === 'Ibu') setBodyWeightKg(58);
      else if (m.relation.includes('Pertama')) setBodyWeightKg(45);
      else if (m.relation.includes('Kedua')) setBodyWeightKg(35);
      else if (m.relation === 'Kakek') setBodyWeightKg(62);
    }
  };

  // Select a preset
  const handleSelectPreset = (preset: ActivityPreset) => {
    setSelectedPreset(preset);
    setIntensity(preset.defaultIntensity);
    setCustomActivityName(preset.name);
  };

  // Automatic Calorie Calculation based on MET, Body Weight, and Duration
  // Formula: Calories = MET * Weight(kg) * (DurationMinutes / 60)
  const estimatedCaloriesBurned = useMemo(() => {
    const intensityConfig = INTENSITY_MET_MAP[intensity];
    // Use preset base MET adjusted by selected intensity tier
    let effectiveMet = selectedPreset.met;
    if (intensity === 'ringan') effectiveMet = Math.min(effectiveMet, 3.5);
    else if (intensity === 'sedang') effectiveMet = Math.max(4.5, Math.min(effectiveMet, 6.5));
    else if (intensity === 'tinggi') effectiveMet = Math.max(7.5, Math.min(effectiveMet, 9.0));
    else if (intensity === 'sangat_tinggi') effectiveMet = Math.max(10.5, effectiveMet + 2.0);

    const hours = durationMinutes / 60;
    const cals = effectiveMet * bodyWeightKg * hours;
    return Math.round(cals);
  }, [intensity, selectedPreset, durationMinutes, bodyWeightKg]);

  // Calories equivalents
  const caloriesEquivalence = useMemo(() => {
    if (estimatedCaloriesBurned < 100) return 'Setara ~4-5 butir kurma ajwah energi';
    if (estimatedCaloriesBurned < 200) return 'Setara ~1 porsi pisang & oatmeal sarapan';
    if (estimatedCaloriesBurned < 350) return 'Setara ~1 porsi dada ayam panggang & nasi merah';
    return 'Setara ~1 porsi lengkap makan siang bergizi seimbang';
  }, [estimatedCaloriesBurned]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    sound.playPeacefulChime();

    const plan: DailyActivityPlan = {
      activityName: customActivityName || selectedPreset.name,
      intensity,
      durationMinutes,
      estimatedCalories: estimatedCaloriesBurned,
      bodyWeightKg,
      timeWindow: preferredTimeWindow,
      notes: activityNotes || `Target pembakaran ${estimatedCaloriesBurned} kkal untuk menjaga stamina ibadah.`,
      scheduledAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    onSaveActivity(selectedMember.id, plan);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Atur Aktivitas Harian (Set Daily Activity)</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  Kalkulator Kalori Otomatis
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih intensitas latihan harian untuk menghitung estimasi pembakaran energi jasmani secara presisi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Member Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Pilih Anggota Keluarga:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {familyMembers.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => handleMemberChange(member.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedMemberId === member.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-600 dark:border-emerald-500 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/30'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <strong className="block text-xs truncate">{member.name}</strong>
                  <span className="text-[10px] text-slate-400">{member.relation}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Presets Grid */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
              Pilihan Jenis Latihan & Aktivitas Fisik:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-100 dark:border-slate-800 rounded-xl">
              {ACTIVITY_PRESETS.map((preset) => {
                const isSelected = selectedPreset.name === preset.name;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2 ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-lg">{preset.icon}</span>
                    <div className="min-w-0 flex-1">
                      <strong className="block text-[11px] leading-snug truncate">{preset.name}</strong>
                      <span className="text-[9px] opacity-80 block uppercase tracking-wider mt-0.5">
                        MET {preset.met} · {preset.defaultIntensity}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Workout Intensity Level Selector (Core Requirement) */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Pilih Intensitas Latihan Harian:</span>
              </label>
              <span className="text-[10px] text-slate-400">Pengaruh Langsung ke MET & Kalori</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {(['ringan', 'sedang', 'tinggi', 'sangat_tinggi'] as WorkoutIntensityLevel[]).map((lvl) => {
                const config = INTENSITY_MET_MAP[lvl];
                const isSelected = intensity === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setIntensity(lvl)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <strong className="block text-xs capitalize">{lvl.replace('_', ' ')}</strong>
                    <span className="text-[9px] opacity-80 block mt-0.5">{config.hrZone.split(' ')[0]} HR</span>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
              ℹ️ {INTENSITY_MET_MAP[intensity].desc}
            </p>
          </div>

          {/* Duration & Weight Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Durasi Latihan:</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Math.max(5, +e.target.value || 5))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 font-bold text-slate-900 dark:text-white"
                />
                <span className="text-xs text-slate-500 font-semibold">Menit</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                <span>Berat Badan:</span>
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="20"
                  max="150"
                  value={bodyWeightKg}
                  onChange={(e) => setBodyWeightKg(Math.max(20, +e.target.value || 20))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 font-bold text-slate-900 dark:text-white"
                />
                <span className="text-xs text-slate-500 font-semibold">Kg</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Jadwal Waktu:</span>
              </label>
              <select
                value={preferredTimeWindow}
                onChange={(e) => setPreferredTimeWindow(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white font-medium"
              >
                <option value="05:30 - 06:15 WIB (Ba'da Subuh)">Ba'da Subuh (05:30 - 06:15 WIB)</option>
                <option value="06:00 - 06:45 WIB (Pagi)">Pagi Hari (06:00 - 06:45 WIB)</option>
                <option value="16:30 - 17:30 WIB (Sore)">Sore Hari (16:30 - 17:30 WIB)</option>
                <option value="20:00 - 20:45 WIB (Ba'da Isya)">Ba'da Isya (20:00 - 20:45 WIB)</option>
              </select>
            </div>
          </div>

          {/* Real-Time Automatic Calorie Burn Calculation Card (Highlight Display) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-emerald-500/10 to-teal-500/5 border border-amber-300 dark:border-amber-700/60 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Flame className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-900 dark:text-amber-300 block">
                    Estimasi Kalori Terbakar Otomatis
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Berdasarkan formula MET ({selectedPreset.met}) × {bodyWeightKg}kg × {durationMinutes} menit
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  ~{estimatedCaloriesBurned}
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Kkal</span>
              </div>
            </div>

            <div className="pt-1.5 border-t border-amber-200/60 dark:border-amber-800/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{caloriesEquivalence}</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <Droplets className="w-3 h-3 text-emerald-600" />
                <span>Target Air: +500ml</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Simpan & Terapkan Aktivitas</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
