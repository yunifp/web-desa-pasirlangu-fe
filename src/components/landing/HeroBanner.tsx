import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=2070&auto=format&fit=crop", 
      title: "Mendorong transformasi ekonomi dan investasi global demi masa depan Indonesia",
      desc: "Mengakselerasi lompatan industrialisasi hilir dari ekstraksi mineral mentah menuju ekosistem teknologi tinggi dan logam tanah jarang berdaulat di bawah naungan BPI Danantara."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
      title: "Fasilitas Pemurnian Mineral Kritis Berstandar Internasional",
      desc: "Membangun kapasitas peleburan dan ekstraksi mutakhir guna menghasilkan Neodymium dan Praseodymium dengan tingkat kemurnian absolut untuk menyuplai transisi energi dunia."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop", 
      title: "Pusat Penggerak Ekosistem Semikonduktor & Kendaraan Listrik",
      desc: "Mengamankan posisi strategis nusantara sebagai simpul utama penyedia material magnet permanen efisiensi tinggi bagi mobilitas ramah lingkungan dan komputasi cerdas."
    }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  return (
    <section className="relative w-full h-screen min-h-[680px] max-h-[900px] bg-slate-950 overflow-hidden font-sans flex flex-col justify-end select-none">
      
      {/* Wadah Slide Efek Silang */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img 
            src={slide.image} 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[6000ms] ease-out"
          />
          {/* Lapis Hitam/Marun Gradien Penegas Teks Kiri */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
        </div>
      ))}

      {/* Konten Judul Agak Menjorok ke Kiri Bawah (Mirip Portal Pejabat Negara) */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full pb-10 sm:pb-16 pt-32">
        <div className="max-w-3xl space-y-4">
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-serif font-black text-white tracking-tight leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-700 drop-shadow-md">
            {slides[currentSlide].title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-2xl animate-in fade-in duration-1000 pt-2">
            {slides[currentSlide].desc}
          </p>

        </div>
      </div>

      {/* Lapis Dasar Hitam Transparan: Tautan Cepat Afiliasi & Titik Penggeser */}
      <div className="relative z-20 bg-black/60 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          {/* Tautan Cepat Mandat Operasional */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-white/90">
            <Link to="/tentang-kami/profil" className="hover:text-teal-400 transition-colors flex items-center gap-1 group/ql">
              Tentang Danantara Indonesia <ArrowRight size={12} className="text-white group-hover/ql:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/investor/keuangan" className="hover:text-teal-400 transition-colors flex items-center gap-1 group/ql">
              Cara Kami Mengelola Aset <ArrowRight size={12} className="text-white group-hover/ql:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/investor/prospektus" className="hover:text-teal-400 transition-colors flex items-center gap-1 group/ql">
              Cara Kami Berinvestasi <ArrowRight size={12} className="text-white group-hover/ql:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Indikator Titik (Dots) Kanan */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {slides.map((_, idx) => (
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