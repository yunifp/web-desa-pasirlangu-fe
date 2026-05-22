import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';

export interface MasterProfileHeroProps {
  breadcrumb?: string;
  badge?: string;
  title?: string;
  description?: string;
}

export const MasterProfileHero: React.FC<MasterProfileHeroProps> = ({
  breadcrumb = "Profil Perusahaan",
  badge = "BUMN Strategis Danantara",
  title = "PT Perusahaan Mineral Nasional",
  description = "Entitas berdaulat penggerak hilirisasi logam tanah jarang dan mineral kritis."
}) => {
  return (
    <section className="relative w-full bg-slate-950 text-white overflow-hidden font-sans select-none pt-48 pb-20 sm:pb-28">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B4028]/40 via-slate-950 to-slate-950 z-0" />
      <div className="absolute right-0 top-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-6">
        <nav className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          <Link to="/" className="hover:text-[#C5A059] transition-colors">Beranda</Link>
          <ChevronRight size={12} />
          <span>Tentang Kami</span>
          <ChevronRight size={12} />
          <span className="text-[#C5A059]">{breadcrumb}</span>
        </nav>
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#0B4028] border border-[#C5A059]/30 text-[#C5A059] text-[9px] font-black uppercase tracking-widest shadow-sm">
            <ShieldCheck size={12} /> {badge}
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-[#0B4028] via-[#C5A059] to-transparent opacity-80" />
    </section>
  );
};