import { 
  TransportRoute, 
  PublicServiceItem, 
  IoTSensorData, 
  BudgetItem, 
  CitizenComplaint, 
  SocialAidPoint, 
  DisasterWarningPoint, 
  FamilyMemberFitness, 
  PrayerTimeData, 
  WorshipChecklistItem, 
  SpiritualJournalEntry, 
  CommunityPost, 
  BekamResearchPaper, 
  ThibbunNabawiItem, 
  PushNotificationItem 
} from '../types';

export const INITIAL_ROUTES: TransportRoute[] = [
  {
    id: 'tr-01',
    name: 'TransFIT Koridor 1 (Pusat Madani - Stasiun Terpadu)',
    type: 'bus-listrik',
    route: 'Masjid Agung - Balai Kota - Pasar Induk - Stasiun Sentral',
    nextArrivalMinutes: 3,
    occupancyPercent: 42,
    isWheelchairAccessible: true,
    co2SavedKgPerTrip: 85.4,
    stopsCount: 14,
    status: 'Tepat Waktu'
  },
  {
    id: 'tr-02',
    name: 'LRT Eco-Line Hijau (Distrik Timur - Kawasan Kesehatan)',
    type: 'lrt',
    route: 'Kavling Hijau Timur - Islamic Center - RSUD Syariah - Stasiun Sentral',
    nextArrivalMinutes: 6,
    occupancyPercent: 68,
    isWheelchairAccessible: true,
    co2SavedKgPerTrip: 210.0,
    stopsCount: 9,
    status: 'Optimal'
  },
  {
    id: 'tr-03',
    name: 'Microfeeder Ramah Disabilitas 04',
    type: 'feeder-listrik',
    route: 'Komplek Permukiman Melati - Halte Koridor 1 - Puskesmas Ramah Anak',
    nextArrivalMinutes: 8,
    occupancyPercent: 30,
    isWheelchairAccessible: true,
    co2SavedKgPerTrip: 32.5,
    stopsCount: 7,
    status: 'Tepat Waktu'
  },
  {
    id: 'tr-04',
    name: 'TransFIT Koridor 2 (Kawasan Industri Hijau - Kampus)',
    type: 'bus-listrik',
    route: 'Taman Sains - Kampus Islam Terpadu - Eco Park Selatan',
    nextArrivalMinutes: 12,
    occupancyPercent: 55,
    isWheelchairAccessible: true,
    co2SavedKgPerTrip: 98.2,
    stopsCount: 16,
    status: 'Sedikit Terlambat'
  }
];

export const PUBLIC_SERVICES: PublicServiceItem[] = [
  {
    id: 'ps-01',
    title: 'Ambulans Siaga Cepat & Medis Keliling',
    category: 'Darurat',
    description: 'Panggilan darurat ambulans berbasis GPS dengan estimasi tiba di bawah 8 menit dilengkapi tabung oksigen & paramedis bersertifikat.',
    processingTime: '< 8 Menit Respon Lapangan',
    iconName: 'Ambulance',
    isOnline: true
  },
  {
    id: 'ps-02',
    title: 'Pendaftaran Puskesmas & Konsultasi Sehat',
    category: 'Kesehatan',
    description: 'Antrean online tanpa loket manual, riwayat rekam medis terpadu, dan rujukan cepat ke spesialis & pusat bekam syariah.',
    processingTime: 'Instan 24/7',
    iconName: 'HeartPulse',
    isOnline: true
  },
  {
    id: 'ps-03',
    title: 'KTP-el Digital & Administrasi Kependudukan',
    category: 'Kependudukan',
    description: 'Penerbitan akta lahir, kartu keluarga, dan surat pindah domisili langsung ditandatangani secara digital dengan verifikasi biometrik.',
    processingTime: '1 x 24 Jam Kerja',
    iconName: 'FileCheck',
    isOnline: true
  },
  {
    id: 'ps-04',
    title: 'Verifikasi Bantuan Sosial Terintegrasi (DTKS)',
    category: 'Sosial',
    description: 'Pengecekan status kepesertaan Program Keluarga Harapan, sembako berkah, dan santunan yatim/dhuafa berbasis NIK transparan.',
    processingTime: 'Pencarian Real-Time',
    iconName: 'Users',
    isOnline: true
  },
  {
    id: 'ps-05',
    title: 'Perizinan Bangunan Hijau & SPKLU Mandiri',
    category: 'Perizinan',
    description: 'Fasilitas izin pemasangan panel surya atap, pengisian kendaraan listrik rumahan, dan sertifikasi ramah lingkungan nol emisi.',
    processingTime: '2 x 24 Jam',
    iconName: 'Leaf',
    isOnline: true
  }
];

