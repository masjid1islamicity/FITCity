import React, { useState } from 'react';
import { 
  MapPin, 
  ShieldAlert, 
  Package, 
  HeartHandshake, 
  Activity, 
  Search, 
  CheckCircle, 
  Radio, 
  TrendingUp, 
  Share2, 
  Phone, 
  Sparkles,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SOCIAL_AID_POINTS, DISASTER_POINTS } from '../data/mockData';
import { SocialAidPoint, DisasterWarningPoint } from '../types';
import { sound } from '../services/audio';
import { DisasterPreparednessGuide } from './DisasterPreparednessGuide';
import { SosPanicButton, DistressSignalData } from './SosPanicButton';
import { AlertOctagon } from 'lucide-react';

interface InteractiveMapDisasterAidProps {
  onTriggerGeoAlert: (district: string, message: string) => void;
}

export const InteractiveMapDisasterAid: React.FC<InteractiveMapDisasterAidProps> = ({ onTriggerGeoAlert }) => {
  const [aidPoints] = useState<SocialAidPoint[]>(SOCIAL_AID_POINTS);
  const [disasterPoints] = useState<DisasterWarningPoint[]>(DISASTER_POINTS);
  const [selectedFilter, setSelectedFilter] = useState<'Semua' | 'Bansos' | 'Bencana'>('Semua');
  const [activePin, setActivePin] = useState<{ type: 'aid' | 'disaster'; data: SocialAidPoint | DisasterWarningPoint } | null>({
    type: 'aid',
    data: SOCIAL_AID_POINTS[0]
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDistressSignal, setActiveDistressSignal] = useState<DistressSignalData | null>(null);

  const handleSimulateGeoNotification = (point: DisasterWarningPoint) => {
    sound.playAlertTone();
    onTriggerGeoAlert(
      point.district,
      `Peringatan Dini Wilayah: ${point.title} berada pada status ${point.status}. Ketinggian air: ${point.waterLevelCm} cm. Tindakan: ${point.actionRequired}`
    );
  };

  const handleBroadcastDistress = (signal: DistressSignalData) => {
    setActiveDistressSignal(signal);
    sound.playAlertTone();
    onTriggerGeoAlert(
      signal.district,
      `🚨 PANGGILAN DARURAT SOS: Warga membutuhkan bantuan evakuasi ${signal.category.toUpperCase()} di ${signal.district}! Koordinat GPS: ${signal.latitude}, ${signal.longitude}. Catatan: ${signal.notes || 'Darurat'}`
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600" />
            <span>Peta Interaktif Titik Distribusi Bantuan Sosial & Data Bencana</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visualisasi presisi titik lumbung pangan dhuafa, intervensi gizi anak, dan pemantauan sensor tanggul banjir terintegrasi.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs self-start sm:self-auto">
          {(['Semua', 'Bansos', 'Bencana'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedFilter === filter
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {filter === 'Semua' ? 'Semua Titik' : filter === 'Bansos' ? 'Titik Bantuan Sosial' : 'Pemantauan Bencana'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Map Visualizer (Left) + Detail & Sentiment (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Map Canvas Representation (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Peta Terpadu Distrik Perkotaan FITCity
            </span>
            <span className="text-slate-400">Klik marker untuk melihat kuota & data real-time</span>
          </div>

          {/* SVG Map Canvas Simulation with districts & coordinates */}
          <div className="relative w-full aspect-[16/10] bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            
            {/* Geometric City Grid Backdrop */}
            <svg className="w-full h-full" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-800/80" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* River Vector Flowing Across City */}
              <path 
                d="M 0,220 C 180,240 240,160 420,200 C 600,240 700,180 800,210" 
                stroke="#0284c7" 
                strokeWidth="24" 
                strokeOpacity="0.25" 
                strokeLinecap="round"
              />
              <path 
                d="M 0,220 C 180,240 240,160 420,200 C 600,240 700,180 800,210" 
                stroke="#38bdf8" 
                strokeWidth="4" 
                strokeDasharray="6 6" 
                strokeOpacity="0.6"
              />

              {/* District Area Boundaries */}
              <rect x="60" y="50" width="220" height="160" rx="16" fill="rgba(16, 185, 129, 0.04)" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="75" y="75" fill="#059669" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Kawasan Barat (Rawan Air)</text>

              <rect x="300" y="40" width="240" height="180" rx="16" fill="rgba(16, 185, 129, 0.06)" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1.5" />
              <text x="315" y="65" fill="#047857" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Pusat Kota (Islamic Center)</text>

              <rect x="560" y="60" width="200" height="180" rx="16" fill="rgba(16, 185, 129, 0.04)" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="575" y="85" fill="#059669" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Kawasan Timur</text>

              <rect x="220" y="270" width="360" height="190" rx="16" fill="rgba(16, 185, 129, 0.05)" stroke="rgba(16, 185, 129, 0.25)" strokeWidth="1.5" />
              <text x="240" y="295" fill="#047857" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Kawasan Selatan & RTH Madani</text>
            </svg>

            {/* Aid Points Marker Overlay */}
            {(selectedFilter === 'Semua' || selectedFilter === 'Bansos') &&
              aidPoints.map((aid, idx) => {
                const positions = [
                  { top: '24%', left: '48%' }, // Pusat
                  { top: '28%', left: '74%' }, // Timur
                  { top: '68%', left: '52%' }, // Selatan
                  { top: '38%', left: '20%' }, // Barat
                ];
                const pos = positions[idx % positions.length];
                const isSelected = activePin?.type === 'aid' && activePin.data.id === aid.id;

                return (
                  <button
                    key={aid.id}
                    onClick={() => setActivePin({ type: 'aid', data: aid })}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer transition-all transform hover:scale-125 z-20 ${
                      isSelected
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-300 dark:ring-emerald-800 shadow-lg'
                        : 'bg-emerald-500/90 text-white shadow-md'
                    }`}
                    title={aid.name}
                  >
                    <Package className="w-4 h-4" />
                  </button>
                );
              })}

            {/* Disaster Points Marker Overlay */}
            {(selectedFilter === 'Semua' || selectedFilter === 'Bencana') &&
              disasterPoints.map((dis, idx) => {
                const positions = [
                  { top: '44%', left: '16%' }, // Barat
                  { top: '34%', left: '80%' }, // Timur
                  { top: '22%', left: '42%' }, // Pusat
                ];
                const pos = positions[idx % positions.length];
                const isSelected = activePin?.type === 'disaster' && activePin.data.id === dis.id;

                return (
                  <button
                    key={dis.id}
                    onClick={() => setActivePin({ type: 'disaster', data: dis })}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full cursor-pointer transition-all transform hover:scale-125 z-20 ${
                      isSelected
                        ? 'bg-amber-600 text-white ring-4 ring-amber-300 dark:ring-amber-800 shadow-lg animate-bounce'
                        : 'bg-amber-500/90 text-white shadow-md'
                    }`}
                    title={dis.title}
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </button>
                );
              })}

            {/* Active SOS Distress Signal Beacon Marker */}
            {activeDistressSignal && (
              <div
                style={{ top: '46%', left: '22%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center"
              >
                <div className="relative">
                  <span className="absolute -inset-3 rounded-full bg-rose-600 animate-ping opacity-75" />
                  <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-rose-600 text-white font-bold shadow-2xl ring-4 ring-rose-400">
                    <AlertOctagon className="w-4 h-4 animate-pulse" />
                  </span>
                </div>
                <span className="mt-1 px-2 py-0.5 rounded-full bg-rose-950/90 text-white text-[9px] font-black border border-rose-500 whitespace-nowrap shadow-md">
                  SOS: {activeDistressSignal.category.toUpperCase()} (GPS AKTIF)
                </span>
              </div>
            )}

            {/* Map Legend */}
            <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-[11px] space-y-1 z-10 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                <span className="text-slate-700 dark:text-slate-300">Titik Distribusi Bantuan Sosial (Sembako / Gizi)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="text-slate-700 dark:text-slate-300">Sensor Siaga Banjir & Jalur Evakuasi</span>
              </div>
              {activeDistressSignal && (
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-600 inline-block animate-ping" />
                  <span className="text-rose-600 font-bold">Beacon SOS Sinyal Bahaya Aktif</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Sistem Pemetaan Terbuka FITCity GIS</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
              Sinkronisasi Sensor LoRaWAN Aktif
            </span>
          </div>
        </div>

        {/* Right Column: Selected Pin Details & Citizen Sentiment Gauge (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Detail Card of Clicked Point */}
          {activePin && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                  {activePin.type === 'aid' ? 'Detail Titik Bantuan Sosial' : 'Detail Sensor / Mitigasi Bencana'}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {activePin.data.district}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {'name' in activePin.data ? activePin.data.name : activePin.data.title}
              </h4>

              {activePin.type === 'aid' && 'quotaRemaining' in activePin.data && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Kategori Bansos</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{activePin.data.category}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Stok Sisa / Total Kuota</span>
                    <span className="font-semibold text-emerald-600">
                      {activePin.data.quotaRemaining} / {activePin.data.totalQuota} Paket
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Jam Layanan</span>
                    <span className="font-medium text-slate-900 dark:text-white">{activePin.data.operationalHours}</span>
                  </div>

                  <div className="py-1">
                    <span className="text-slate-500">Alamat Lengkap:</span>
                    <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{activePin.data.address}</p>
                  </div>

                  <div className="pt-2 text-slate-600 dark:text-slate-400 text-[11px] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Narahubung: {activePin.data.contactPerson}</span>
                  </div>
                </div>
              )}

              {activePin.type === 'disaster' && 'waterLevelCm' in activePin.data && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Status Waspada</span>
                    <span className="font-bold text-amber-600">{activePin.data.status}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Ketinggian Air</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{activePin.data.waterLevelCm} cm</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Pompa Beroperasi</span>
                    <span className="font-semibold text-emerald-600">{activePin.data.pumpsActive} Unit Aktif</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200">
                    <strong>Tindakan Mitigasi:</strong> {activePin.data.actionRequired}
                  </div>

                  <button
                    onClick={() => handleSimulateGeoNotification(activePin.data as DisasterWarningPoint)}
                    className="w-full mt-2 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Radio className="w-4 h-4" />
                    <span>Kirim Peringatan Dini Push ke Warga Wilayah Ini</span>
                  </button>

                  <a
                    href="#preparedness-guide"
                    className="w-full py-1.5 px-3 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-200 dark:border-emerald-800"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Buka Panduan Kesiapsiagaan Keluarga ({activePin.data.district})</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Social Media Sentiment Analysis Module */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Analisis Sentimen Media Sosial Respon Bencana
                </h4>
              </div>
              <span className="text-xs font-semibold text-emerald-600">82% Positif</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Memindai 14.280 interaksi warga terkait kecepatan respon penanganan bencana, bantuan sembako, dan transparansi pemerintah kota:
            </p>

            {/* Sentiment Meter Bar */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300 text-[11px]">
                <span>Positif (82%)</span>
                <span>Netral (13%)</span>
                <span>Kritis (5%)</span>
              </div>
              <div className="flex h-2.5 rounded-full overflow-hidden w-full">
                <div className="bg-emerald-600 h-full" style={{ width: '82%' }} />
                <div className="bg-amber-400 h-full" style={{ width: '13%' }} />
                <div className="bg-rose-500 h-full" style={{ width: '5%' }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-1">
              <span className="font-semibold text-slate-900 dark:text-white">
                Intisari AI untuk Pemangku Kebijakan:
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                Warga sangat mengapresiasi ketiadaan pungutan liar pada penyaluran bansos sembako berkat peta digital terbuka. Masukan teratas adalah percepatan pemasangan pompa portable di titik perempatan Melati.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Preparedness Guide Section: Context-Aware Checklists for Families */}
      <div id="preparedness-guide" className="scroll-mt-6">
        <DisasterPreparednessGuide
          activeDistrict={activePin?.data.district || 'Kawasan Barat'}
          activeDisasterPoint={activePin?.type === 'disaster' ? (activePin.data as DisasterWarningPoint) : null}
          onTriggerEmergencyAlert={(msg) => onTriggerGeoAlert(activePin?.data.district || 'Kawasan Barat', msg)}
        />
      </div>

      {/* Floating SOS Panic Button with Precise GPS Broadcast */}
      <SosPanicButton
        currentDistrict={activePin?.data.district || 'Kawasan Barat'}
        onBroadcastDistress={handleBroadcastDistress}
      />

    </div>
  );
};
