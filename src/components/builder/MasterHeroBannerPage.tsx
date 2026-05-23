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

  const displaySlides = slides.length > 0 ? slides : [
    {
      image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=2070&auto=format&fit=crop", 
      title: "Mendorong transformasi ekonomi dan investasi global demi masa depan Indonesia",
      desc: "Mengakselerasi lompatan industrialisasi hilir..."
    }
  ];

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
    <section className="relative w-full h-screen min-h-[680px] max-h-[900px] bg-blue-950 overflow-hidden font-sans flex flex-col justify-end select-none">
      
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-transparent to-black/30" />
        </div>
      ))}

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full pb-12 sm:pb-16 pt-32">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-light text-white tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 drop-shadow-md">
            {displaySlides[currentSlide]?.title}
          </h1>
          <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed max-w-2xl animate-in fade-in duration-1000 pt-2 border-l-2 border-cyan-400 pl-4">
            {displaySlides[currentSlide]?.desc}
          </p>
        </div>
      </div>

      <div className="relative z-20 bg-blue-950/80 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          
          <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-white/90">
            {displayLinks.map((link, idx) => (
              <Link key={idx} to={link.url} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 group/ql">
                {link.label} <ArrowRight size={14} className="text-cyan-500 group-hover/ql:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {displaySlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 transition-all duration-300 rounded-full ${
                  idx === currentSlide ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'w-2 bg-white/30 hover:bg-white/60'
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