export const IOT_SENSORS: IoTSensorData[] = [
  {
    id: 'iot-01',
    name: 'Stasiun Sensor Madani Pusat (Masjid Agung)',
    district: 'Pusat Kota',
    aqi: 38,
    pm25: 9.2,
    temperature: 28.4,
    humidity: 68,
    carbonOffsetTonsThisMonth: 124.5,
    solarEnergyGeneratedKwh: 3420,
    status: 'Baik',
    lastUpdated: 'Baru saja'
  },
  {
    id: 'iot-02',
    name: 'Stasiun Koridor Industri Timur',
    district: 'Kawasan Timur',
    aqi: 54,
    pm25: 14.1,
    temperature: 30.1,
    humidity: 62,
    carbonOffsetTonsThisMonth: 89.2,
    solarEnergyGeneratedKwh: 2150,
    status: 'Sedang',
    lastUpdated: '1 menit lalu'
  },
  {
    id: 'iot-03',
    name: 'Sensor Eco-Park & RTH Selatan',
    district: 'Kawasan Selatan',
    aqi: 24,
    pm25: 5.8,
    temperature: 27.2,
    humidity: 74,
    carbonOffsetTonsThisMonth: 178.6,
    solarEnergyGeneratedKwh: 4890,
    status: 'Baik',
    lastUpdated: '3 menit lalu'
  },
  {
    id: 'iot-04',
    name: 'Sensor Penyangga Aliran Sungai Barat',
    district: 'Kawasan Barat',
    aqi: 45,
    pm25: 11.0,
    temperature: 29.0,
    humidity: 70,
    carbonOffsetTonsThisMonth: 102.4,
    solarEnergyGeneratedKwh: 2840,
    status: 'Baik',
    lastUpdated: '2 menit lalu'
  }
];

export const BUDGET_ITEMS: BudgetItem[] = [
  {
    id: 'bdg-01',
    programName: 'Pengadaan 120 Armada Bus Listrik TransFIT & Pembangunan Halte Ramah Difabel',
    sector: 'Infrastruktur & Transportasi Hijau',
    allocatedAmount: 185000000000,
    realizedAmount: 148000000000,
    progressPercent: 80.0,
    responsibleAgency: 'Dinas Perhubungan & Badan Pengelola Transportasi',
    contractor: 'Konsorsium Transportasi Listrik Nusantara',
    district: 'Seluruh Wilayah Kota',
    status: 'Berjalan Sesuai Jadwal',
    auditScore: 98,
    recentMilestone: '96 bus listrik telah beroperasi reguler dan 24 SPKLU super cepat terpasang di 6 depo.'
  },
  {
    id: 'bdg-02',
    programName: 'Digitalisasi Pemantauan Banjir IoT, Pompa Otomatis & Normalisasi Saluran Terpadu',
    sector: 'Kebersihan & Lingkungan',
    allocatedAmount: 94000000000,
    realizedAmount: 78960000000,
    progressPercent: 84.0,
    responsibleAgency: 'Dinas Sumber Daya Air & Pengendalian Banjir',
    contractor: 'PT Rekayasa Sipil Hidro Mandiri',
    district: 'Wilayah Rawan Aliran Sungai Barat & Timur',
    status: 'Tahap Akhir',
    auditScore: 95,
    recentMilestone: 'Instalasi 42 sensor ketinggian air berbasis LoRaWAN dan 8 pompa submersible otomatis.'
  },
  {
    id: 'bdg-03',
    programName: 'Penyaluran Bantuan Sembako Berkah & Intervensi Gizi Stunting Keluarga Dhuafa',
    sector: 'Bantuan Sosial & Gizi',
    allocatedAmount: 62000000000,
    realizedAmount: 55800000000,
    progressPercent: 90.0,
    responsibleAgency: 'Dinas Sosial & Tim Penggerak Kesejahteraan Keluarga',
    contractor: 'Koperasi Pangan Berkah Berkelanjutan',
    district: '34 Kelurahan Prioritas',
    status: 'Audit Publik',
    auditScore: 99,
    recentMilestone: 'Distribusi pangan bernutrisi ke 28.400 KK penerima manfaat tercatat dengan QR code tanpa kebocoran.'
  },
  {
    id: 'bdg-04',
    programName: 'Revitalisasi Puskesmas Ramah Lansia & Penyediaan Fasilitas Bekam Medis Standar Dinkes',
    sector: 'Kesehatan & Puskesmas',
    allocatedAmount: 48000000000,
    realizedAmount: 36000000000,
    progressPercent: 75.0,
    responsibleAgency: 'Dinas Kesehatan Kota & Asosiasi Pengobat Tradisional',
    contractor: 'PT Fasilitas Medika Insani',
    district: 'Seluruh Distrik Kota',
    status: 'Berjalan Sesuai Jadwal',
    auditScore: 96,
    recentMilestone: '12 Puskesmas telah memiliki ruang tindakan bekam steril bertekanan positif terakreditasi.'
  },
  {
    id: 'bdg-05',
    programName: 'Penerangan Jalan Umum Cerdas Tenaga Surya (Smart Solar Lighting) 3.500 Titik',
    sector: 'Infrastruktur & Transportasi Hijau',
    allocatedAmount: 38500000000,
    realizedAmount: 38500000000,
    progressPercent: 100.0,
    responsibleAgency: 'Dinas Bina Marga & Tata Ruang',
    contractor: 'PT Energi Surya Madani',
    district: 'Pinggiran Kota & Gang Pemukiman Warga',
    status: 'Selesai 100%',
    auditScore: 100,
    recentMilestone: 'Penerangan 100% selesai beroperasi menghemat biaya listrik daerah Rp 4,2 Miliar per tahun.'
  }
];

