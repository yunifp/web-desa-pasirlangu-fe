import React from 'react';
// Mempertahankan impor gambar lokal bawaan lu secara mutlak
import BgImage from '../../assets/leader_quote.png';

export const LeaderQuoteSection: React.FC = () => {
  return (
    // Menggunakan w-full absolut tanpa padding horizontal agar gambar mentok dari tepi ke tepi (Full Bleed)
    <section className="relative w-full bg-white border-b border-slate-100 font-sans select-none overflow-hidden">
      
      {/* Wadah Spanduk Mentok Layar Penuh (Full-Width Bleed Container) */}
      <div className="relative w-full aspect-[21/9] min-h-[380px] sm:min-h-[480px] flex items-center">
        
        {/* Lapis Dasar: Gambar Spanduk Komposit Pimpinan */}
        <img 
          src={BgImage} 
          alt="Pimpinan Korporat PT Perminas" 
          className="absolute inset-0 w-full h-full object-cover object-left sm:object-center z-0"
        />

        {/* Lapis Pelindung Tipis: Menjamin kontras teks tetap tajam dan jernih di atas pegunungan sisi kanan */}
        <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/70 to-transparent w-full md:w-3/5 right-0 ml-auto z-10" />

        {/* Lapis Overlay Teks Kutipan (Melayang terpusat di area kosong sebelah kanan) */}
        <div className="relative z-20 max-w-7xl mx-auto w-full flex justify-end px-6 sm:px-12 md:px-16">
          <div className="max-w-lg space-y-4 text-left">
            
            {/* Teks Kutipan Menggunakan Tipografi Serif/Display yang Mewah dan Kokoh */}
            <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal text-slate-900 tracking-tight leading-snug">
              “Semua <strong className="font-black text-[#0B4028]">kekayaan</strong> kita harus <strong className="font-black text-[#0B4028]">sebesar-besarnya</strong> untuk kepentingan dan <strong className="font-black text-[#0B4028]">kemakmuran</strong> keluarga.”
            </blockquote>

            {/* Garis Aksen Emas Tua & Atribusi Pimpinan */}
            <div className="pt-2 space-y-0.5 border-l-2 border-[#C5A059] pl-3.5">
              <cite className="text-xs font-black text-slate-950 block not-italic uppercase tracking-wide">
                Amanat Pimpinan Eksekutif
              </cite>
              <span className="text-[10px] text-slate-600 block font-bold tracking-wider">
                PT Perusahaan Mineral Nasional (Perminas)
              </span>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};