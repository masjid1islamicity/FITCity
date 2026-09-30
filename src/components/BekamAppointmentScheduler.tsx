import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Bell, 
  BellRing, 
  CheckCircle2, 
  MapPin, 
  User, 
  Phone, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  Plus, 
  X, 
  Volume2, 
  Heart, 
  CalendarDays,
  FileCheck2,
  Trash2
} from 'lucide-react';
import { BekamAppointment, PushNotificationItem } from '../types';
import { sound } from '../services/audio';

interface BekamAppointmentSchedulerProps {
  onScheduleNotification?: (notif: PushNotificationItem) => void;
}

const INITIAL_APPOINTMENTS: BekamAppointment[] = [
  {
    id: 'apt-01',
    patientName: 'Ahmad Faiz',
    phone: '0812-3456-7890',
    serviceType: 'Bekam Medis Basah (Hijama)',
    clinicLocation: 'Puskesmas Ramah Lansia & Fasilitas Bekam Medis Distrik 1',
    appointmentDate: '2026-10-02', // 17 Rabi'ul Awwal (Tanggal Sunnah)
    timeSlot: '09:00 - 10:00 WIB',
    notes: 'Fokus titik Al-Kahil & Al-Warik untuk relaksasi punggung bawah dan optimalisasi denyut jantung istirahat.',
    therapistGender: 'Ikhwan',
    reminderEnabled: true,
    reminderLeadTime: '1_hour',
    status: 'Terkonfirmasi',
    isSunnahDate: true,
    createdAt: '29 Sept 2026',
  },
  {
    id: 'apt-02',
    patientName: 'Siti Aminah',
    phone: '0813-8899-7766',
    serviceType: 'Bekam Estetika Wajah & Kepala',
    clinicLocation: 'Klinik Thibbun Nabawi Islamic Center (Kawasan Timur)',
    appointmentDate: '2026-10-04', // 19 Rabi'ul Awwal (Tanggal Sunnah)
    timeSlot: '14:00 - 15:00 WIB',
    notes: 'Terapi titik Yafukh & Al-Akhda\'ain untuk mikrosirkulasi kepala dan pencegahan migrain.',
    therapistGender: 'Akhwat',
    reminderEnabled: true,
    reminderLeadTime: '3_hours',
    status: 'Terkonfirmasi',
    isSunnahDate: true,
    createdAt: '28 Sept 2026',
  }
];

