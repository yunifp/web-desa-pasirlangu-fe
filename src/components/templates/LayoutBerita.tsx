/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { getBackendMediaUrl } from '../../services/publicApi';
import { Calendar, User, Share2, Eye, Megaphone, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LayoutBeritaProps {
  data: any;
}

export const LayoutBerita: React.FC<LayoutBeritaProps> = ({ data }) => {
  // Format Tanggal Rilis Pers Jurnalistik
  const publishedDate = new Date(data.publishedAt || data.createdAt).toLocaleDateString('id-ID', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const mainImageUrl = data.image ? getBackendMediaUrl(data.image) : '';

  return (
    <article className="bg-white pb-24 font-sans selection:bg-[#C5A059] selection:text-slate-950">
      
      {/* ===================================================================
          HERO JURNALISTIK (GAMBAR LATAR PENUH & BOKS METADATA ASIMETRIS)
          =================================================================== */}
      <header className="relative pt-48 pb-16 bg-slate-950 overflow-hidden border-b border-slate-900">
        
        {/* Gambar Utama Sebagai Latar Belakang Hero Bleed */}
        {mainImageUrl ? (
          <div className="absolute inset-0 z-0">
            <img 
              src={mainImageUrl} 
              alt={data.title} 
              className="w-full h-full object-cover filter contrast-125" 
            />
            {/* Lapis Pelindung Gelap: Menjamin boks asimetris dan teks terbaca sempurna */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40 z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 z-0" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0B4028]/20 via-slate-950 to-slate-950">
            <div className="absolute top-10 right-10 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl" />
          </div>
        )}

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          
          {/* Tombol Pintasan Kembali Teratas */}
          <div className="mb-8">
            <Link 
              to="/p/siaran-pers" 
              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#C5A059] transition-colors"
            >
              <ArrowLeft size={12} /> Induk Siaran Pers
            </Link>
          </div>

          {/* Grid Layout Asimetris di Atas Panggung Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            
            {/* Kolom Kiri: Boks Kartu Identitas Rilis (Lebar 7 Kolom) */}
            <div className="lg:col-span-7 bg-slate-950/90 backdrop-blur-md text-white p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0B4028]/30 rounded-full blur-xl pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                {/* Lencana Kategori Emas Tua */}
                <div className="inline-flex items-center gap-1.5 bg-[#C5A059] text-slate-950 font-black px-3 py-1 rounded text-[9px] tracking-widest uppercase shadow-xs">
                  <Megaphone size={12} fill="currentColor" />
                  {data.category?.name || 'SIARAN PERS'}
                </div>
                
                {/* Headline Berita */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
                  {data.title}
                </h1>
              </div>

              {/* Baris Atribusi & Tanggal */}
              <div className="pt-6 border-t border-white/10 space-y-2.5 relative z-10 mt-6">
                <div className="flex items-center gap-2 text-[#C5A059] text-xs font-bold">
                  <Calendar size={14} />
                  <span>{publishedDate}</span>
                </div>
                
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <User size={12} className="flex-shrink-0" />
                    <span className="truncate font-medium uppercase tracking-wider text-white/90">
                      {data.author?.name || 'TIM REDAKSI PERMINAS'}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] bg-white/10 px-2 py-0.5 rounded text-[#C5A059] flex-shrink-0">
                    OFFICIAL
                  </span>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Takarir/Caption Foto Melayang (Lebar 5 Kolom) */}
            <div className="lg:col-span-5">
              {data.imageCaption && (
                <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg text-slate-300">
                  <p className="text-[11px] leading-relaxed flex items-start gap-2">
                    <span className="font-black text-[#C5A059] uppercase tracking-wider flex-shrink-0">FOTO:</span>
                    <span className="font-medium italic text-white/90">{data.imageCaption}</span>
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* ===================================================================
          BODI TEKS BERITA (MURNI SANS-SERIF & BOKS LEAD JURNALISTIK)
          =================================================================== */}
      <main className="max-w-3xl mx-auto px-6 pt-12">
        
        {/* Boks Rangkuman Lead Paragraf Pembuka */}
        <div className="p-5 mb-8 bg-slate-50 rounded-2xl border-l-4 border-[#C5A059] flex items-center justify-between gap-4">
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Dokumen publikasi ini disiarkan secara resmi oleh <strong className="text-slate-900 font-bold">PT Perusahaan Mineral Nasional</strong> guna menjamin keterbukaan informasi progres hilirisasi mineral strategis kepada pemangku kepentingan dan masyarakat luas.
          </p>
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs flex-shrink-0 text-slate-400 text-[10px] font-bold">
            <Eye size={12} /> Terverifikasi
          </div>
        </div>

        {/* Output Konten Utama (Sans-Serif Terang & Tajam) */}
        <div 
          className="prose prose-slate max-w-none 
            font-sans text-slate-800 text-sm sm:text-base leading-relaxed
            prose-headings:font-black prose-headings:text-slate-950 prose-headings:tracking-tight
            prose-p:mb-5 prose-p:text-justify
            prose-strong:text-slate-950 prose-strong:font-black
            prose-a:text-[#0B4028] prose-a:font-bold prose-a:underline hover:prose-a:text-[#C5A059]
            prose-img:rounded-2xl prose-img:border prose-img:border-slate-100 prose-img:shadow-md
            prose-ul:list-disc prose-ol:list-decimal"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />

        {/* Baris Tindakan Penutup */}
        <footer className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            KODE ARSIP: <span className="text-slate-700 font-mono">PR-{data.id || '2026-X'}</span>
          </span>

          <button 
            onClick={() => alert("Menyalin tautan siaran pers ke papan klip...")}
            className="px-3 py-1.5 bg-slate-50 hover:bg-[#0B4028] text-slate-700 hover:text-white rounded-lg border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Share2 size={12} /> Bagikan Rilis
          </button>
        </footer>

      </main>
    </article>
  );
};