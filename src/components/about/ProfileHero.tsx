import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';

export const ProfileHero: React.FC = () => {
  return (
    <section className="relative w-full bg-slate-950 text-white overflow-hidden font-sans select-none pt-48 pb-20 sm:pb-28">
      
      {/* Efek Pendar Latar Belakang Khas Perminas */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B4028]/40 via-slate-950 to-slate-950 z-0" />
      <div className="absolute right-0 top-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-6">
        
        {/* Rantai Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          <Link to="/" className="hover:text-[#C5A059] transition-colors">Beranda</Link>
          <ChevronRight size={12} />
          <span>Tentang Kami</span>
          <ChevronRight size={12} />
          <span className="text-[#C5A059]">Profil Perusahaan</span>
        </nav>

        {/* Tajuk Utama Halaman */}
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0B4028] border border-[#C5A059]/30 text-[#C5A059] text-[9px] font-black uppercase tracking-widest shadow-sm">
            <ShieldCheck size={12} /> BUMN Strategis Danantara
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            PT Perusahaan Mineral Nasional
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
            Entitas berdaulat penggerak hilirisasi logam tanah jarang (*rare earth elements*) dan mineral kritis demi mewujudkan ketahanan rantai pasok teknologi tingkat tinggi masa depan.
          </p>
        </div>

      </div>

      {/* Garis Aksen Bawah Lapis Emas Tua */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#0B4028] via-[#C5A059] to-transparent opacity-80" />

    </section>
  );
};