export const INITIAL_COMPLAINTS: CitizenComplaint[] = [
  {
    id: 'LAPOR-2026-081',
    title: 'Tumpukan Sampah Menghalangi Trotoar Depan Pasar Madani',
    description: 'Sampah sisa sayur dan plastik menumpuk sejak kemarin malam akibat jadwal truk terlambat. Mengganggu pejalan kaki yang menuju halte bus listrik.',
    district: 'Pusat Kota',
    locationDetail: 'Jl. Pemuda No. 45 depan Gate 2 Pasar Madani',
    category: 'Kebersihan & Sampah',
    urgency: 'Tinggi',
    severityScore: 4,
    assignedDepartment: 'Dinas Lingkungan Hidup',
    status: 'dalam_pengerjaan',
    createdAt: '29 Sept 2026, 06:15 WIB',
    updatedAt: '29 Sept 2026, 07:10 WIB',
    estimatedSLA: '6 Jam',
    recommendedAction: 'Dinas Lingkungan Hidup mengerahkan armada compactor 6 ton beserta 4 petugas sapu kebersihan.',
    citizenNotice: 'Petugas kebersihan telah berada di lokasi untuk pengangkutan dan penyemprotan disinfektan ramah lingkungan.',
    reporterName: 'Fahri Hidayat',
    upvotesCount: 38
  },
  {
    id: 'LAPOR-2026-079',
    title: 'Lubang Aspal Sedalam 15 cm Membahayakan Pengendara Sepeda & Motor',
    description: 'Terdapat lubang berdiameter 60 cm pasca hujan lebat di dekat perempatan lampu merah. Sangat berisiko bagi warga yang beraktivitas subuh.',
    district: 'Kawasan Timur',
    locationDetail: 'Jl. Merpati Putih KM 3.2 dekat Masjid Al-Falah',
    category: 'Infrastruktur Jalan',
    urgency: 'Tinggi',
    severityScore: 5,
    assignedDepartment: 'Dinas Bina Marga & Tata Ruang',
    status: 'petugas_diterjunkan',
    createdAt: '28 Sept 2026, 21:30 WIB',
    updatedAt: '29 Sept 2026, 06:45 WIB',
    estimatedSLA: '12 Jam',
    recommendedAction: 'Tim URC Reaksi Cepat Bina Marga membawa cold-mix asphalt dan mesin pemadat stamper plate.',
    citizenNotice: 'Rambu peringatan dan barrier telah dipasang petugas. Penambalan aspal permanen sedang berlangsung.',
    reporterName: 'Aisyah Wardani',
    upvotesCount: 52
  },
  {
    id: 'LAPOR-2026-074',
    title: 'Lampu Penerangan Jalan Umum Tenaga Surya Padam di Gang Masjid',
    description: 'Satu tiang lampu surya baterainya tidak mengisi daya sehingga gelap saat jamaah hendak shalat Isya dan Subuh.',
    district: 'Kawasan Selatan',
    locationDetail: 'Gang Barokah RT 03/RW 05 Kelurahan Harmoni',
    category: 'Penerangan Jalan',
    urgency: 'Sedang',
    severityScore: 2,
    assignedDepartment: 'Dinas Perhubungan',
    status: 'selesai_terverifikasi',
    createdAt: '27 Sept 2026, 19:10 WIB',
    updatedAt: '28 Sept 2026, 11:20 WIB',
    estimatedSLA: '24 Jam',
    recommendedAction: 'Penggantian modul inverter fotovoltaik dan baterai LiFePO4 baru bergaransi.',
    citizenNotice: 'Perbaikan selesai 100%. Lampu telah menyala otomatis dengan sensor lux fotometrik normal.',
    reporterName: 'Bambang Sudiro',
    upvotesCount: 24
  }
];

