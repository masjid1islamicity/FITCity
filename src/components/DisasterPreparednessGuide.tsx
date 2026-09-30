import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  PhoneCall, 
  FileText, 
  Share2, 
  Heart, 
  Users, 
  Zap, 
  Flame, 
  Droplets, 
  Wind, 
  Building2, 
  CheckCircle2, 
  Sparkles,
  Download,
  Info,
  Clock,
  Compass
} from 'lucide-react';
import { DisasterWarningPoint } from '../types';
import { sound } from '../services/audio';

export type DisasterAlertCategory = 'banjir' | 'gempa' | 'cuaca-ekstrem' | 'kebakaran';

export interface PreparednessItem {
  id: string;
  task: string;
  category: 'tas-siaga' | 'mitigasi-rumah' | 'keluarga-rentan' | 'komunikasi';
  priority: 'Kritis' | 'Tinggi' | 'Penting';
  description: string;
  completed: boolean;
}

interface DisasterPreparednessGuideProps {
  activeDistrict?: string;
  activeDisasterPoint?: DisasterWarningPoint | null;
  onTriggerEmergencyAlert?: (message: string) => void;
}

const DEFAULT_CHECKLISTS: Record<DisasterAlertCategory, {
  title: string;
  iconName: string;
  badge: string;
  colorTheme: string;
  evacuationSpot: string;
  doaKeselamatan: string;
  items: PreparednessItem[];
}> = {
  banjir: {
    title: 'Kesiapsiagaan Banjir & Luapan Aliran Sungai',
    iconName: 'Droplets',
    badge: 'Status: Waspada Musim Hujan',
    colorTheme: 'blue',
    evacuationSpot: 'Posko Masjid Raya & Depo Logistik Tanggap Bencana Kawasan Barat',
    doaKeselamatan: 'اللَّهُمَّ حَوَالَيْنَا وَلاَ عَلَيْنَا، اللَّهُمَّ عَلَى الآكَامِ وَالظِّرَابِ وَبُطُونِ الأَوْدِيَةِ (Ya Allah, turunkanlah hujan di sekitar kami dan jangan di atas kami sebagai bencana, turunkan di bukit dan lembah).',
    items: [
      {
        id: 'fl-01',
        task: 'Amankan Dokumen Penting dalam Kantong Kedap Air (Waterproof)',
        category: 'tas-siaga',
        priority: 'Kritis',
        description: 'Simpan KK, KTP, buku tabungan, ijazah, dan sertifikat dalam map ziplock tahan air di bagian atas lemari.',
        completed: true,
      },
      {
        id: 'fl-02',
        task: 'Putuskan Sakelar Utama Listrik (MCB) & Cabut Colokan Elektronik',
        category: 'mitigasi-rumah',
        priority: 'Kritis',
        description: 'Mencegah korsleting arus pendek saat ketinggian air merambat ke lantai dasar.',
        completed: false,
      },
      {
        id: 'fl-03',
        task: 'Lepas Selang Regulator Tabung Gas Elpiji ke Posisi Aman',
        category: 'mitigasi-rumah',
        priority: 'Tinggi',
        description: 'Hindari risiko kebocoran gas metana saat perabotan dapur terendam air.',
        completed: false,
      },
      {
        id: 'fl-04',
        task: 'Siapkan Tas Siaga Bencana (P3K, Obat Rutin Lansia, & Makanan Ringan)',
        category: 'tas-siaga',
        priority: 'Kritis',
        description: 'Sedia obat hipertensi/diabetes keluarga, biskuit energi, kurma, senter LED, dan baterai cadangan.',
        completed: true,
      },
      {
        id: 'fl-05',
        task: 'Evakuasi Terlebih Dahulu Lansia, Ibu Hamil, dan Balita ke Lantai Dua / Posko',
        category: 'keluarga-rentan',
        priority: 'Kritis',
        description: 'Pastikan jalur evakuasi tidak licin dan membawa pakaian hangat serta selimut bayi.',
        completed: false,
      },
      {
        id: 'fl-06',
        task: 'Pastikan Powerbank & Smartphone Terisi Penuh 100%',
        category: 'komunikasi',
        priority: 'Tinggi',
        description: 'Untuk terus menerima peringatan dini IoT ketinggian tanggul dari aplikasi FITCity.',
        completed: false,
      },
      {
        id: 'fl-07',
        task: 'Tetapkan Titik Kumpul Keluarga (Family Meeting Point)',
        category: 'komunikasi',
        priority: 'Penting',
        description: 'Sepakati bertemu di serambi lantai 2 Masjid Raya jika jaringan seluler terganggu.',
        completed: true,
      },
    ],
  },
  gempa: {
    title: 'Kesiapsiagaan Gempa Bumi & Kerentanan Struktur Bangunan',
    iconName: 'Building2',
    badge: 'Mitigasi Gempa Tektonik',
    colorTheme: 'amber',
    evacuationSpot: 'Lapangan Terbuka Alun-Alun Madani & Ruang Terbuka Hijau Bebas Tiang Listrik',
    doaKeselamatan: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا وَخَيْرَ مَا فِيهَا، وَأَعُوذُ بِكَ مِنْ شَرِّهَا وَشَرِّ مَا فِيهَا (Ya Allah, aku memohon kepada-Mu kebaikannya dan aku berlindung dari keburukannya).',
    items: [
      {
        id: 'eq-01',
        task: 'Pahami Manuver Drop, Cover, and Hold On (Berlutut, Lindungi Kepala, Bertahan)',
        category: 'mitigasi-rumah',
        priority: 'Kritis',
        description: 'Berlindung di bawah meja kokoh atau sudut pilar struktural, jauhkan diri dari cermin dan kaca jendela.',
        completed: true,
      },
      {
        id: 'eq-02',
        task: 'Buka Kunci Pintu Keluar Utama Rumah Segera Saat Getaran Terasa',
        category: 'mitigasi-rumah',
        priority: 'Kritis',
        description: 'Kusen pintu rentan macet terpuntir saat gempa sehingga menghambat proses evakuasi darurat.',
        completed: false,
      },
      {
        id: 'eq-03',
        task: 'Gunakan Tangga Darurat Manual, Jangan Gunakan Lift',
        category: 'mitigasi-rumah',
        priority: 'Kritis',
        description: 'Lift berisiko mati mendadak akibat pemadaman otomatis jaringan listrik PLN.',
        completed: true,
      },
      {
        id: 'eq-04',
        task: 'Sediakan Sandal / Sepatu Karet Dekat Ranjang Tidur',
        category: 'tas-siaga',
        priority: 'Tinggi',
        description: 'Melindungi telapak kaki dari serpihan kaca atau genteng yang jatuh saat melangkah keluar.',
        completed: false,
      },
      {
        id: 'eq-05',
        task: 'Cek Jalur Kursi Roda Lansia & Rencana Gendong Balita',
        category: 'keluarga-rentan',
        priority: 'Kritis',
        description: 'Tentukan anggota keluarga yang bertanggung jawab menggendong lansia/anak ke lapangan terbuka.',
        completed: false,
      },
      {
        id: 'eq-06',
        task: 'Matikan Kompor & Hindari Menyalakan Korek Api Pasca Gempa',
        category: 'mitigasi-rumah',
        priority: 'Tinggi',
        description: 'Waspada potensi kebocoran pipa gas perkotaan yang dapat memicu ledakan sekunder.',
        completed: false,
      },
    ],
  },
  'cuaca-ekstrem': {
    title: 'Kesiapsiagaan Cuaca Ekstrem, Hujan Badai & Angin Kencang',
    iconName: 'Wind',
    badge: 'Waspada Siklon Tropis & Petir',
    colorTheme: 'teal',
    evacuationSpot: 'Gedung Serbaguna Kelurahan Harmoni Madani',
    doaKeselamatan: 'اللَّهُمَّ صَيِّباً نَافِعاً (Ya Allah, jadikanlah hujan ini bermanfaat dan tidak membinasakan).',
    items: [
      {
        id: 'wt-01',
        task: 'Periksa & Perkuat Kuncian Atap Seng / Genteng serta Kanopi Garasi',
        category: 'mitigasi-rumah',
        priority: 'Kritis',
        description: 'Angin kencang dapat menerbangkan seng dan kanopi ringan yang membahayakan warga pejalan kaki.',
        completed: true,
      },
      {
        id: 'wt-02',
        task: 'Pangkas Dahan Pohon Rindang yang Menjorok ke Atap atau Dekat Kabel Listrik',
        category: 'mitigasi-rumah',
        priority: 'Tinggi',
        description: 'Koordinasikan dengan Dinas Pertamanan Lingkungan Hidup jika berada di area jalur hijau jalan.',
        completed: false,
      },
      {
        id: 'wt-03',
        task: 'Cabut Antena TV & Perangkat Elektronik Sensitif Terhadap Sambaran Petir',
        category: 'mitigasi-rumah',
        priority: 'Tinggi',
        description: 'Mencegah lonjakan tegangan (voltage surge) yang merusak sirkuit elektronik rumah.',
        completed: true,
      },
      {
        id: 'wt-04',
        task: 'Hindari Berlindung di Bawah Pohon Besar atau Baliho Iklan',
        category: 'mitigasi-rumah',
        priority: 'Kritis',
        description: 'Pohon dan papan reklame rawan tumbang mendadak saat kecepatan angin melampaui 45 km/jam.',
        completed: true,
      },
      {
        id: 'wt-05',
        task: 'Sediakan Lilin Aromaterapi Aman, Senter Cas, & Lampu Darurat LED',
        category: 'tas-siaga',
        priority: 'Penting',
        description: 'Antisipasi pemadaman listrik darurat sementara demi keselamatan petugas lapangan.',
        completed: false,
      },
    ],
  },
  kebakaran: {
    title: 'Kesiapsiagaan Bahaya Kebakaran Pemukiman Padat',
    iconName: 'Flame',
    badge: 'Mitigasi Kebakaran Urban',
    colorTheme: 'rose',
    evacuationSpot: 'Pos Damkar Sub-Sektor & Pelataran Lapangan Utama',
    doaKeselamatan: 'اللهُ أَكْبَرُ، اللهُ أَكْبَرُ (Bertakbir saat melihat api kebakaran untuk memadamkan amarahnya sesuai sunnah).',
    items: [
      {
        id: 'fr-01',
        task: 'Sediakan Alat Pemadam Api Ringan (APAR) atau Karung Goni Basah',
        category: 'mitigasi-rumah',
        priority: 'Kritis',
        description: 'Simpan APAR jenis dry chemical powder di dekat dapur dan periksa masa kadaluarsa jarum tekanan.',
        completed: true,
      },
      {
        id: 'fr-02',
        task: 'Hindari Penumpukan Colokan Stop Kontak (Overload Steker)',
        category: 'mitigasi-rumah',
        priority: 'Tinggi',
        description: 'Gunakan kabel berstandar SNI dan jangan menyambung lebih dari 2 steker bertumpuk.',
        completed: false,
      },
      {
        id: 'fr-03',
        task: 'Latih Anggota Keluarga Merayap Rendah di Bawah Asap (Stay Low Under Smoke)',
        category: 'keluarga-rentan',
        priority: 'Kritis',
        description: 'Udara bersih dan oksigen berada di ketinggian 30 cm dari permukaan lantai saat asap tebal.',
        completed: false,
      },
      {
        id: 'fr-04',
        task: 'Pastikan Kunci Pintu & Tralis Jendela Mudah Dijangkau Tanpa Mencari Lama',
        category: 'mitigasi-rumah',
        priority: 'Kritis',
        description: 'Seringkali korban terjebak karena tralis terkunci gembok di tengah kegelapan dan kepanikan.',
        completed: false,
      },
    ],
  },
};

