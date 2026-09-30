import React from 'react';
import { 
  Activity, 
  Heart, 
  ExternalLink, 
  ShieldCheck, 
  Leaf, 
  Compass,
  ArrowUp
} from 'lucide-react';
import { AppTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: AppTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      
      {/* Top Motto Bar */}
      <div className="bg-emerald-950/80 border-b border-emerald-900/60 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 block">
              Motto Perjuangan Kebugaran FITCity
            </span>
            <p className="text-sm sm:text-base font-extrabold italic text-emerald-100 max-w-3xl leading-snug">
              "FIT Mahkota Jihad dijalan Allah untuk menjaga kebugaran jasmani agar lebih semangat dalam beribadah."
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: About FITCity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-lg">
                F
              </div>
              <span className="text-xl font-black text-white">
                FIT<span className="text-emerald-400">City</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Software infrastruktur platform superaplikasi cerdas yang mengintegrasikan layanan publik, mobilitas rendah emisi, transparansi APBD, pelaporan keluhan bertenaga AI, serta ekosistem kebugaran keluarga dan kedisiplinan ibadah.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Sistem Operasi Cerdas Kota Madani Berkelanjutan</span>
            </div>
          </div>

          {/* Col 2: Public & City Services */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Layanan & Transparansi Kota
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setActiveTab('services-transport')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Transportasi Listrik TransFIT & Ramah Difabel
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('iot-carbon')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Sensor Udara IoT & Pengurangan Jejak Karbon
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('budget-transparency')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Dasbor Transparansi Anggaran Publik (Open APBD)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('complaint-ai')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Pelaporan Keluhan Cepat (AI Triage Lapangan)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('map-aid-disaster')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Peta Distribusi Bansos & Mitigasi Bencana
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Health & Worship */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Kebugaran Jasmani & Ibadah
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setActiveTab('family-fitness')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Gerakan Sehat Keluarga & Pelacak Smartwatch
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('worship-journal')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Jadwal Shalat & Target Disiplin Ibadah
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('worship-journal')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Jurnal Harian Refleksi Spiritual (Muhasabah)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('beauty-health-bekam')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  The Beauty Health Center (World Bekam)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('beauty-health-bekam')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Ensiklopedia Riset Medis Thibbun Nabawi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Ecosystem */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Kanal Jaringan Islamicity
            </h4>
            <div className="space-y-2">
              <a
                href="https://t.me/FITCity313"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <span>t.me/FITCity313</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="http://f.fit.islamicity.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <span>f.fit.islamicity.tv</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="http://global.health.islamicity.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <span>global.health.islamicity.tv</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="http://health.islamicity.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <span>health.islamicity.tv</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="http://tni.islamicity.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <span>tni.islamicity.tv (Thibbun Nabawi)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 FITCity. Seluruh hak cipta dilindungi. Hak data publik terbuka di bawah Lisensi Open Government Data.</p>
          <div className="flex items-center gap-3">
            <span>Standar Keamanan Enkripsi End-to-End</span>
            <span>·</span>
            <span className="text-emerald-400 font-medium">Bebas Emisi Bersama FITCity</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
