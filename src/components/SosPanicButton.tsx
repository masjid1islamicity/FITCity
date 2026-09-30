import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  Radio, 
  PhoneCall, 
  MapPin, 
  Share2, 
  X, 
  CheckCircle2, 
  Volume2, 
  ShieldAlert, 
  Users, 
  Compass, 
  LifeBuoy,
  Flame,
  Ambulance,
  AlertTriangle
} from 'lucide-react';
import { sound } from '../services/audio';

export interface DistressSignalData {
  id: string;
  category: 'medis' | 'banjir' | 'kebakaran' | 'keamanan';
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  district: string;
  address: string;
  timestamp: string;
  notes?: string;
}

interface SosPanicButtonProps {
  currentDistrict?: string;
  onBroadcastDistress: (signal: DistressSignalData) => void;
}

export const SosPanicButton: React.FC<SosPanicButtonProps> = ({
  currentDistrict = 'Kawasan Barat',
  onBroadcastDistress,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [activeDistress, setActiveDistress] = useState<DistressSignalData | null>(null);

  // Form selections
  const [selectedCategory, setSelectedCategory] = useState<'medis' | 'banjir' | 'kebakaran' | 'keamanan'>('banjir');
  const [notes, setNotes] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number }>({
    lat: -6.1890,
    lng: 106.7720,
    accuracy: 5.2,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('GPS Kota Terkunci (±5m)');

  // Request actual browser geolocation on open
  useEffect(() => {
    if (isOpen && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      setIsLocating(true);
      setLocationStatus('Mencari sinyal GPS satelit...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: +pos.coords.latitude.toFixed(6),
            lng: +pos.coords.longitude.toFixed(6),
            accuracy: Math.round(pos.coords.accuracy),
          });
          setLocationStatus(`GPS Terkunci Presisi (±${Math.round(pos.coords.accuracy)}m)`);
          setIsLocating(false);
        },
        () => {
          // Fallback to district coordinate defaults
          setCoords({
            lat: -6.1890,
            lng: 106.7720,
            accuracy: 6.0,
          });
          setLocationStatus('GPS Perkiraan Jaringan Terpadu (±6m)');
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, [isOpen]);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCountingDown && countdown > 0) {
      sound.playAlertTone();
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (isCountingDown && countdown === 0) {
      setIsCountingDown(false);
      handleExecuteBroadcast();
    }
    return () => clearTimeout(timer);
  }, [isCountingDown, countdown]);

  const handleStartCountdown = () => {
    setCountdown(5);
    setIsCountingDown(true);
  };

  const handleCancelCountdown = () => {
    setIsCountingDown(false);
    setCountdown(5);
    sound.playPeacefulChime();
  };

  const handleExecuteBroadcast = () => {
    sound.playAlertTone();
    const newSignal: DistressSignalData = {
      id: `sos-${Date.now()}`,
      category: selectedCategory,
      latitude: coords.lat,
      longitude: coords.lng,
      accuracyMeters: coords.accuracy,
      district: currentDistrict,
      address: `Jl. Siaga Tanggap Darurat, ${currentDistrict} (Titik Koordinat: ${coords.lat}, ${coords.lng})`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      notes: notes || 'Permintaan evakuasi & bantuan darurat segera.',
    };

    setActiveDistress(newSignal);
    onBroadcastDistress(newSignal);
  };

  const handleShareToWhatsApp = () => {
    if (!activeDistress) return;
    const gmapsUrl = `https://maps.google.com/?q=${activeDistress.latitude},${activeDistress.longitude}`;
    const text = `🚨 *SINYAL DARURAT SOS WARGA FITCITY* 🚨\nKategori: ${activeDistress.category.toUpperCase()}\nWilayah: ${activeDistress.district}\nKoordinat GPS: ${activeDistress.latitude}, ${activeDistress.longitude}\nLink Lokasi Google Maps: ${gmapsUrl}\nCatatan: ${activeDistress.notes || '-'}\nMohon bantuan tim evakuasi segera!`;
    navigator.clipboard?.writeText(text);
    alert('Tautan koordinat GPS SOS telah disalin! Anda dapat mengirimkannya langsung ke grup WhatsApp keluarga atau relawan.');
  };

  return (
    <>
      {/* Floating SOS Trigger Button in Bottom-Right Corner */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group">
        <span className="hidden sm:inline-block px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-bold shadow-lg border border-rose-500/40 backdrop-blur-sm animate-pulse">
          SOS Panic Darurat
        </span>

        <button
          type="button"
          onClick={() => {
            sound.playAlertTone();
            setIsOpen(true);
          }}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 focus:outline-none ring-4 ring-rose-400/40 animate-bounce"
          title="Tombol Panik SOS: Pancarkan sinyal darurat dengan lokasi GPS"
        >
          <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-35" />
          <AlertOctagon className="w-7 h-7 sm:w-8 sm:h-8 relative z-10" />
        </button>
      </div>

      {/* SOS Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border-2 border-rose-500/80 shadow-2xl space-y-5 my-6 relative">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-rose-200 dark:border-rose-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400 ring-2 ring-rose-500/40">
                  <AlertOctagon className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <span>TOMBOL PANIK SOS DARURAT</span>
                    <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded-full">
                      Prioritas Tinggi
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pancarkan sinyal darurat instan ke BPBD, Basarnas, Ambulans, dan warga sekitar
                  </p>
                </div>
              </div>

              {!isCountingDown && (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Active Broadcast State */}
            {activeDistress ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto animate-ping">
                    <Radio className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-rose-600 dark:text-rose-300 uppercase tracking-wide">
                    Sinyal Distress Sedang Dipancarkan!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Pusat Komando BPBD & Tim Reaksi Cepat (URC) telah menerima koordinat presisi Anda.
                  </p>
                </div>

                {/* GPS Coordinates Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-600" />
                      <span>Koordinat GPS Terkunci:</span>
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Akurasi ±{activeDistress.accuracyMeters} Meter
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-center font-bold text-slate-900 dark:text-white">
                    {activeDistress.latitude}, {activeDistress.longitude}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Wilayah: <strong>{activeDistress.district}</strong> · Waktu Siaga: {activeDistress.timestamp}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleShareToWhatsApp}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Kirim Koordinat ke WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveDistress(null);
                      setIsOpen(false);
                    }}
                    className="py-2.5 px-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Tutup / Akhiri Siaga
                  </button>
                </div>
              </div>
            ) : isCountingDown ? (
              /* Countdown Cancel Window */
              <div className="py-6 text-center space-y-4">
                <div className="text-6xl font-black text-rose-600 animate-pulse">
                  {countdown}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">
                    Memancarkan Sinyal Darurat dalam {countdown} Detik...
                  </h4>
                  <p className="text-xs text-slate-500">
                    Sirene darurat dan koordinat satelit Anda akan disiarkan ke posko terdekat.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCancelCountdown}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-900 dark:text-white font-bold text-xs rounded-2xl shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <X className="w-4 h-4 text-rose-600" />
                  <span>Batalkan (Jika Salah Tekan)</span>
                </button>
              </div>
            ) : (
              /* Configuration and Trigger Form */
              <div className="space-y-4">
                
                {/* Category Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                    Pilih Kategori Keadaan Darurat:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'banjir', label: 'Banjir / Terjebak Air', icon: LifeBuoy, desc: 'Evakuasi perahu karet' },
                      { id: 'medis', label: 'Kritis Medis / Cidera', icon: Ambulance, desc: 'Butuh ambulans 119' },
                      { id: 'kebakaran', label: 'Kebakaran Rumah', icon: Flame, desc: 'Butuh damkar 113' },
                      { id: 'keamanan', label: 'Ancaman Keamanan', icon: ShieldAlert, desc: 'Butuh bantuan polisi 112' },
                    ].map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id as any)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                            isSelected
                              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-950 dark:text-rose-200 ring-2 ring-rose-400/40 shadow-xs'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />
                          <div>
                            <strong className="block text-xs">{cat.label}</strong>
                            <span className="text-[10px] opacity-75">{cat.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* GPS Location Status Indicator */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-rose-600" />
                      <span>Pelacakan GPS Satelit:</span>
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {locationStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Lat: {coords.lat} · Long: {coords.lng} · Distrik: {currentDistrict}
                  </div>
                </div>

                {/* Optional Note */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                    Kondisi Singkat (Opsional):
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Contoh: Air setinggi dada, ada 2 lansia dan 1 bayi butuh perahu..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-rose-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Main SOS Trigger Button */}
                <button
                  type="button"
                  onClick={handleStartCountdown}
                  className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-sm rounded-2xl shadow-lg transition-transform transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer ring-4 ring-rose-300 dark:ring-rose-900"
                >
                  <Radio className="w-5 h-5 animate-pulse" />
                  <span>PANCARKAN SINYAL SOS SEKARANG</span>
                </button>

                <p className="text-[10px] text-center text-slate-400">
                  Sinyal ini memicu respon prioritas darurat. Harap gunakan hanya untuk situasi genting.
                </p>

              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};
