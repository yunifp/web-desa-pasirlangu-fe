/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Link } from 'react-router-dom';
import { getBackendMediaUrl } from '../../services/publicApi';
import { Loader2, ArrowRight, ChevronRight, Cpu } from 'lucide-react';

export const Newsroom: React.FC<{ posts: any[]; isLoading: boolean }> = ({ posts, isLoading }) => {
  return (
    <section className="py-24 bg-slate-50/50 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b border-slate-200/60 pb-6">
          <div>
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest block mb-2">
              Keterbukaan Informasi
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Sorotan Berita & Pencapaian Terbaru
            </h2>
          </div>
          <Link to="/kategori/siaran-pers" className="text-xs font-bold text-slate-600 hover:text-teal-600 transition-colors flex items-center gap-1">
            Lihat Seluruh Siaran Pers <ArrowRight size={12} className="text-teal-600" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-teal-600 mb-3" size={36} />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Menarik arsip siaran pers...</span>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <article key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-xs border border-slate-200/70 hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                
                <div className="aspect-video w-full bg-slate-100 overflow-hidden relative">
                  {post.image ? (
                    <img 
                      src={getBackendMediaUrl(post.image)} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400 bg-slate-50">
                      PT PERMINAS RILIS
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-slate-950 text-white text-[9px] font-black px-2.5 py-1 rounded shadow-2xs uppercase tracking-wider">
                    {post.category?.name || 'Korporat'}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block mb-2 font-mono">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-teal-600 transition-colors leading-relaxed mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                  </div>

                  <Link 
                    to={`/read/${post.slug}`} 
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-600 hover:text-teal-700 pt-3 border-t border-slate-100 w-fit mt-3 group/btn"
                  >
                    Baca Ulasan Resmi <ChevronRight size={13} className="group-hover/btn:translate-x-1 transition-transform text-slate-400 group-hover/btn:text-teal-600" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 max-w-lg mx-auto space-y-2">
            <Cpu className="mx-auto text-slate-300" size={40} />
            <p className="text-slate-800 font-bold text-xs">Arsip Berita Sedang Diselaraskan</p>
            <p className="text-slate-400 text-xs">Penerbitan artikel rilis perdana BUMN Perminas akan segera didistribusikan oleh sekretariat perusahaan.</p>
          </div>
        )}

      </div>
    </section>
  );
};