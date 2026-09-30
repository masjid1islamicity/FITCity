import React from 'react';
import { 
  LayoutDashboard, 
  Bus, 
  Leaf, 
  Coins, 
  AlertTriangle, 
  MapPin, 
  Activity, 
  MoonStar, 
  Sparkles 
} from 'lucide-react';
import { AppTab } from '../types';

interface NavigationProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: 'executive' as AppTab,
      label: 'Eksekutif & Kota',
      icon: LayoutDashboard,
      description: 'Ringkasan & Tren Prediktif'
    },
    {
      id: 'services-transport' as AppTab,
      label: 'Layanan & Transportasi',
      icon: Bus,
      description: 'Mobilitas Cerdas & Akses'
    },
    {
      id: 'iot-carbon' as AppTab,
      label: 'IoT & Jejak Karbon',
      icon: Leaf,
      description: 'Sensor Emisi & Surya'
    },
    {
      id: 'budget-transparency' as AppTab,
      label: 'Transparansi APBD',
      icon: Coins,
      description: 'Audit Publik Terbuka'
    },
    {
      id: 'complaint-ai' as AppTab,
      label: 'Lapor Keluhan (AI)',
      icon: AlertTriangle,
      description: 'Triage Kebersihan Cepat'
    },
    {
      id: 'map-aid-disaster' as AppTab,
      label: 'Peta Bantuan & Bencana',
      icon: MapPin,
      description: 'Bansos & Sentimen Warga'
    },
    {
      id: 'family-fitness' as AppTab,
      label: 'Kebugaran Keluarga',
      icon: Activity,
      description: 'Langkah & Smartwatch'
    },
    {
      id: 'worship-journal' as AppTab,
      label: 'Ibadah & Muhasabah',
      icon: MoonStar,
      description: 'Jadwal Shalat & Jurnal'
    },
    {
      id: 'beauty-health-bekam' as AppTab,
      label: 'The Beauty Health',
      icon: Sparkles,
      description: 'World Bekam & Thibbun'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none" aria-label="Tabs Navigasi">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/25 ring-1 ring-emerald-600'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span className="font-medium tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
