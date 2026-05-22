import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';

interface MasterHeroProps {
  badgeText: string;
  title: string;
  description: string;
  breadcrumbCurrent: string;
  imgUrl?: string; // 👇 Tambahkan ini
}

export const MasterHero: React.FC<MasterHeroProps> = ({
  badgeText,
  title,
  description,
  breadcrumbCurrent,
  imgUrl // 👇 Tangkap imgUrl
}) => {
  return (
    <section className="relative w-full bg-slate-950 text-white overflow-hidden font-sans select-none pt-48 pb-24 border-b border-slate-900 animate-in fade-in duration-500">
      
      {/* 👇 LOGIKA LATAR BELAKANG GAMBAR ATAU GRADIEN */}
      {imgUrl ? (
        // Mode Gambar Latar
        <>
          <img 
            src={imgUrl} 
            alt={title}
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-luminosity" // Efek redup & desaturasi agar elegan
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-0" />
        </>
      ) : (
        // Mode Polos (Gradien Pendar) bawaan
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0B4028]/30 via-slate-950 to-slate-950 z-0" />
          <div className="absolute right-[-10%] top-[-10%] w-[500px] h-[500px] bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none z-0" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-6">
        
        {/* Rantai Breadcrumb Dinamis */}
        <nav className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          <Link to="/" className="hover:text-[#C5A059] transition-colors">Beranda</Link>
          <ChevronRight size={12} />
          <span>Operasi & Strategi</span>
          <ChevronRight size={12} />
          <span className="text-[#C5A059]">{breadcrumbCurrent}</span>
        </nav>

        {/* Tajuk Utama */}
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0B4028] border border-[#C5A059]/30 text-[#C5A059] text-[9px] font-black uppercase tracking-widest shadow-sm">
            <Sparkles size={12} /> {badgeText}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            {title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>

      </div>

      {/* Garis Aksen Bawah Lapis Emas Tua */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#0B4028] via-[#C5A059] to-transparent opacity-80" />

    </section>
  );
};