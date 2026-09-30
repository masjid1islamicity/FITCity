import React, { useState } from 'react';
import { 
  Bus, 
  Clock, 
  Users, 
  Leaf, 
  Accessibility, 
  MapPin, 
  PhoneCall, 
  Search, 
  CheckCircle, 
  AlertCircle,
  Navigation,
  FileText,
  HeartPulse,
  Ambulance,
  Car
} from 'lucide-react';
import { INITIAL_ROUTES, PUBLIC_SERVICES } from '../data/mockData';
import { TransportRoute, PublicServiceItem } from '../types';

export const PublicServicesTransport: React.FC = () => {
  const [routes, setRoutes] = useState<TransportRoute[]>(INITIAL_ROUTES);
  const [services] = useState<PublicServiceItem[]>(PUBLIC_SERVICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const filteredServices = services.filter((s) => {
    const matchCat = selectedCategory === 'Semua' || s.category === selectedCategory;
    const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSimulateServiceAction = (serviceTitle: string) => {
    setBookingSuccess(`Permohonan layanan "${serviceTitle}" berhasil diproses ke antrean digital prioritas.`);
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bus className="w-6 h-6 text-emerald-600" />
            <span>Layanan Publik & Mobilitas Transportasi Cerdas</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Transportasi publik rendah emisi terintegrasi dan kemudahan aksesibilitas ramah difabel di setiap sudut kota.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl">
            <Accessibility className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">100% Ramah Disabilitas & Lansia</span>
          </div>
        </div>
      </div>

      {bookingSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{bookingSuccess}</span>
        </div>
      )}

      {/* Real-time Transport Routes */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Jadwal Kedatangan Real-Time Armada Bersih TransFIT</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Dilengkapi sensor GPS, ramp kursi roda otomatis, dan pendingin udara ramah lingkungan
            </p>
          </div>
          <span className="text-xs text-slate-400">Pembaruan GPS: 15 detik lalu</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((route) => (
            <div
              key={route.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 bg-slate-50/50 dark:bg-slate-800/40 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {route.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{route.route}</span>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {route.nextArrivalMinutes} Menit
                  </div>
                  <span className="text-[10px] text-slate-400">Estimasi Tiba</span>
                </div>
              </div>

              {/* Badges / Metadata without pills */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Keterisian: <strong>{route.occupancyPercent}%</strong>
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                  <Leaf className="w-3.5 h-3.5" />
                  Hemat {route.co2SavedKgPerTrip} kg CO2
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                {route.isWheelchairAccessible && (
                  <span className="flex items-center gap-1 text-teal-700 dark:text-teal-300 font-medium">
                    <Accessibility className="w-3.5 h-3.5" />
                    Akses Kursi Roda
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Public Services Directory */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Portal Layanan Publik Cepat & Bebas Antre
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Integrasi seluruh layanan kependudukan, darurat medis, bantuan sosial, dan perizinan kota
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari layanan publik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-emerald-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs overflow-x-auto">
          {['Semua', 'Darurat', 'Kesehatan', 'Kependudukan', 'Sosial', 'Perizinan'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-3 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                    {service.category === 'Darurat' ? (
                      <Ambulance className="w-5 h-5" />
                    ) : service.category === 'Kesehatan' ? (
                      <HeartPulse className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    {service.category}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {service.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {service.processingTime}
                </span>

                <button
                  onClick={() => handleSimulateServiceAction(service.title)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Ajukan Layanan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
