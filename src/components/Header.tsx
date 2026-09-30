import React, { useState } from 'react';
import { 
  Bell, 
  Moon, 
  Sun, 
  Cloud, 
  CloudCheck, 
  Radio, 
  ExternalLink, 
  Menu, 
  X, 
  HeartHandshake, 
  Activity, 
  Compass,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { AppTab, PushNotificationItem } from '../types';
import { sound } from '../services/audio';

interface HeaderProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isDark: boolean;
  toggleDark: () => void;
  notifications: PushNotificationItem[];
  markNotificationAsRead: (id: string) => void;
  isSyncing: boolean;
  triggerManualSync: () => void;
  lastSyncedTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleDark,
  notifications,
  markNotificationAsRead,
  isSyncing,
  triggerManualSync,
  lastSyncedTime
}) => {
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showEcosystemModal, setShowEcosystemModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleTestAudio = () => {
    sound.playPeacefulChime();
  };

  return (
    <>
      {/* Motto Banner */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 border-b border-emerald-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-300">MOTTO FITCity:</span>
            <span className="italic">
              "FIT Mahkota Jihad dijalan Allah untuk menjaga kebugaran jasmani agar lebih semangat dalam beribadah."
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-emerald-200">
            <button 
              onClick={handleTestAudio} 
              className="hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              title="Uji nada syiar & pengingat ibadah"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nada Pengingat</span>
            </button>
            <span className="text-emerald-700">|</span>
            <button 
              onClick={() => setShowEcosystemModal(true)}
              className="hover:text-white flex items-center gap-1 transition-colors underline underline-offset-2 cursor-pointer"
            >
              <span>Ekosistem Islamicity</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('executive')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-emerald-800 dark:text-emerald-400">
                    FIT<span className="text-slate-800 dark:text-white">City</span>
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                    313 SuperApp
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Platform Cerdas Infrastruktur, Kebugaran & Pelayanan Madani
                </p>
              </div>
            </button>
          </div>

          {/* Right Controls: Cloud Sync, Notifications, Dark Mode, Ecosystem */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Real-time Multi-Device Cloud Sync */}
            <button
              onClick={triggerManualSync}
              disabled={isSyncing}
              className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Sinkronisasi data real-time antar perangkat"
            >
              {isSyncing ? (
                <>
                  <Cloud className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span className="hidden md:inline text-emerald-600 dark:text-emerald-400 font-medium">Menyinkronkan...</span>
                </>
              ) : (
                <>
                  <CloudCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden md:inline">Sinkron: {lastSyncedTime}</span>
                </>
              )}
            </button>

            {/* Notification Drawer Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDrawer(!showNotifDrawer)}
                className="relative p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Pemberitahuan real-time & peringatan dini"
                aria-label="Pemberitahuan"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifDrawer && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                        Pemberitahuan & Peringatan Lapangan
                      </h4>
                    </div>
                    <span className="text-xs text-slate-500">{unreadCount} baru</span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto my-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.actionUrlTab) {
                            setActiveTab(n.actionUrlTab);
                            setShowNotifDrawer(false);
                          }
                        }}
                        className={`py-3 px-1 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg ${
                          !n.isRead ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {n.message}
                        </p>
                        {n.districtAffected && (
                          <div className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                            Wilayah terdampak: {n.districtAffected}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                    <button
                      onClick={() => {
                        notifications.forEach(n => markNotificationAsRead(n.id));
                      }}
                      className="text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Tandai semua terbaca
                    </button>
                    <button
                      onClick={() => setShowNotifDrawer(false)}
                      className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDark}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
              aria-label="Mode Gelap / Terang"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1">
            <button
              onClick={() => { setActiveTab('executive'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'executive' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Dasbor Eksekutif & Ringkasan Kota
            </button>
            <button
              onClick={() => { setActiveTab('services-transport'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'services-transport' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Layanan Publik & Transportasi
            </button>
            <button
              onClick={() => { setActiveTab('iot-carbon'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'iot-carbon' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              IoT Sensor & Jejak Karbon
            </button>
            <button
              onClick={() => { setActiveTab('budget-transparency'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'budget-transparency' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Dasbor Transparansi Anggaran
            </button>
            <button
              onClick={() => { setActiveTab('complaint-ai'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'complaint-ai' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Lapor Keluhan (AI Terintegrasi)
            </button>
            <button
              onClick={() => { setActiveTab('map-aid-disaster'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'map-aid-disaster' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Peta Bantuan Sosial & Data Bencana
            </button>
            <button
              onClick={() => { setActiveTab('family-fitness'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'family-fitness' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Gerakan Sehat Keluarga & Kebugaran
            </button>
            <button
              onClick={() => { setActiveTab('worship-journal'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'worship-journal' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Disiplin Ibadah & Jurnal Harian
            </button>
            <button
              onClick={() => { setActiveTab('beauty-health-bekam'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'beauty-health-bekam' ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              The Beauty Health Center & World Bekam
            </button>
          </div>
        )}
      </header>

      {/* Islamicity Ecosystem Modal */}
      {showEcosystemModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Jaringan Ekosistem Islamicity & Thibbun Nabawi
                </h3>
              </div>
              <button 
                onClick={() => setShowEcosystemModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 my-4 leading-relaxed">
              FITCity terintegrasi secara langsung dengan portal kesehatan, kebugaran sunnah, media dakwah, dan kanal resmi World Bekam Islamicity:
            </p>

            <div className="space-y-2.5">
              <a
                href="https://t.me/FITCity313"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all group"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    t.me/FITCity313
                  </div>
                  <div className="text-xs text-slate-500">Komunitas Resmi Telegram & Siaran Informasi Cepat</div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </a>

              <a
                href="http://f.fit.islamicity.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all group"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    http://f.fit.islamicity.tv
                  </div>
                  <div className="text-xs text-slate-500">Portal Kebugaran Fisik & Olahraga Sunnah Berjamaah</div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </a>

              <a
                href="http://global.health.islamicity.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all group"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    http://global.health.islamicity.tv
                  </div>
                  <div className="text-xs text-slate-500">Pusat Informasi Kesehatan Holistik Global</div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </a>

              <a
                href="http://health.islamicity.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all group"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    http://health.islamicity.tv
                  </div>
                  <div className="text-xs text-slate-500">World Bekam Islamicity & Riset Medis Internasional</div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </a>

              <a
                href="http://tni.islamicity.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all group"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    http://tni.islamicity.tv
                  </div>
                  <div className="text-xs text-slate-500">Thibbun Nabawi Islamicity (Ensiklopedia Pengobatan Kenabian)</div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </a>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowEcosystemModal(false)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