export const SOCIAL_AID_POINTS: SocialAidPoint[] = [
  {
    id: 'aid-01',
    name: 'Sentra Distribusi Beras & Minyak Berkah Pusat',
    category: 'Bansos Sembako',
    district: 'Pusat Kota',
    address: 'Komplek Islamic Center, Aula Shalahuddin Al-Ayyubi Lt. 1',
    latitude: -6.2088,
    longitude: 106.8456,
    stockStatus: 'Tersedia Banyak',
    quotaRemaining: 1420,
    totalQuota: 2000,
    operationalHours: '08:00 - 16:30 WIB',
    contactPerson: 'Ustadz Ridwan (0812-3456-7890)'
  },
  {
    id: 'aid-02',
    name: 'Pos Gizi Anak Stunting & Makanan Tambahan Ibu Hamil',
    category: 'Gizi Balita & Ibu Hamil',
    district: 'Kawasan Timur',
    address: 'Gedung Kesejahteraan Warga RW 08, Jl. Kenanga Asri',
    latitude: -6.2250,
    longitude: 106.8820,
    stockStatus: 'Tersedia Banyak',
    quotaRemaining: 850,
    totalQuota: 1000,
    operationalHours: '08:30 - 15:00 WIB',
    contactPerson: 'Ibu Dr. Nurul Hasanah (0813-9876-5432)'
  },
  {
    id: 'aid-03',
    name: 'Lumbung Pangan & Santunan Dhuafa Lansia Sejahtera',
    category: 'Santunan Dhuafa & Lansia',
    district: 'Kawasan Selatan',
    address: 'Jl. Rukun Damai No. 12, Kelurahan Cempaka Hijau',
    latitude: -6.2610,
    longitude: 106.8200,
    stockStatus: 'Terbatas',
    quotaRemaining: 310,
    totalQuota: 800,
    operationalHours: '09:00 - 14:00 WIB',
    contactPerson: 'Pak Syamsul Arifin (0811-2233-4455)'
  },
  {
    id: 'aid-04',
    name: 'Depo Logistik Tanggap Bencana & Dapur Mandiri Halal',
    category: 'Posko Siaga Bencana',
    district: 'Kawasan Barat',
    address: 'Pangkalan Siaga BPBD Sektor Aliran Sungai, Jl. Tanggul Asri',
    latitude: -6.1850,
    longitude: 106.7780,
    stockStatus: 'Tersedia Banyak',
    quotaRemaining: 3500,
    totalQuota: 5000,
    operationalHours: 'Siaga 24 Jam Nonstop',
    contactPerson: 'Kapten Hendra BPBD (0821-4455-6677)'
  }
];

export const DISASTER_POINTS: DisasterWarningPoint[] = [
  {
    id: 'dis-01',
    title: 'Sensor IoT Tanggul Sungai Barat',
    type: 'Sensor Tanggul IoT',
    district: 'Kawasan Barat',
    waterLevelCm: 145,
    status: 'Waspada',
    latitude: -6.1890,
    longitude: 106.7720,
    affectedHouseholds: 240,
    pumpsActive: 3,
    actionRequired: 'Pintu air nomor 2 dibuka 35 cm untuk mengalirkan ke waduk retensi kota.'
  },
  {
    id: 'dis-02',
    title: 'Titik Rawan Genangan Cepat Surut Simpang Melati',
    type: 'Genangan Banjir',
    district: 'Kawasan Timur',
    waterLevelCm: 25,
    status: 'Normal',
    latitude: -6.2310,
    longitude: 106.8790,
    affectedHouseholds: 45,
    pumpsActive: 1,
    actionRequired: 'Pembersihan saringan sampah otomatis di mulut gorong-gorong induk.'
  },
  {
    id: 'dis-03',
    title: 'Jalur Evakuasi Utama & Posko Pengungsian Masjid Raya',
    type: 'Jalur Evakuasi Aman',
    district: 'Pusat Kota',
    waterLevelCm: 0,
    status: 'Normal',
    latitude: -6.2050,
    longitude: 106.8410,
    affectedHouseholds: 0,
    pumpsActive: 0,
    actionRequired: 'Jalur bebas hambatan, tanda petunjuk evakuasi glow-in-the-dark aktif.'
  }
];

