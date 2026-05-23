import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';

interface MasterHeroProps {
  badgeText: string;
  title: string;
  description: string;
  breadcrumbCurrent: string;
  imgUrl?: string;
}

export const MasterHero: React.FC<MasterHeroProps> = ({
  badgeText,
  title,
  description,
  breadcrumbCurrent,
  imgUrl
}) => {
  return (
    <section className="relative w-full bg-blue-950 overflow-hidden font-sans select-none pt-40 pb-20 md:pt-48 md:pb-32 animate-in fade-in duration-500">
      
      {/* Latar Belakang Asimetris Kanan (Gambar atau Pola Biru) */}
      <div className="absolute right-0 top-0 w-full md:w-[55%] h-full z-0">
        {imgUrl ? (
          <>
            {/* Layer semi gelap tambahan khusus di atas & bawah agar teks Navbar aman */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-blue-950/20 to-blue-950/80 z-10 rounded-bl-[120px]" />
            <img 
              src={imgUrl} 
              alt={title}
              className="w-full h-full object-cover rounded-bl-[120px] shadow-2xl" 
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 to-slate-900 rounded-bl-[120px] shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-20 flex flex-col justify-center min-h-[400px]">
        
        {/* Konten Box dengan efek Glassmorphism Gelap */}
        <div className="max-w-2xl bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] rounded-tr-none shadow-2xl border border-white/10 space-y-8">
          
          {/* Rantai Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-blue-200/50 uppercase">
            <Link to="/" className="hover:text-cyan-400 transition-colors">Beranda</Link>
            <ChevronRight size={12} />
            <span>Operasi & Strategi</span>
            <ChevronRight size={12} />
            <span className="text-cyan-400">{breadcrumbCurrent}</span>
          </nav>

          {/* Tajuk Utama */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl rounded-tr-none bg-blue-950/50 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest shadow-sm">
              <Sparkles size={14} className="text-cyan-400" /> {badgeText}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white leading-snug">
              {title}
            </h1>

            <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed border-l-2 border-cyan-500 pl-4">
              {description}
            </p>
          </div>
          
        </div>
      </div>

      {/* Garis Aksen Bawah Lapis Cyan/Biru */}
      <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-400 via-blue-600 to-blue-950 opacity-90 z-30" />

    </section>
  );
};