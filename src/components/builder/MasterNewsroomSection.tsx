/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { publicApi, getBackendMediaUrl } from '../../services/publicApi';

export interface MasterNewsroomSectionProps {
  badge?: string;
  title?: string;
  linkText?: string;
  linkUrl?: string;
  categorySlug?: string;
  limit?: number;
}

export const MasterNewsroomSection: React.FC<MasterNewsroomSectionProps> = ({
  badge = "Pusat Media",
  title = "Siaran Pers & Publikasi Resmi",
  linkText = "Lihat Semua",
  linkUrl = "/p/siaran-pers",
  categorySlug = "",
  limit = 4
}) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    publicApi.get('/posts', { 
      params: { category: categorySlug || undefined, limit, status: 'PUBLISHED' } 
    })
      .then(res => setPosts(res.data?.data || []))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [categorySlug, limit]);

  return (
    <section className="py-24 bg-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 border-b-2 border-slate-100 pb-6">
          <div className="space-y-6">
            <span className="text-[11px] font-black text-cyan-600 uppercase tracking-widest block relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-12 after:h-1 after:bg-blue-900 after:rounded-full">
              {badge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-slate-700 tracking-tight leading-snug mt-6">
              {title}
            </h2>
          </div>

          {linkText && linkUrl && (
            <Link to={linkUrl} className="inline-flex items-center gap-2 text-sm font-bold text-blue-900 hover:text-cyan-600 transition-colors pb-1 flex-shrink-0 group">
              <span>{linkText}</span> <ArrowRight size={16} className="text-cyan-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-sm font-bold text-slate-400 animate-pulse">Memuat rilis berita...</div>
        ) : posts.length > 0 ? (
          <div className="flex gap-8 overflow-x-auto pb-8 pt-4 scrollbar-hide snap-x">
            {posts.map((post) => (
              <div 
                key={post.id}
                className="w-80 sm:w-96 flex-shrink-0 snap-start bg-white rounded-[2rem] rounded-tr-none border-2 border-blue-50 hover:border-cyan-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group h-[420px]"
              >
                <div className="aspect-[4/3] w-full bg-slate-100 relative overflow-hidden rounded-t-[2rem] rounded-tr-none">
                  {post.image ? (
                    <img 
                      src={getBackendMediaUrl(post.image)} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400">RILIS PERS</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-blue-950 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase shadow-sm">
                    {post.category?.name || 'Korporat'}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between bg-white rounded-b-[2rem]">
                  <h3 className="text-base font-black text-slate-800 leading-snug line-clamp-3 group-hover:text-blue-950 transition-colors">
                    {post.title}
                  </h3>

                  <div className="flex items-center justify-between pt-5 border-t border-blue-50 mt-4">
                    <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-cyan-600 transition-colors">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <Link 
                      to={`/read/${post.slug}`} 
                      className="w-8 h-8 rounded-xl bg-blue-50 group-hover:bg-cyan-500 flex items-center justify-center text-blue-900 group-hover:text-white transition-all shadow-sm group-hover:shadow-md"
                    >
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-sm text-slate-500 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            Belum ada rilis berita dari sekretariat.
          </div>
        )}

      </div>
    </section>
  );
};