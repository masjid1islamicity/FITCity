export type AppTab = 
  | 'executive'
  | 'services-transport'
  | 'iot-carbon'
  | 'budget-transparency'
  | 'complaint-ai'
  | 'map-aid-disaster'
  | 'family-fitness'
  | 'worship-journal'
  | 'beauty-health-bekam';

export interface TransportRoute {
  id: string;
  name: string;
  type: 'bus-listrik' | 'lrt' | 'feeder-listrik' | 'sepeda-sewa';
  route: string;
  nextArrivalMinutes: number;
  occupancyPercent: number;
  isWheelchairAccessible: boolean;
  co2SavedKgPerTrip: number;
  stopsCount: number;
  status: 'Tepat Waktu' | 'Sedikit Terlambat' | 'Optimal';
}

export interface PublicServiceItem {
  id: string;
  title: string;
  category: 'Kesehatan' | 'Kependudukan' | 'Perizinan' | 'Sosial' | 'Darurat';
  description: string;
  processingTime: string;
  iconName: string;
  isOnline: boolean;
}

export interface IoTSensorData {
  id: string;
  name: string;
  district: string;
  aqi: number;
  pm25: number;
  temperature: number;
  humidity: number;
  carbonOffsetTonsThisMonth: number;
  solarEnergyGeneratedKwh: number;
  status: 'Baik' | 'Sedang' | 'Perlu Perhatian';
  lastUpdated: string;
}

export interface BudgetItem {
  id: string;
  programName: string;
  sector: 'Infrastruktur & Transportasi Hijau' | 'Bantuan Sosial & Gizi' | 'Kesehatan & Puskesmas' | 'Kebersihan & Lingkungan' | 'Pendidikan & Digital';
  allocatedAmount: number; // in IDR
  realizedAmount: number;
  progressPercent: number;
  responsibleAgency: string;
  contractor: string;
  district: string;
  status: 'Berjalan Sesuai Jadwal' | 'Tahap Akhir' | 'Selesai 100%' | 'Audit Publik';
  auditScore: number; // out of 100
  recentMilestone: string;
}

export interface CitizenComplaint {
  id: string;
  title: string;
  description: string;
  district: string;
  locationDetail: string;
  category: string;
  urgency: 'Tinggi' | 'Sedang' | 'Rendah';
  severityScore: number;
  assignedDepartment: string;
  status: 'diajukan' | 'terverifikasi_ai' | 'petugas_diterjunkan' | 'dalam_pengerjaan' | 'selesai_terverifikasi';
  createdAt: string;
  updatedAt: string;
  estimatedSLA: string;
  recommendedAction: string;
  citizenNotice: string;
  reporterName: string;
  upvotesCount: number;
  imageUrl?: string;
}

export interface SocialAidPoint {
  id: string;
  name: string;
  category: 'Bansos Sembako' | 'Gizi Balita & Ibu Hamil' | 'Santunan Dhuafa & Lansia' | 'Posko Siaga Bencana';
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  stockStatus: 'Tersedia Banyak' | 'Terbatas' | 'Hampir Habis';
  quotaRemaining: number;
  totalQuota: number;
  operationalHours: string;
  contactPerson: string;
}

export interface DisasterWarningPoint {
  id: string;
  title: string;
  type: 'Genangan Banjir' | 'Sensor Tanggul IoT' | 'Jalur Evakuasi Aman' | 'Posko Darurat & Dapur Halal';
  district: string;
  waterLevelCm: number;
  status: 'Normal' | 'Waspada' | 'Siaga' | 'Evakuasi Disarankan';
  latitude: number;
  longitude: number;
  affectedHouseholds: number;
  pumpsActive: number;
  actionRequired: string;
}

export type ScheduleIntensity = 'padat' | 'normal' | 'akhir-pekan' | 'pemulihan';

export interface SmartGoalConfig {
  enabled: boolean;
  scheduleIntensity: ScheduleIntensity;
  historicalBaselineSteps: number;
  adaptiveTargetSteps: number;
  targetActiveMinutes: number;
  recommendedTimeWindow: string;
  reason: string;
}