export const DisasterPreparednessGuide: React.FC<DisasterPreparednessGuideProps> = ({
  activeDistrict = 'Kawasan Barat',
  activeDisasterPoint,
  onTriggerEmergencyAlert,
}) => {
  // Determine appropriate disaster alert type based on active point or district
  const initialCategory: DisasterAlertCategory = React.useMemo(() => {
    if (activeDisasterPoint) {
      if (activeDisasterPoint.type.toLowerCase().includes('banjir') || activeDisasterPoint.type.toLowerCase().includes('tanggul')) {
        return 'banjir';
      }
      if (activeDisasterPoint.type.toLowerCase().includes('gempa')) {
        return 'gempa';
      }
    }
    if (activeDistrict === 'Kawasan Barat' || activeDistrict === 'Kawasan Timur') {
      return 'banjir';
    }
    if (activeDistrict === 'Pusat Kota') {
      return 'cuaca-ekstrem';
    }
    return 'banjir';
  }, [activeDisasterPoint, activeDistrict]);

  const [selectedCategory, setSelectedCategory] = useState<DisasterAlertCategory>(initialCategory);
  const [checklists, setChecklists] = useState(DEFAULT_CHECKLISTS);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'semua' | 'tas-siaga' | 'mitigasi-rumah' | 'keluarga-rentan' | 'komunikasi'>('semua');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-switch category when activeDisasterPoint changes
  useEffect(() => {
    if (activeDisasterPoint) {
      if (activeDisasterPoint.type.toLowerCase().includes('banjir') || activeDisasterPoint.type.toLowerCase().includes('tanggul')) {
        setSelectedCategory('banjir');
      } else if (activeDisasterPoint.type.toLowerCase().includes('gempa')) {
        setSelectedCategory('gempa');
      }
    }
  }, [activeDisasterPoint]);

  const currentGuide = checklists[selectedCategory];
  const items = currentGuide.items;

  const filteredItems = items.filter((item) => {
    if (selectedCategoryFilter === 'semua') return true;
    return item.category === selectedCategoryFilter;
  });

  const totalItems = items.length;
  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / totalItems) * 100);

  const toggleItem = (itemId: string) => {
    sound.playPeacefulChime();
    setChecklists((prev) => {
      const catData = prev[selectedCategory];
      const updatedItems = catData.items.map((it) =>
        it.id === itemId ? { ...it, completed: !it.completed } : it
      );
      return {
        ...prev,
        [selectedCategory]: {
          ...catData,
          items: updatedItems,
        },
      };
    });
  };

  const handleShareChecklist = () => {
    sound.playAlertTone();
    const shareText = `*PANDUAN KESIAPSIAGAAN KELUARGA FITCITY*\nWilayah: ${activeDistrict}\nJenis Bencana: ${currentGuide.title}\nStatus: ${currentGuide.badge}\nProgres Kesiapan: ${completedCount}/${totalItems} (${progressPercent}%)\nTitik Evakuasi Aman: ${currentGuide.evacuationSpot}\n\nMari lengkapi persiapan tas siaga bencana bersama keluarga!`;
    navigator.clipboard?.writeText(shareText);
    setToastMessage('Ringkasan checklist kesiapsiagaan berhasil disalin ke clipboard untuk dibagikan ke WhatsApp keluarga!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleEmergencyCall = (number: string, name: string) => {
    sound.playAlertTone();
    setToastMessage(`Menghubungi Panggilan Darurat ${name} (${number}). Tetap tenang dan sebutkan lokasi distrik Anda.`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Header section with context alert notification */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Panduan Kesiapsiagaan Keluarga Berbasis Konteks Bencana (Preparedness Guide)</span>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                  Adaptif Wilayah
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Daftar periksa (checklist) taktis untuk melindungi keluarga dan anggota rentan sesuai jenis peringatan dini di distrik Anda
              </p>
            </div>
          </div>
        </div>

        {/* Quick Disaster Type Selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setSelectedCategory('banjir')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedCategory === 'banjir'
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Banjir / Tanggul</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('gempa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedCategory === 'gempa'
                ? 'bg-amber-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Gempa Bumi</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('cuaca-ekstrem')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedCategory === 'cuaca-ekstrem'
                ? 'bg-teal-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Cuaca Badai</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('kebakaran')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedCategory === 'kebakaran'
                ? 'bg-rose-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Kebakaran</span>
          </button>
        </div>
      </div>

      {/* Active Context Banner for the Selected District */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 dark:border-amber-800/60 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {currentGuide.title} ({activeDistrict})
              </span>
              <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                {currentGuide.badge}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleShareChecklist}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Bagikan panduan ke WhatsApp keluarga"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bagikan ke Keluarga</span>
            </button>
          </div>
        </div>

        {/* Evacuation Spot & Spiritual Prayer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Titik Kumpul / Posko Evakuasi Resmi Terdekat:</span>
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              {currentGuide.evacuationSpot}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Doa Perlindungan Nabawi dalam Situasi Bahaya:</span>
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 italic">
              "{currentGuide.doaKeselamatan}"
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar for Family Preparedness */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Kesiapan Tanggap Darurat Keluarga:</span>
          </span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
            {completedCount} dari {totalItems} Langkah Selesai ({progressPercent}%)
          </span>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
          <span>{progressPercent >= 100 ? '✅ Keluarga Anda Telah Sangat Siap!' : 'Lengkapi checklist di bawah untuk meminimalkan risiko bahaya.'}</span>
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            {progressPercent >= 80 ? 'Kategori Siaga Prima' : 'Perlu Dilengkapi Segera'}
          </span>
        </div>
      </div>

      {/* Checklist Category Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Langkah-Langkah Mitigasi & Protokol Tindakan:
          </span>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
            {[
              { id: 'semua', label: 'Semua' },
              { id: 'tas-siaga', label: 'Tas Siaga' },
              { id: 'mitigasi-rumah', label: 'Mitigasi Rumah' },
              { id: 'keluarga-rentan', label: 'Lansia & Anak' },
              { id: 'komunikasi', label: 'Komunikasi' },
            ].map((fl) => (
              <button
                key={fl.id}
                type="button"
                onClick={() => setSelectedCategoryFilter(fl.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedCategoryFilter === fl.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {fl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Checklist Items List */}
        <div className="space-y-2.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                item.completed
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-emerald-600 focus:outline-none shrink-0"
              >
                {item.completed ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={`text-xs font-bold ${
                      item.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {item.task}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.priority === 'Kritis'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                          : item.priority === 'Tinggi'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.priority}
                    </span>

                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {item.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Hotlines Bar */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Pusat Panggilan Darurat Kota Bebas Pulsa (Emergency Call Center 24 Jam):
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Siap Respon Reaksi Cepat</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { name: 'Panggilan Darurat Terpadu', number: '112', color: 'text-rose-600', icon: '🚨' },
            { name: 'Ambulans & Medis Cepat', number: '119', color: 'text-emerald-600', icon: '🚑' },
            { name: 'Pemadam Kebakaran', number: '113', color: 'text-amber-600', icon: '🚒' },
            { name: 'SAR & Evakuasi Banjir', number: '115', color: 'text-blue-600', icon: '🛶' },
          ].map((hl) => (
            <button
              key={hl.number}
              type="button"
              onClick={() => handleEmergencyCall(hl.number, hl.name)}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left transition-all cursor-pointer flex items-center justify-between shadow-xs"
            >
              <div>
                <span className="text-[10px] text-slate-400 block truncate">{hl.name}</span>
                <span className={`text-sm font-black ${hl.color}`}>{hl.number}</span>
              </div>
              <span className="text-base">{hl.icon}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
