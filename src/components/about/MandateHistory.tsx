import React from 'react';
import { Layers } from 'lucide-react';

export const MandateHistory: React.FC = () => {
  return (
    <section className="py-20 bg-white border-b border-slate-100 font-sans select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* --- STRUKTUR ATAS: JUDUL KIRI & DESKRIPSI KANAN --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Headline Kiri (Lebar 6 Kolom) */}
          <div className="lg:col-span-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 tracking-tight leading-[1.1]">
              Kami berpegang pada <strong className="font-black text-[#0B4028]">tujuan</strong> sebagai fondasi, dan menatap masa depan sebagai arah <strong className="font-black text-[#0B4028]">visi</strong> kami
            </h2>
          </div>

          {/* Paragraf Penjelas Kanan (Lebar 6 Kolom) */}
          <div className="lg:col-span-6 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <p>
              PT Perusahaan Mineral Nasional (Perminas) menjalankan mandat strategis negara dalam mengelola Badan Usaha Milik Negara (BUMN) sektor ekstraksi, dan mengoordinasikan antara Holding Operasional Logam Tanah Jarang serta Holding Investasi guna memastikan kegiatan operasional dan pemurnian selaras serta terlaksana secara efektif.
            </p>
            <p className="text-[11px] text-slate-400">
              Konsolidasi rantai pasok dari hulu ke hilir menjamin kedaulatan cadangan kritis nusantara untuk mendukung lompatan teknologi mutakhir di bawah naungan ekosistem Danantara.
            </p>
          </div>

        </div>

        {/* --- STRUKTUR BAWAH: PEMUTAR VIDEO YOUTUBE AUTOPLAY SINEMATIK --- */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-black aspect-video max-h-[600px] shadow-2xl border border-slate-900 flex items-center justify-center group">
          
          {/* YOUTUBE EMBED ENGINE 
              - autoplay=1 & mute=1: Wajib berpasangan agar video berputar otomatis di peramban modern.
              - loop=1 & playlist=[ID]: Wajib agar video berulang terus menerus.
              - controls=0: Menyembunyikan bar navigasi video agar terlihat eksklusif.
          */}
          <iframe 
            src="https://www.youtube.com/embed/BMyw1deZ17c?autoplay=1&mute=1&loop=1&playlist=BMyw1deZ17c&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3" 
            title="Video Profil Danantara - Mandat Strategis Perminas"
            className="absolute inset-0 w-full h-full pointer-events-none scale-[1.02] opacity-90 transition-opacity duration-700"
            allow="autoplay; encrypted-media"
            frameBorder="0"
          />

          {/* Lapis Pelindung (Overlay) untuk Menjamin Keterbacaan Takarir & Watermark */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10" />

          {/* Watermark Logo Sudut Kanan Atas */}
          <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
            <Layers size={12} className="text-[#C5A059]" />
            <span className="text-[10px] font-black text-white tracking-widest uppercase block leading-none">
              PT Perminas
            </span>
          </div>

          {/* Takarir/Subtitle Statis di Bagian Bawah Tengah */}
          <div className="absolute bottom-8 inset-x-0 z-20 text-center px-6">
            <p className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide drop-shadow-lg italic">
              "Kedaulatan daya anagata nusantara melalui optimasi mineral kritis."
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};