export interface FamilyChallenge {
  id: string;
  title: string;
  badge: string;
  description: string;
  targetMetric: string;
  progressPercent: number;
  currentValue: number;
  goalValue: number;
  deadline: string;
  participantsCount: number;
  rewardPoints: number;
  category: 'Langkah' | 'Ibadah & Stamina' | 'Hidrasi' | 'Keluarga';
}

export type WorkoutIntensityLevel = 'ringan' | 'sedang' | 'tinggi' | 'sangat_tinggi';

export interface DailyActivityPlan {
  activityName: string;
  intensity: WorkoutIntensityLevel;
  durationMinutes: number;
  estimatedCalories: number;
  bodyWeightKg: number;
  timeWindow?: string;
  notes?: string;
  scheduledAt?: string;
}

export interface FamilyMemberFitness {
  id: string;
  name: string;
  relation: 'Ayah' | 'Ibu' | 'Anak Pertama' | 'Anak Kedua' | 'Kakek' | string;
  dailySteps: number;
  targetSteps: number;
  activeMinutes: number;
  waterLiters: number;
  sleepHours: number;
  streakDays: number;
  smartGoal?: SmartGoalConfig;
  dailyActivity?: DailyActivityPlan;
  caloriesBurned?: number;
}

export interface PrayerTimeData {
  name: string;
  time: string;
  isNext: boolean;
  notificationEnabled: boolean;
  sunnahTarget?: string;
}

export interface WorshipChecklistItem {
  id: string;
  name: string;
  category: 'Wajib' | 'Sunnah Muakkad' | 'Al-Qur\'an & Dzikir' | 'Amal Sosial';
  target: string;
  completed: boolean;
  points: number;
}

export interface SpiritualJournalEntry {
  id: string;
  date: string;
  timestamp: string;
  gratitudeList: string[];
  reflections: string;
  mood: 'Khusyuk & Tenang' | 'Penuh Semangat' | 'Butuh Muhasabah' | 'Bersyukur Mendalam';
  quranProgress: string;
  isPrivate: boolean;
  isVoiceRecorded?: boolean;
}

export interface CommunityPost {
  id: string;
  author: string;
  district: string;
  avatarColor: string;
  timeAgo: string;
  category: 'Kebugaran Keluarga' | 'Motivasi Ibadah' | 'Gotong Royong Lingkungan' | 'Thibbun Nabawi';
  content: string;
  likesCount: number;
  userLiked?: boolean;
  commentsCount: number;
  verifiedCitizen: boolean;
}

export interface BekamResearchPaper {
  id: string;
  title: string;
  journal: string;
  publicationYear: number;
  doi: string;
  pmid?: string;
  keyFindings: string;
  biologicalMechanism: string;
  category: 'Kardiovaskular & Hipertensi' | 'Nyeri & Muskuloskeletal' | 'Imunologi & Inflamasi' | 'Detoksifikasi & Antioksidan';
  evidenceLevel: 'Uji Klinis Acak (RCT)' | 'Studi Meta-Analisis' | 'Studi Biokimia';
}

export interface ThibbunNabawiItem {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  sunnahReference: string;
  modernScienceBenefit: string;
  usageInstruction: string;
  precaution: string;
  imageUrl?: string;
}

export interface BekamAppointment {
  id: string;
  patientName: string;
  phone: string;
  serviceType: 'Bekam Medis Basah (Hijama)' | 'Bekam Kering & Relaksasi' | 'Bekam Estetika Wajah & Kepala' | 'Paket Terapi Holistik Thibbun Nabawi';
  clinicLocation: string;
  appointmentDate: string;
  timeSlot: string;
  notes?: string;
  therapistGender: 'Ikhwan' | 'Akhwat' | 'Fleksibel';
  reminderEnabled: boolean;
  reminderLeadTime: '30_min' | '1_hour' | '3_hours' | '1_day';
  status: 'Terkonfirmasi' | 'Menunggu' | 'Selesai';
  isSunnahDate: boolean;
  createdAt: string;
}

export interface PushNotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'bencana' | 'perbaikan' | 'shalat' | 'kebugaran' | 'bansos' | 'bekam' | 'kesehatan';
  timestamp: string;
  isRead: boolean;
  districtAffected?: string;
  actionUrlTab?: AppTab;
}
