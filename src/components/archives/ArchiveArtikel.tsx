import React from 'react';
import { Link } from 'react-router-dom';
import { getBackendMediaUrl } from '../../services/publicApi';
import { Sparkles, ArrowRight } from 'lucide-react';

interface ArchiveArtikelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  category: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts: any[];
}

export const ArchiveArtikel: React.FC<ArchiveArtikelProps> = ({ category, posts }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 font-sans">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-wider mb-4">
          <Sparkles size={14} /> Kategori Pilihan
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">{category?.name}</h1>
        {category?.description && (
          <p className="text-slate-500 font-medium text-base">{category.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map(post => (
          <article key={post.id} className="bg-slate-50/50 rounded-[28px] border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:bg-white transition-all duration-300 flex flex-col justify-between group">
            <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative">
              {post.image ? (
                <img 
                  src={getBackendMediaUrl(post.image)} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-300">
                  Ilustrasi Artikel
                </div>
              )}
            </div>

            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 block mb-2">
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug mb-4 font-serif">
                  {post.title}
                </h3>
              </div>

              <Link 
                to={`/read/${post.slug}`}
                className="inline-flex items-center gap-2 text-xs font-black text-slate-900 hover:text-blue-600 pt-4 border-t border-slate-200/60 w-full justify-between"
              >
                <span>BACA TULISAN</span>
                <ArrowRight size={16} className="text-blue-600" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};