export const INITIAL_FAMILY_FITNESS: FamilyMemberFitness[] = [
  {
    id: 'fam-01',
    name: 'Ahmad Faiz (Anda)',
    relation: 'Ayah',
    dailySteps: 9450,
    targetSteps: 10000,
    activeMinutes: 52,
    waterLiters: 2.8,
    sleepHours: 7.2,
    streakDays: 14,
    smartGoal: {
      enabled: true,
      scheduleIntensity: 'normal',
      historicalBaselineSteps: 9000,
      adaptiveTargetSteps: 10000,
      targetActiveMinutes: 50,
      recommendedTimeWindow: '05:30 - 06:45 WIB (Setelah Subuh)',
      reason: 'Target disesuaikan +1.000 langkah karena streak 14 hari konsisten dan jadwal kerja standar.'
    }
  },
  {
    id: 'fam-02',
    name: 'Siti Aminah',
    relation: 'Ibu',
    dailySteps: 8200,
    targetSteps: 8000,
    activeMinutes: 44,
    waterLiters: 2.4,
    sleepHours: 7.0,
    streakDays: 11,
    smartGoal: {
      enabled: true,
      scheduleIntensity: 'padat',
      historicalBaselineSteps: 7500,
      adaptiveTargetSteps: 8000,
      targetActiveMinutes: 40,
      recommendedTimeWindow: '06:00 - 06:45 WIB & 16:30 - 17:15 WIB',
      reason: 'Disesuaikan dengan agenda padat keluarga; target dipecah menjadi 2 sesi jalan kaki ringan.'
    }
  },
  {
    id: 'fam-03',
    name: 'Rayhan (12 thn)',
    relation: 'Anak Pertama',
    dailySteps: 11300,
    targetSteps: 11000,
    activeMinutes: 70,
    waterLiters: 2.2,
    sleepHours: 8.5,
    streakDays: 18,
    smartGoal: {
      enabled: true,
      scheduleIntensity: 'akhir-pekan',
      historicalBaselineSteps: 9500,
      adaptiveTargetSteps: 11000,
      targetActiveMinutes: 65,
      recommendedTimeWindow: '16:00 - 17:30 WIB',
      reason: 'Performa historis konsisten melampaui 11.000 langkah; target optimal untuk stamina masa pertumbuhan.'
    }
  },
  {
    id: 'fam-04',
    name: 'Hana (8 thn)',
    relation: 'Anak Kedua',
    dailySteps: 7800,
    targetSteps: 7500,
    activeMinutes: 45,
    waterLiters: 1.8,
    sleepHours: 9.0,
    streakDays: 9,
    smartGoal: {
      enabled: true,
      scheduleIntensity: 'normal',
      historicalBaselineSteps: 6800,
      adaptiveTargetSteps: 7500,
      targetActiveMinutes: 45,
      recommendedTimeWindow: '15:45 - 16:45 WIB',
      reason: 'Aktivitas bermain aktif luar ruangan di taman pemukiman ramah anak.'
    }
  },
  {
    id: 'fam-05',
    name: 'Kakek Mansyur (68 thn)',
    relation: 'Kakek',
    dailySteps: 4900,
    targetSteps: 5000,
    activeMinutes: 30,
    waterLiters: 2.0,
    sleepHours: 6.8,
    streakDays: 22,
    smartGoal: {
      enabled: true,
      scheduleIntensity: 'pemulihan',
      historicalBaselineSteps: 4500,
      adaptiveTargetSteps: 5000,
      targetActiveMinutes: 30,
      recommendedTimeWindow: '05:45 - 06:30 WIB (Sinar Matahari Pagi)',
      reason: 'Fokus mobilitas rendah benturan pasca Subuh untuk kelenturan sendi lutut dan vitamin D alami.'
    }
  }
];

export const PRAYER_TIMES: PrayerTimeData[] = [
  { name: 'Subuh', time: '04:32', isNext: false, notificationEnabled: true, sunnahTarget: '2 Rakaat Qabliyah Subuh' },
  { name: 'Syuruq', time: '05:48', isNext: false, notificationEnabled: false, sunnahTarget: 'Dzikir Pagi hingga Terbit' },
  { name: 'Dzuhur', time: '11:54', isNext: false, notificationEnabled: true, sunnahTarget: '4 Rakaat Qabliyah & 2 Ba\'diyah' },
  { name: 'Ashar', time: '15:08', isNext: true, notificationEnabled: true, sunnahTarget: '4 Rakaat Sunnah Ghairu Muakkad' },
  { name: 'Maghrib', time: '17:58', isNext: false, notificationEnabled: true, sunnahTarget: '2 Rakaat Ba\'diyah Maghrib' },
  { name: 'Isya', time: '19:07', isNext: false, notificationEnabled: true, sunnahTarget: '2 Rakaat Ba\'diyah & Witir' }
];

export const INITIAL_WORSHIP_CHECKLIST: WorshipChecklistItem[] = [
  { id: 'w-01', name: 'Shalat Subuh Berjamaah di Masjid', category: 'Wajib', target: 'Tepat Waktu', completed: true, points: 25 },
  { id: 'w-02', name: 'Shalat Sunnah Qabliyah Subuh (Khairun minad dunya)', category: 'Sunnah Muakkad', target: '2 Rakaat', completed: true, points: 20 },
  { id: 'w-03', name: 'Dzikir Al-Ma\'tsurat Pagi Hari', category: 'Al-Qur\'an & Dzikir', target: 'Selesai', completed: true, points: 15 },
  { id: 'w-04', name: 'Tilawah Al-Qur\'an 1 Juz', category: 'Al-Qur\'an & Dzikir', target: 'Halaman 182-201', completed: true, points: 30 },
  { id: 'w-05', name: 'Shalat Dhuha', category: 'Sunnah Muakkad', target: '4 Rakaat', completed: true, points: 15 },
  { id: 'w-06', name: 'Shalat Dzuhur Berjamaah & Rawatib', category: 'Wajib', target: 'Tepat Waktu', completed: true, points: 25 },
  { id: 'w-07', name: 'Sedekah Subuh / Infaq Melalui QRIS Masjid', category: 'Amal Sosial', target: 'Ikhlas', completed: true, points: 20 },
  { id: 'w-08', name: 'Shalat Ashar Berjamaah', category: 'Wajib', target: 'Di Masjid', completed: false, points: 25 },
  { id: 'w-09', name: 'Dzikir Petang & Doa Perlindungan', category: 'Al-Qur\'an & Dzikir', target: 'Menjelang Maghrib', completed: false, points: 15 },
  { id: 'w-10', name: 'Shalat Maghrib & Isya Berjamaah', category: 'Wajib', target: 'Tepat Waktu', completed: false, points: 25 },
  { id: 'w-11', name: 'Qiyamul Lail (Tahajjud & Witir)', category: 'Sunnah Muakkad', target: 'Minimal 3 Rakaat', completed: false, points: 30 }
];

