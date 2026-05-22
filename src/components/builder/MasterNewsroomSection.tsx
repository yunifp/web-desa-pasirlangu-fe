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
    <section className="py-24 bg-white border-b border-slate-100 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        
        <div className="flex justify-between items-end border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{badge}</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {title}
            </h2>
          </div>

          {linkText && linkUrl && (
            <Link to={linkUrl} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B4028] hover:text-[#C5A059] transition-colors pb-1 flex-shrink-0">
              <span>{linkText}</span> <ArrowRight size={14} className="text-[#C5A059]" />
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-xs font-bold text-slate-400">Memuat rilis berita...</div>
        ) : posts.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide snap-x">
            {posts.map((post) => (
              <div 
                key={post.id}
                className="w-80 sm:w-96 flex-shrink-0 snap-start bg-slate-50 rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs flex flex-col justify-between group h-[420px]"
              >
                <div className="aspect-[4/3] w-full bg-slate-100 relative overflow-hidden">
                  {post.image ? (
                    <img 
                      src={getBackendMediaUrl(post.image)} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400">RILIS PERS</div>
                  )}
                  <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[8px] font-bold px-2 py-0.5 rounded uppercase">
                    {post.category?.name || 'Korporat'}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between bg-white border-t border-slate-100">
                  <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-3 group-hover:text-[#0B4028] transition-colors">
                    {post.title}
                  </h3>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <Link 
                      to={`/read/${post.slug}`} 
                      className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition-colors shadow-sm"
                    >
                      <ArrowRight size={12} strokeWidth={3} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-400">Belum ada rilis berita dari sekretariat.</div>
        )}

      </div>
    </section>
  );
};