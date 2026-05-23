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
    <section className="relative w-full bg-blue-950 text-white overflow-hidden font-sans select-none pt-48 pb-24 sm:pb-32">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950/90 to-blue-900 z-0" />
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute left-[-10%] bottom-[-20%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-8">
        <nav className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-blue-200/50 uppercase">
          <Link to="/" className="hover:text-cyan-400 transition-colors">Beranda</Link>
          <ChevronRight size={12} />
          <span>Tentang Kami</span>
          <ChevronRight size={12} />
          <span className="text-cyan-400">{breadcrumb}</span>
        </nav>
        
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl rounded-tr-none bg-blue-900 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest shadow-sm">
            <ShieldCheck size={14} className="text-cyan-500" /> {badge}
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white leading-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed max-w-2xl border-l-2 border-cyan-500 pl-4">
            {description}
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-950 opacity-90 z-20" />
    </section>
  );
};