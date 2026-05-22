import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase } from 'lucide-react';

export const CareerApprenticeship: React.FC = () => {
  return (
    // Menggunakan w-full murni tanpa max-w pembatas agar latar membentang absolut (Full Bleed)
    <section className="relative w-full py-24 bg-slate-950 text-white font-sans overflow-hidden border-b border-slate-900">
      
      {/* Pendar Latar Belakang Eksklusif */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B4028]/20 via-slate-950 to-slate-950 z-0" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Kontainer Isi Tetap Terpusat Rapi */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
        
        {/* Kolom Kiri: Deskripsi Karier */}
        <div className="space-y-4 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-md text-[#C5A059] text-[10px] font-black uppercase tracking-widest">
            <Briefcase size={12} /> Rekrutmen BUMN
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight text-white">
            Karier Profesional & Magang Vokasi
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Bergabunglah bersama kami membangun kedaulatan industri hilir mineral. Terbuka peluang magang bersertifikat resmi bagi mahasiswa tingkat akhir dan siswa SMK/Politeknik keahlian teknik kimia serta metalurgi.
          </p>
        </div>

        {/* Kolom Kanan: Tombol Aksi Mewah */}
        <div className="flex-shrink-0">
          <Link 
            to="/karier/lowongan" 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#C5A059] hover:bg-white text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-[#C5A059]/20 transition-all transform hover:-translate-y-0.5"
          >
            <span>Eksplorasi Posisi</span> 
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>

      </div>

      {/* Garis Batas Emas Tua di Dasar Penampang */}
      <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#0B4028] via-[#C5A059] to-transparent opacity-60" />

    </section>
  );
};