export const INITIAL_JOURNAL_ENTRIES: SpiritualJournalEntry[] = [
  {
    id: 'jrn-01',
    date: '29 September 2026',
    timestamp: '05:20 WIB',
    gratitudeList: [
      'Alhamdulillah diberi nikmat nafas dan kesehatan sendi untuk melangkah ke masjid saat subuh.',
      'Dapat mendampingi anak-anak jalan pagi 3 km sebelum sekolah.',
      'Pikiran tenang setelah membaca Al-Kahfi dan berdzikir pagi.'
    ],
    reflections: 'Motto "FIT Mahkota Jihad dijalan Allah untuk menjaga kebugaran jasmani agar lebih semangat dalam beribadah" terasa begitu nyata. Ketika tubuh bugar, ruku dan sujud terasa lebih lama dan nikmat, tidak ada keluhan pegal di pinggang. Niatkan menjaga otot dan jantung ini semata-mata sebagai sarana menyempurnakan ibadah kepada-Nya.',
    mood: 'Khusyuk & Tenang',
    quranProgress: 'Surah Ali \'Imran ayat 1-50',
    isPrivate: false
  },
  {
    id: 'jrn-02',
    date: '28 September 2026',
    timestamp: '21:15 WIB',
    gratitudeList: [
      'Bisa menuntaskan pekerjaan kantor tepat waktu tanpa meninggalkan shalat fardhu awal waktu.',
      'Keluarga kompak makan malam dengan menu sayur segar dan madu habbatussauda.',
      'Membantu tetangga lansia memverifikasi data bansos melalui aplikasi FITCity.'
    ],
    reflections: 'Muhasabah malam ini: harus lebih menjaga lisan dari pembicaraan yang kurang berfaedah. Semoga besok Allah mudahkan bangun 30 menit sebelum Subuh untuk shalat malam.',
    mood: 'Bersyukur Mendalam',
    quranProgress: 'Surah Al-Baqarah ayat 250-286',
    isPrivate: true
  }
];

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-01',
    author: 'Keluarga Bpk. Herman Basri',
    district: 'Kelurahan Harmoni Madani',
    avatarColor: 'bg-emerald-600',
    timeAgo: '25 menit lalu',
    category: 'Kebugaran Keluarga',
    content: 'Alhamdulillah pagi ini keluarga kami menyelesaikan jalan sehat subuh 5,2 km keliling taman kota. Anak-anak sangat gembira, stamina segar, dan siap beribadah serta belajar! Mari jaga kesehatan jasmani kita sebagai titipan Allah.',
    likesCount: 64,
    userLiked: true,
    commentsCount: 12,
    verifiedCitizen: true
  },
  {
    id: 'post-02',
    author: 'Ustadzah Maryam S.Pdi',
    district: 'Komplek Islamic Center',
    avatarColor: 'bg-teal-600',
    timeAgo: '1 jam lalu',
    category: 'Motivasi Ibadah',
    content: 'Rasulullah SAW bersabda: "Mukmin yang kuat lebih dicintai Allah daripada mukmin yang lemah, kendati pada keduanya ada kebaikan." Semangat untuk seluruh warga FITCity yang terus konsisten shalat berjamaah tepat waktu dan merutinkan sedekah subuh!',
    likesCount: 118,
    userLiked: false,
    commentsCount: 23,
    verifiedCitizen: true
  },
  {
    id: 'post-03',
    author: 'Komunitas Bekam Medik Berdaya',
    district: 'Pusat Kesehatan Thibbun Nabawi',
    avatarColor: 'bg-emerald-700',
    timeAgo: '2 jam lalu',
    category: 'Thibbun Nabawi',
    content: 'Mengingatkan kembali saudara seiman, tanggal 17 Rabiul Awwal bertepatan dengan tanggal sunnah bekam insya Allah 3 hari lagi. Pastikan terapis Anda menerapkan SOP steril, mangkok sekali pakai, dan higienitas prima sesuai pedoman World Bekam Islamicity.',
    likesCount: 92,
    userLiked: true,
    commentsCount: 17,
    verifiedCitizen: true
  }
];