export const BekamAppointmentScheduler: React.FC<BekamAppointmentSchedulerProps> = ({
  onScheduleNotification,
}) => {
  const [appointments, setAppointments] = useState<BekamAppointment[]>(INITIAL_APPOINTMENTS);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Booking Form State
  const [formName, setFormName] = useState('Ahmad Faiz');
  const [formPhone, setFormPhone] = useState('0812-3456-7890');
  const [formService, setFormService] = useState<BekamAppointment['serviceType']>('Bekam Medis Basah (Hijama)');
  const [formClinic, setFormClinic] = useState('Puskesmas Ramah Lansia & Fasilitas Bekam Medis Distrik 1');
  const [formDate, setFormDate] = useState('2026-10-02');
  const [formTime, setFormTime] = useState('09:00 - 10:00 WIB');
  const [formTherapist, setFormTherapist] = useState<BekamAppointment['therapistGender']>('Ikhwan');
  const [formReminderEnabled, setFormReminderEnabled] = useState(true);
  const [formReminderLeadTime, setFormReminderLeadTime] = useState<BekamAppointment['reminderLeadTime']>('1_hour');
  const [formNotes, setFormNotes] = useState('');
  const [formIsSunnahDate, setFormIsSunnahDate] = useState(true);

  const showNotificationToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 4500);
  };

  const handleTestReminderTone = (apt: BekamAppointment) => {
    sound.playPeacefulChime();
    showNotificationToast(`🔔 Nada pengingat berbunyi untuk sesi ${apt.patientName} (${apt.timeSlot}). Notifikasi siap aktif!`);
    
    // Test browser Notification if supported
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`Pengingat Sesi Bekam: ${apt.patientName}`, {
          body: `Jadwal sesi ${apt.serviceType} pada ${apt.appointmentDate} pukul ${apt.timeSlot} di ${apt.clinicLocation}.`,
          icon: '/favicon.ico',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  };

  const toggleReminder = (id: string) => {
    sound.playPeacefulChime();
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === id) {
          const updated = !apt.reminderEnabled;
          showNotificationToast(
            updated
              ? `Pengingat otomatis untuk ${apt.patientName} telah diaktifkan.`
              : `Pengingat otomatis untuk ${apt.patientName} dinonaktifkan.`
          );
          return { ...apt, reminderEnabled: updated };
        }
        return apt;
      })
    );
  };

  const handleDeleteAppointment = (id: string) => {
    sound.playAlertTone();
    const apt = appointments.find((a) => a.id === id);
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showNotificationToast(`Janji temu ${apt?.patientName || ''} berhasil dibatalkan.`);
  };

  const handleSelectQuickSunnahDate = (dateVal: string, isSunnah: boolean) => {
    setFormDate(dateVal);
    setFormIsSunnahDate(isSunnah);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    const newAppointment: BekamAppointment = {
      id: `apt-${Date.now()}`,
      patientName: formName.trim(),
      phone: formPhone.trim(),
      serviceType: formService,
      clinicLocation: formClinic,
      appointmentDate: formDate,
      timeSlot: formTime,
      notes: formNotes.trim() || 'Pemeriksaan tensi & sterilisasi standar Kemenkes',
      therapistGender: formTherapist,
      reminderEnabled: formReminderEnabled,
      reminderLeadTime: formReminderLeadTime,
      status: 'Terkonfirmasi',
      isSunnahDate: formIsSunnahDate,
      createdAt: '29 Sept 2026',
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // Integrate with the application's push notification system
    if (onScheduleNotification) {
      const notifItem: PushNotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Janji Temu Bekam Dijadwalkan: ${newAppointment.patientName}`,
        message: `Sesi ${newAppointment.serviceType} dijadwalkan pada ${newAppointment.appointmentDate} pukul ${newAppointment.timeSlot} di ${newAppointment.clinicLocation}. Pengingat aktif ${newAppointment.reminderLeadTime.replace('_', ' ')}.`,
        category: 'bekam',
        timestamp: 'Baru saja',
        isRead: false,
        actionUrlTab: 'beauty-health-bekam',
      };
      onScheduleNotification(notifItem);
    }

    // Play chime sound
    sound.playPeacefulChime();
    setShowBookingModal(false);
    showNotificationToast(
      `Janji temu bekam untuk ${newAppointment.patientName} berhasil dibuat dan pengingat telah terhubung ke pusat notifikasi!`
    );

    // Request browser notification permission if available
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 animate-in fade-in shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackToast}</span>
          </div>
          <button
            onClick={() => setFeedbackToast(null)}
            className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Jadwal & Janji Temu Bekam Medis (Appointment Scheduler)</span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                    Notifikasi Terintegrasi
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Atur sesi terapi bekam steril di klinik mitra bersertifikasi lengkap dengan alarm pengingat audio syiar
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => sound.playPeacefulChime()}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Uji nada pengingat sesi"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Uji Alarm Pengingat</span>
            </button>

            <button
              onClick={() => setShowBookingModal(true)}
              className="px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Jadwalkan Janji Temu Baru</span>
            </button>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Janji Temu Aktif
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {appointments.filter((a) => a.status === 'Terkonfirmasi').length} Sesi
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Fase Sunnah Terdekat
              </span>
              <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                17 Rabi'ul Awwal 1448 H
              </span>
              <span className="text-[10px] text-slate-400 block">Insya Allah 3 Hari Lagi</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Sistem Pengingat
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Audio & Web Push Siaga</span>
              </span>
              <span className="text-[10px] text-slate-400 block">Terhubung ke Lonceng Notifikasi</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-400">
              <BellRing className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Daftar Sesi Terjadwal Anda ({appointments.length}):
          </span>
          <span className="text-[11px] text-slate-400">
            Klinik mitra menerapkan SOP jarum & kop 100% sekali pakai
          </span>
        </div>

        {appointments.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Belum Ada Janji Temu Bekam
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Jadwalkan sesi bekam basah atau konsultasi nabawi untuk menjaga stamina ibadah dan daya tahan tubuh.
            </p>
            <button
              onClick={() => setShowBookingModal(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Jadwalkan Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {apt.patientName}
                        </span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-medium">
                          Terapis: {apt.therapistGender}
                        </span>
                        {apt.isSunnahDate && (
                          <span className="text-[10px] bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>Sunnah Hijriyah</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 block">
                        {apt.serviceType}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {apt.status}
                    </span>
                  </div>

                  {/* Date, Time & Clinic Info */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold">{apt.appointmentDate}</span>
                      <span className="text-slate-400">·</span>
                      <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold">{apt.timeSlot}</span>
                    </div>

                    <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{apt.clinicLocation}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Kontak Konfirmasi: {apt.phone}</span>
                    </div>
                  </div>

                  {/* Notes / Clinical points */}
                  {apt.notes && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 italic bg-emerald-50/40 dark:bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-200/40 dark:border-emerald-900/40">
                      "{apt.notes}"
                    </div>
                  )}

                  {/* Integrated Notification Setting for this Appointment */}
                  <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleReminder(apt.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          apt.reminderEnabled
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                        }`}
                        title={apt.reminderEnabled ? 'Pengingat Aktif' : 'Pengingat Nonaktif'}
                      >
                        {apt.reminderEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellRing className="w-3.5 h-3.5" />}
                      </button>
                      <div>
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">
                          {apt.reminderEnabled ? 'Pengingat Otomatis Aktif' : 'Pengingat Dinonaktifkan'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {apt.reminderEnabled 
                            ? `Alarm bunyi ${apt.reminderLeadTime.replace('_', ' ')} sebelum sesi`
                            : 'Klik bel untuk mengaktifkan pengingat'}
                        </span>
                      </div>
                    </div>

                    {apt.reminderEnabled && (
                      <button
                        onClick={() => handleTestReminderTone(apt)}
                        className="px-2.5 py-1 bg-white dark:bg-slate-900 hover:bg-emerald-50 text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Uji suara nada pengingat"
                      >
                        <Volume2 className="w-3 h-3 text-emerald-600" />
                        <span>Uji Alarm</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Higienitas Steril 100%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTestReminderTone(apt)}
                      className="text-slate-500 hover:text-emerald-600 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Kirim ke Notif
                    </button>
                    <button
                      onClick={() => handleDeleteAppointment(apt.id)}
                      className="text-rose-500 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Batalkan janji temu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Appointment Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Jadwalkan Sesi Bekam & Terapi Nabawi</span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                      Klinik Resmi
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Pilih layanan, klinik terdekat, serta waktu pengingat otomatis
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              
              {/* Patient Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Nama Pasien:
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Nama Lengkap Pasien"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Nomor Kontak (WhatsApp):
                  </label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="Contoh: 0812-3456-7890"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              {/* Service Type Selection */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Pilihan Paket Terapi:
                </label>
                <select
                  value={formService}
                  onChange={(e) => setFormService(e.target.value as BekamAppointment['serviceType'])}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Bekam Medis Basah (Hijama)">Bekam Medis Basah (Hijama) - Titik Al-Kahil & Al-Akhda'ain</option>
                  <option value="Bekam Kering & Relaksasi">Bekam Kering & Relaksasi Otot Tulang Belakang</option>
                  <option value="Bekam Estetika Wajah & Kepala">Bekam Estetika Wajah & Kepala (Al-Hammah & Yafukh)</option>
                  <option value="Paket Terapi Holistik Thibbun Nabawi">Paket Terapi Holistik (Bekam + Ruqyah Mandiri + Herbal)</option>
                </select>
              </div>

              {/* Clinic Location */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Lokasi Klinik / Pusat Terapi:
                </label>
                <select
                  value={formClinic}
                  onChange={(e) => setFormClinic(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Puskesmas Ramah Lansia & Fasilitas Bekam Medis Distrik 1">Puskesmas Ramah Lansia & Fasilitas Bekam Medis Distrik 1 (Kawasan Pusat)</option>
                  <option value="Klinik Thibbun Nabawi Islamic Center (Kawasan Timur)">Klinik Thibbun Nabawi Islamic Center (Kawasan Timur)</option>
                  <option value="Depo Kesehatan & Bekam Al-Barakah (Kawasan Selatan)">Depo Kesehatan & Bekam Al-Barakah (Kawasan Selatan)</option>
                  <option value="Layanan Home-Care Bersertifikasi (Terapis Datang ke Rumah)">Layanan Home-Care Bersertifikasi (Terapis Datang ke Rumah)</option>
                </select>
              </div>

              {/* Quick Select Sunnah Dates */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pilihan Tanggal Sunnah Hijriyah:</span>
                  </span>
                  <span className="text-[10px] text-amber-800 dark:text-amber-400 font-semibold">
                    Fase Gravitasi Bulan Terbaik
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                  {[
                    { label: '17 Rabi\'ul Awwal', date: '2026-10-02', desc: 'Besok Lusa' },
                    { label: '19 Rabi\'ul Awwal', date: '2026-10-04', desc: '4 Hari Lagi' },
                    { label: '21 Rabi\'ul Awwal', date: '2026-10-06', desc: '6 Hari Lagi' },
                  ].map((sDate) => (
                    <button
                      key={sDate.date}
                      type="button"
                      onClick={() => handleSelectQuickSunnahDate(sDate.date, true)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        formDate === sDate.date
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100/50'
                      }`}
                    >
                      <strong className="block text-[11px]">{sDate.label}</strong>
                      <span className="text-[10px] opacity-80">{sDate.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Tanggal Sesi:
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => {
                      setFormDate(e.target.value);
                      setFormIsSunnahDate(e.target.value === '2026-10-02' || e.target.value === '2026-10-04' || e.target.value === '2026-10-06');
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Slot Waktu:
                  </label>
                  <select
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="08:30 - 09:30 WIB">08:30 - 09:30 WIB (Pagi)</option>
                    <option value="09:00 - 10:00 WIB">09:00 - 10:00 WIB (Pagi)</option>
                    <option value="10:30 - 11:30 WIB">10:30 - 11:30 WIB (Pagi)</option>
                    <option value="13:30 - 14:30 WIB">13:30 - 14:30 WIB (Siang)</option>
                    <option value="16:00 - 17:00 WIB">16:00 - 17:00 WIB (Sore)</option>
                    <option value="19:30 - 20:30 WIB">19:30 - 20:30 WIB (Malam)</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Preferensi Terapis:
                  </label>
                  <select
                    value={formTherapist}
                    onChange={(e) => setFormTherapist(e.target.value as BekamAppointment['therapistGender'])}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Ikhwan">Ikhwan (Pria)</option>
                    <option value="Akhwat">Akhwat (Wanita)</option>
                    <option value="Fleksibel">Fleksibel</option>
                  </select>
                </div>
              </div>

              {/* Notification & Reminder Settings */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 block">
                        Integrasi Notifikasi & Alarm Syiar
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Sinkronkan ke pusat notifikasi aplikasi dan alarm pengingat
                      </span>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={formReminderEnabled}
                    onChange={(e) => setFormReminderEnabled(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                </div>

                {formReminderEnabled && (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60">
                    <div>
                      <label className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block">
                        Waktu Kirim Pengingat:
                      </label>
                      <select
                        value={formReminderLeadTime}
                        onChange={(e) => setFormReminderLeadTime(e.target.value as BekamAppointment['reminderLeadTime'])}
                        className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium mt-1"
                      >
                        <option value="30_min">30 Menit Sebelum</option>
                        <option value="1_hour">1 Jam Sebelum (Rekomendasi)</option>
                        <option value="3_hours">3 Jam Sebelum</option>
                        <option value="1_day">1 Hari Sebelum</option>
                      </select>
                    </div>

                    <div className="flex flex-col justify-end">
                      <button
                        type="button"
                        onClick={() => sound.playPeacefulChime()}
                        className="w-full py-1.5 px-2 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-lg text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1 hover:bg-emerald-50 transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3 text-emerald-600" />
                        <span>Cek Bunyi Pengingat</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Catatan Keluhan / Titik Khusus:
                </label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Misal: Pegal leher akibat kerja di depan layar, tensi agak tinggi..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Konfirmasi & Simpan Pengingat</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Pre-bekam Preparation & Clinical Tips */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <FileCheck2 className="w-4 h-4 text-emerald-600" />
          <span>Petunjuk & SOP Persiapan Pasien Sebelum Sesi Terapi:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-600 dark:text-slate-400">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-bold">1. Puasa Ringan 2 Jam</strong>
            <p>Hindari makan porsi berat 2-3 jam sebelum bekam agar distribusi sirkulasi darah tidak terfokus ke saluran cerna.</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-bold">2. Wudhu & Ketenangan Jiwa</strong>
            <p>Disunnahkan berwudhu dan membaca doa perlindungan/ruqyah mandiri untuk menghadirkan ketenangan jiwa dan kelancaran terapi.</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <strong className="text-slate-900 dark:text-white block font-bold">3. Hidrasi Air Hangat Madu</strong>
            <p>Minum segelas air hangat dicampur 1 sendok madu murni setelah terapi untuk mempercepat pemulihan energi dan glukosa alami.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
