/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { getBackendMediaUrl } from '../../services/publicApi';
import { Award, Clock, Calendar, Share2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LayoutArtikelProps {
  data: any;
}

export const LayoutArtikel: React.FC<LayoutArtikelProps> = ({ data }) => {
  // Format Tanggal Formal
  const publishedDate = new Date(data.publishedAt || data.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const mainImageUrl = data.image ? getBackendMediaUrl(data.image) : '';

  return (
    <div className="bg-white pb-24 font-sans selection:bg-[#0B4028] selection:text-white">
      
      {/* ===============================================================
          BAGIAN 1: HERO & HEADER ARTIKEL (GAMBAR LATAR & JUDUL)
          =============================================================== */}
      <header className="relative pt-52 pb-12 overflow-hidden bg-slate-950 text-white selection:bg-[#C5A059] selection:text-slate-950">
        {/* Gambar Utama Sebagai Latar Belakang Hero dengan Layer Gelap */}
        {mainImageUrl && (
          <div className="absolute inset-0 z-0">
            <img 
              src={mainImageUrl} 
              alt={data.title} 
              className="w-full h-full object-cover" 
            />
            {/* Layer Gelap: Gradien dan Solid Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/90 z-0" />
            <div className="absolute inset-0 bg-slate-950/60 z-0" />
          </div>
        )}

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          {/* Tombol Kembali & Kategori */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <Link 
              to="/" 
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#C5A059] transition-colors"
            >
              <ArrowLeft size={12} /> Kembali ke Publikasi
            </Link>
            
            <div className="inline-flex items-center gap-2 bg-[#0B4028] text-[#C5A059] px-4 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shadow-sm border border-[#C5A059]/20">
              <Award size={12} /> {data.category?.name || 'Rilis Pers'}
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
            {data.title}
          </h1>

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-6 border-t border-slate-700/60 relative">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#C5A059]" /> {publishedDate}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#C5A059]" /> 4 Menit Baca
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#0B4028] text-white rounded-full flex items-center justify-center text-[8px] font-black shadow-sm border border-[#C5A059]/20">
                {data.author?.name?.[0] || 'P'}
              </div>
              <span className="text-slate-200">{data.author?.name || 'Sekretariat Perusahaan'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ===============================================================
          BAGIAN 2: BODI KONTEN (CONTENT)
          =============================================================== */}
      <main className="max-w-3xl mx-auto px-6 pt-16">
        {/* Konten Utama */}
        <article 
          className="prose prose-slate prose-lg max-w-none 
            font-serif text-slate-700 leading-relaxed
            prose-headings:font-sans prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900
            prose-strong:text-slate-900 prose-strong:font-black
            prose-p:mb-6
            prose-a:text-[#0B4028] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-3xl prose-img:shadow-lg
            prose-blockquote:border-l-4 prose-blockquote:border-[#C5A059] prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />

        {/* Footer Artikel: Share & Tags */}
        <footer className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bagikan:</span>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#0B4028] hover:text-white transition-all">
                <Share2 size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 w-full sm:w-auto">
             <div className="w-10 h-10 bg-[#0B4028] text-[#C5A059] rounded-xl flex items-center justify-center shadow-md">
                <Award size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-900 uppercase leading-none">Dokumen Publik Resmi</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">PT Perusahaan Mineral Nasional</p>
             </div>
          </div>
        </footer>
      </main>
    </div>
  );
};