import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface HeroSlide {
  image: string;
  title: string;
  desc: string;
}

export interface QuickLink {
  label: string;
  url: string;
}

export interface MasterHeroBannerPageProps {
  slides?: HeroSlide[];
  quickLinks?: QuickLink[];
}

export const MasterHeroBannerPage: React.FC<MasterHeroBannerPageProps> = ({ slides = [], quickLinks = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fallback data jika admin belum mengisi slide
  const displaySlides = slides.length > 0 ? slides : [
    {
      image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=2070&auto=format&fit=crop", 
      title: "Mendorong transformasi ekonomi dan investasi global demi masa depan Indonesia",
      desc: "Mengakselerasi lompatan industrialisasi hilir..."
    }
  ];

  // Fallback data jika admin belum mengisi tautan
  const displayLinks = quickLinks.length > 0 ? quickLinks : [
    { label: "Tentang Danantara Indonesia", url: "/tentang-kami/profil" },
    { label: "Cara Kami Mengelola Aset", url: "/investor/keuangan" },
    { label: "Cara Kami Berinvestasi", url: "/investor/prospektus" }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, [displaySlides.length]);

  return (
    <section className="relative w-full h-screen min-h-[680px] max-h-[900px] bg-slate-950 overflow-hidden font-sans flex flex-col justify-end select-none">
      
      {/* Wadah Slide Efek Silang */}
      {displaySlides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img 
            src={slide.image} 
            alt={`Hero Background ${index + 1}`} 
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[6000ms] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
        </div>
      ))}

      {/* Konten Judul Agak Menjorok ke Kiri Bawah */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full pb-10 sm:pb-16 pt-32">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-serif font-black text-white tracking-tight leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-700 drop-shadow-md">
            {displaySlides[currentSlide]?.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-2xl animate-in fade-in duration-1000 pt-2">
            {displaySlides[currentSlide]?.desc}
          </p>
        </div>
      </div>

      {/* Lapis Dasar Hitam Transparan: Tautan Cepat Afiliasi & Titik Penggeser */}
      <div className="relative z-20 bg-black/60 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          {/* TAUTAN CEPAT DINAMIS */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-white/90">
            {displayLinks.map((link, idx) => (
              <Link key={idx} to={link.url} className="hover:text-teal-400 transition-colors flex items-center gap-1 group/ql">
                {link.label} <ArrowRight size={12} className="text-white group-hover/ql:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>

          {/* Indikator Titik (Dots) Kanan */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {displaySlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 transition-all duration-300 rounded-full ${
                  idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Pindah ke slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>

    </section>
  );
};