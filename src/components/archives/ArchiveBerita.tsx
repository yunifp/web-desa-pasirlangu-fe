import React from 'react';
import { Link } from 'react-router-dom';
import { getBackendMediaUrl } from '../../services/publicApi';
import { Calendar, ChevronRight } from 'lucide-react';

interface ArchiveBeritaProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  category: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts: any[];
}

export const ArchiveBerita: React.FC<ArchiveBeritaProps> = ({ category, posts }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 font-sans">
      <div className="border-b-4 border-red-600 pb-4 mb-10 flex items-end justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-widest">Kategori Berita</span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">{category?.name}</h1>
        </div>
        <span className="text-xs font-bold text-slate-500 hidden sm:block">{posts.length} Berita Ditemukan</span>
      </div>

      <div className="divide-y divide-slate-200">
        {posts.map(post => (
          <article key={post.id} className="py-6 flex flex-col sm:flex-row gap-6 group">
            <div className="w-full sm:w-48 sm:h-32 bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
              {post.image ? (
                <img 
                  src={getBackendMediaUrl(post.image)} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400">
                  NO FOTO
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1.5">
                  <Calendar size={12} className="text-red-600" />
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                </div>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-red-600 transition-colors leading-snug mb-2">
                  {post.title}
                </h3>
              </div>

              <Link 
                to={`/read/${post.slug}`}
                className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-red-600 mt-2 w-fit uppercase tracking-wider"
              >
                Selengkapnya <ChevronRight size={14} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};