export const BEKAM_RESEARCH_PAPERS: BekamResearchPaper[] = [
  {
    id: 'bkm-01',
    title: 'Biochemical and Hematological Changes Associated with Wet Cupping Therapy in Metabolic Syndrome',
    journal: 'International Journal of Health Sciences & Clinical Medicine',
    publicationYear: 2024,
    doi: '10.1016/j.jcm.2024.03.112',
    pmid: 'PMID: 38451209',
    category: 'Kardiovaskular & Hipertensi',
    evidenceLevel: 'Uji Klinis Acak (RCT)',
    keyFindings: 'Penurunan signifikan pada tekanan darah sistolik rata-rata 11.4 mmHg dan perbaikan profil resistensi insulin (HOMA-IR) pasca terapi bekam basah (hijama) berkala pada titik Al-Kahil.',
    biologicalMechanism: 'Pembersihan filtrat interstitial mikrokapiler, pelepasan nitric oxide (NO) endotelial yang memicu vasodilatasi pembuluh darah sistemik, serta penurunan resistensi vaskular perifer.'
  },
  {
    id: 'bkm-02',
    title: 'Modulation of Inflammatory Cytokines (IL-6, TNF-alpha, CRP) via Interstitial Vacuum Extraction',
    journal: 'Journal of Evidence-Based Complementary and Alternative Medicine (JEBCAM)',
    publicationYear: 2025,
    doi: '10.1177/21565872241289',
    pmid: 'PMID: 39120441',
    category: 'Imunologi & Inflamasi',
    evidenceLevel: 'Studi Meta-Analisis',
    keyFindings: 'Analisis terhadap 1.420 pasien menunjukkan penurunan substansial pada serum C-Reactive Protein (CRP) sebesar 32% dan sitokin pro-inflamasi TNF-alpha dalam 72 jam setelah hijama steril.',
    biologicalMechanism: 'Penarikan cairan interstitial yang mengandung mediator inflamasi lokal dan debris seluler tua melalui fenestrasi kapiler dermis dengan stimulasi imunitas bawaan (innate immunity).'
  },
  {
    id: 'bkm-03',
    title: 'Pain Relief and Endorphin Release Mechanism of Wet Cupping for Chronic Neck and Back Pain',
    journal: 'The Clinical Journal of Pain & Neuromuscular Rehabilitation',
    publicationYear: 2023,
    doi: '10.1097/AJP.0000000000001089',
    pmid: 'PMID: 37651004',
    category: 'Nyeri & Muskuloskeletal',
    evidenceLevel: 'Uji Klinis Acak (RCT)',
    keyFindings: 'Skor intensitas nyeri Visual Analog Scale (VAS) berkurang drastis dari 7.4 menjadi 2.1 pada kelompok bekam basah dibandingkan kelompok plasebo pada pekan ke-4.',
    biologicalMechanism: 'Mekanisme "Gate Control Theory": stimulasi mekanoreseptor A-beta menghambat transmisi nosiseptif serat C di medula spinalis, disertai lonjakan kadar beta-endorfin plasma.'
  },
  {
    id: 'bkm-04',
    title: 'Heavy Metal Excretion (Lead, Mercury, Cadmium) and Superoxide Dismutase Upregulation in Hijama',
    journal: 'Environmental Toxicology and Biomedical Research',
    publicationYear: 2025,
    doi: '10.1002/tox.24158',
    pmid: 'PMID: 39542018',
    category: 'Detoksifikasi & Antioksidan',
    evidenceLevel: 'Studi Biokimia',
    keyFindings: 'Kadar logam berat (Pb, Hg) dan ferritin terakumulasi pada darah hasil bekam jauh lebih pekat dibandingkan darah vena perifer, membuktikan peran filtrasi selektif limfatik.',
    biologicalMechanism: 'Pemberian rangsangan hisap negatif (negative pressure suction) mengekstraksi eritrosit tua yang rapuh serta menginduksi ekspresi enzim antioksidan Superoxide Dismutase (SOD) dan Glutathione Peroxidase.'
  }
];

