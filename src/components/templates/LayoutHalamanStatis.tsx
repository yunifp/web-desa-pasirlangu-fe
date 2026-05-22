/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { getBackendMediaUrl } from '../../services/publicApi';
import { Link } from 'react-router-dom';
import {  ChevronDown, Quote } from 'lucide-react';

interface LayoutStatisProps {
  data: any;
}

export const LayoutHalamanStatis: React.FC<LayoutStatisProps> = ({ data }) => {
  const blocks = data.contentExtras?.blocks || [];
  const hasBlocks = Array.isArray(blocks) && blocks.length > 0;

  // State lokal untuk melipat/membuka Accordion FAQ per Block ID
  const [openFaq, setOpenFaq] = useState<any>({});

  const toggleFaq = (blockId: string, index: number) => {
    const key = `${blockId}-${index}`;
    setOpenFaq((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white font-sans">
      
      {/* 1. JIKA MENGGUNAKAN ENGINE MODULAR BUILDER */}
      {hasBlocks ? (
        <div className="pb-20">
          {blocks.map((block: any) => {
            
            // --- KOMPONEN 1: HERO SECTION ---
            if (block.type === 'HERO') {
              return (
                <section key={block.id} className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-28 px-6 text-center relative overflow-hidden">
                  <div className="max-w-4xl mx-auto relative z-10 animate-in fade-in duration-700">
                    {block.data.subtitle && (
                      <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 block mb-4">
                        {block.data.subtitle}
                      </span>
                    )}
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-8 leading-[1.08]">
                      {block.data.title || 'Judul Seksi Hero'}
                    </h1>
                    {block.data.ctaText && (
                      <Link 
                        to={block.data.ctaUrl || '/'} 
                        className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 text-xs uppercase tracking-widest"
                      >
                        {block.data.ctaText}
                      </Link>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/0 to-slate-900/0" />
                </section>
              );
            }

            // --- KOMPONEN 2: BANNER GAMBAR ---
            if (block.type === 'BANNER') {
              return (
                <section key={block.id} className="max-w-7xl mx-auto px-6 py-12">
                  <div className="rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 bg-slate-50 relative group">
                    {block.data.imageUrl ? (
                      <img 
                        src={getBackendMediaUrl(block.data.imageUrl)} 
                        alt="Showcase Banner" 
                        className="w-full aspect-[21/9] object-cover max-h-[550px] group-hover:scale-102 transition-transform duration-1000" 
                      />
                    ) : (
                      <div className="w-full aspect-[21/9] flex items-center justify-center text-slate-300 font-bold">
                        [Penampang Spanduk Kosong]
                      </div>
                    )}
                    {block.data.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 p-6 text-center">
                        <p className="text-white text-sm font-medium italic">{block.data.caption}</p>
                      </div>
                    )}
                  </div>
                </section>
              );
            }

            // --- KOMPONEN 3: TEXT PARAGRAF ---
            if (block.type === 'TEXT') {
              return (
                <section key={block.id} className="max-w-3xl mx-auto px-6 py-10">
                  <div 
                    className="prose prose-lg max-w-none text-slate-700 leading-relaxed font-sans prose-headings:font-black prose-headings:text-slate-900 prose-a:text-blue-600"
                    dangerouslySetInnerHTML={{ __html: block.data.content || '<p>Seksi paragraf kosong.</p>' }}
                  />
                </section>
              );
            }

            // --- KOMPONEN 4: FEATURES / PILAR GRID ---
            if (block.type === 'FEATURES') {
              const items = Array.isArray(block.data.items) ? block.data.items : [];
              return (
                <section key={block.id} className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-100 my-4">
                  <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                      {block.data.sectionTitle || 'Keunggulan Kinerja'}
                    </h2>
                    <div className="w-12 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item: any, idx: number) => (
                      <div key={idx} className="p-8 bg-slate-50/70 rounded-3xl border border-slate-200/60 hover:bg-white hover:shadow-xl transition-all duration-300">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 font-black text-sm">
                          {idx + 1}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title || 'Nama Fitur'}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed font-medium">{item.desc || 'Penjelasan mendalam...'}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            // --- KOMPONEN 5: ACCORDION FAQ ---
            if (block.type === 'ACCORDION') {
              const faqs = Array.isArray(block.data.items) ? block.data.items : [];
              return (
                <section key={block.id} className="max-w-4xl mx-auto px-6 py-16 bg-slate-50/50 rounded-[40px] border border-slate-100 my-10">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-slate-900">{block.data.sectionTitle || 'Pertanyaan Terbanyak'}</h2>
                  </div>
                  <div className="space-y-4">
                    {faqs.map((faq: any, idx: number) => {
                      const isOpen = !!openFaq[`${block.id}-${idx}`];
                      return (
                        <div key={idx} className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden transition-all shadow-2xs">
                          <button 
                            onClick={() => toggleFaq(block.id, idx)}
                            className="w-full px-6 py-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:text-blue-600 transition-colors"
                          >
                            <span className="text-base">{faq.q || 'Pertanyaan?'}</span>
                            <ChevronDown size={18} className={`transform transition-transform text-slate-400 flex-shrink-0 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-50 animate-in fade-in duration-200">
                              {faq.a || 'Jawaban akan ditampilkan di sini.'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            }

            // --- KOMPONEN 6: GALLERY GRID ---
            if (block.type === 'GALLERY') {
              const images = Array.isArray(block.data.images) ? block.data.images : [];
              return (
                <section key={block.id} className="max-w-7xl mx-auto px-6 py-16 my-4">
                  <div className="mb-10 flex items-end justify-between border-b border-slate-100 pb-4">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{block.data.sectionTitle || 'Galeri Visual'}</h2>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{images.length} Aset Terlampir</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((url: string, idx: number) => (
                      <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 group">
                        <img 
                          src={getBackendMediaUrl(url)} 
                          alt="Dokumentasi" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            // --- KOMPONEN 7: TESTIMONIALS SLIDER/GRID ---
            if (block.type === 'TESTIMONIALS') {
              const reviews = Array.isArray(block.data.items) ? block.data.items : [];
              return (
                <section key={block.id} className="max-w-6xl mx-auto px-6 py-16 bg-slate-950 text-white rounded-[40px] my-10">
                  <div className="text-center max-w-xl mx-auto mb-12">
                    <span className="text-xs font-black tracking-widest text-blue-400 uppercase block mb-2">Kepercayaan Komunitas</span>
                    <h2 className="text-3xl font-black">{block.data.sectionTitle || 'Apa Kata Klien'}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-8">
                    {reviews.map((rev: any, idx: number) => (
                      <div key={idx} className="p-8 bg-slate-900 rounded-3xl border border-slate-800 flex flex-col justify-between">
                        <Quote size={32} className="text-blue-500/30 mb-4" />
                        <p className="text-slate-300 italic leading-relaxed mb-6 font-serif text-base">
                          "{rev.quote || 'Sangat terbantu dengan implementasinya.'}"
                        </p>
                        <div className="border-t border-slate-800 pt-4 flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                            {rev.name?.[0] || 'K'}
                          </div>
                          <div>
                            <span className="text-sm font-bold block text-white">{rev.name || 'Nama Pengguna'}</span>
                            <span className="text-xs text-slate-400 block">{rev.role || 'Perusahaan'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            }

            // --- KOMPONEN 8: CTA STRIPE ---
            if (block.type === 'CTA') {
              return (
                <section key={block.id} className="bg-blue-600 text-white py-16 px-6 text-center my-12 rounded-3xl shadow-xl shadow-blue-600/10 max-w-6xl mx-auto">
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-black mb-3">{block.data.title || 'Siap Melangkah Lebih Jauh?'}</h2>
                    <p className="text-blue-100 text-sm font-medium mb-8 max-w-lg mx-auto">
                      {block.data.subtitle || 'Tim spesialis kami siap membantu merancang dan membangun ekosistem impian Anda.'}
                    </p>
                    <Link 
                      to={block.data.btnUrl || '/login'}
                      className="inline-block px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-md transition-all active:scale-95"
                    >
                      {block.data.btnText || 'Hubungi Sekarang'}
                    </Link>
                  </div>
                </section>
              );
            }

            return null;
          })}
        </div>
      ) : (
        /* FALLBACK TAMPILAN KLASIK */
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">{data.title}</h1>
            <div className="w-16 h-1.5 bg-slate-900 mx-auto rounded-full" />
          </div>
          {data.image && (
            <div className="max-w-6xl mx-auto px-4 mb-12">
              <img src={getBackendMediaUrl(data.image)} className="w-full aspect-[21/9] object-cover rounded-3xl shadow-sm" />
            </div>
          )}
          <div className="max-w-4xl mx-auto px-4">
            <div className="prose max-w-none text-slate-700 text-lg leading-loose" dangerouslySetInnerHTML={{ __html: data.content }} />
          </div>
        </div>
      )}
    </div>
  );
};