export const THIBBUN_NABAWI_ITEMS: ThibbunNabawiItem[] = [
  {
    id: 'tn-01',
    name: 'Bekam Sunnah (Al-Hijama)',
    arabicName: 'الحجامة',
    description: 'Terapi pengeluaran cairan interstitial dan darah statis pada titik-titik meridian sunnah untuk melancarkan sirkulasi serta membuang toksin tubuh.',
    sunnahReference: 'Rasulullah SAW bersabda: "Sebaik-baik pengobatan yang kalian lakukan adalah berbekam." (HR. Bukhari no. 5696 & Muslim no. 1577)',
    modernScienceBenefit: 'Terbukti klinis merangsang vasodilatasi nitric oxide, meregulasi sistem imun, menurunkan tekanan darah perifer, dan memicu pelepasan endorfin anti-nyeri.',
    usageInstruction: 'Dilakukan oleh praktisi bersertifikat medis, menggunakan set mangkok steril sekali pakai, diutamakan tanggal 17, 19, atau 21 bulan Hijriah.',
    precaution: 'Hindari saat tubuh demam tinggi akut, penderita hemofilia berat, atau saat perut terlalu kenyang/sangat lapar.'
  },
  {
    id: 'tn-02',
    name: 'Madu Murni (Al-\'Asal)',
    arabicName: 'العسل',
    description: 'Cairan nektar alami kaya enzim diastase, polifenol antioksidan, dan senyawa antibakteri hidrogen peroksida alami.',
    sunnahReference: 'Allah berfirman: "...Dari perut lebah itu keluar minuman (madu) yang bermacam-macam warnanya, di dalamnya terdapat obat yang menyembuhkan bagi manusia." (QS. An-Nahl: 69)',
    modernScienceBenefit: 'Menghambat pertumbuhan bakteri patogen (H. pylori, S. aureus), mempercepat regenerasi mukosa lambung, serta memulihkan energi glikogen otot secara cepat.',
    usageInstruction: '1-2 sendok makan dilarutkan dalam air hangat suam-suam kuku di pagi hari sebelum sarapan.',
    precaution: 'Hindari pemberian pada bayi di bawah usia 1 tahun (risiko botulisme infantil).'
  },
  {
    id: 'tn-03',
    name: 'Jintan Hitam (Habbatussauda)',
    arabicName: 'الحبة السوداء',
    description: 'Biji Nigella Sativa yang kaya kandungan aktif Thymoquinone (TQ), asam linoleat esensial, dan flavonoid pelindung sel.',
    sunnahReference: 'Rasulullah SAW bersabda: "Sesungguhnya pada jintan hitam terdapat obat untuk segala macam penyakit, kecuali kematian." (HR. Bukhari no. 5688 & Muslim no. 2215)',
    modernScienceBenefit: 'Thymoquinone memiliki efek imunomodulator kuat, bronkodilator alami untuk asma, anti-inflamasi, dan penangkal stres oksidatif mitokondria.',
    usageInstruction: 'Kapsul minyak murni atau serbuk biji dengan dosis moderat 1-2 gram per hari bersama segelas air.',
    precaution: 'Ibu hamil trimester pertama dianjurkan berkonsultasi dengan dokter sebelum mengonsumsi dosis pekat.'
  },
  {
    id: 'tn-04',
    name: 'Minyak Zaitun Extra Virgin (Az-Zait)',
    arabicName: 'زيت الزيتون',
    description: 'Minyak perasan pertama buah zaitun dari pohon yang diberkahi, kaya asam lemak tak jenuh tunggal (MUFA) dan oleocanthal.',
    sunnahReference: 'Rasulullah SAW bersabda: "Makanlah buah zaitun dan berminyaklah dengannya, karena sesungguhnya ia berasal dari pohon yang diberkahi." (HR. Tirmidzi no. 1851)',
    modernScienceBenefit: 'Kandungan Oleocanthal bekerja mirip anti-inflamasi ibuprofen alami, menjaga elastisitas dinding arteri, dan menurunkan kolesterol jahat LDL teroksidasi.',
    usageInstruction: '1 sendok makan diminum langsung di pagi/malam hari atau dijadikan dressing salad sayuran segar.',
    precaution: 'Pilih perasan dingin (cold pressed) tanpa pemanasan kimiawi.'
  }
];

export const INITIAL_NOTIFICATIONS: PushNotificationItem[] = [
  {
    id: 'notif-01',
    title: 'Peringatan Dini Cuaca & Sensor Tanggul Barat',
    message: 'Sensor IoT Aliran Barat mendeteksi kenaikan debit air 15 cm. Pompa otomatis telah diaktifkan. Wilayah RW 03-05 tetap tenang dan waspada.',
    category: 'bencana',
    timestamp: '10 menit lalu',
    isRead: false,
    districtAffected: 'Kawasan Barat',
    actionUrlTab: 'map-aid-disaster'
  },
  {
    id: 'notif-02',
    title: 'Pembaruan Perbaikan: Jalan Berlubang Selesai Ditambal',
    message: 'Laporan perbaikan aspal di Jl. Merpati Putih telah selesai 100% oleh Tim URC Bina Marga. Arus lalu lintas kembali lancar.',
    category: 'perbaikan',
    timestamp: '35 menit lalu',
    isRead: false,
    districtAffected: 'Kawasan Timur',
    actionUrlTab: 'complaint-ai'
  },
  {
    id: 'notif-03',
    title: 'Pengingat Waktu Shalat Ashar',
    message: 'Waktu Shalat Ashar pukul 15:08 WIB. Segera persiapkan wudhu dan langkahkan kaki menuju masjid terdekat.',
    category: 'shalat',
    timestamp: '1 jam lalu',
    isRead: true,
    actionUrlTab: 'worship-journal'
  },
  {
    id: 'notif-04',
    title: 'Kebugaran Keluarga: Target Harian 80% Tercapai',
    message: 'Keluarga Anda telah mengumpulkan 41.650 langkah hari ini! Tinggal 8.350 langkah lagi untuk memecahkan rekor mingguan.',
    category: 'kebugaran',
    timestamp: '2 jam lalu',
    isRead: true,
    actionUrlTab: 'family-fitness'
  },
  {
    id: 'notif-05',
    title: 'Jadwal Distribusi Beras Berkah Kelurahan Harmoni',
    message: 'Distribusi beras bansos dibuka di Sentra Islamic Center mulai pukul 08:30 WIB besok. Cek kuota dan bawa barcode verifikasi Anda.',
    category: 'bansos',
    timestamp: '3 jam lalu',
    isRead: true,
    districtAffected: 'Pusat Kota',
    actionUrlTab: 'map-aid-disaster'
  }
];
