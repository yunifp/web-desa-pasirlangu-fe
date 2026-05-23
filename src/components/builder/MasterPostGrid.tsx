import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { publicApi } from '../../services/publicApi';

interface MasterPostGridProps {
  sectionTitle: string;
  categorySlug: string;
  limit: number;
}

interface PostItem {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  image?: string;
  category?: { name: string };
}

export const MasterPostGrid: React.FC<MasterPostGridProps> = ({
  categorySlug,
  limit = 3
}) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const sanitizeUrl = (url?: string) => {
    if (!url) return '';
    const cleanUrl = url.trim();
    if (cleanUrl.startsWith('http')) return cleanUrl;
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/api$/, '').replace(/\/$/, '');
    return `${baseUrl}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
  };

  useEffect(() => {
    const fetchDynamicPosts = async () => {
      try {
        setLoading(true);
        const response = await publicApi.get(`/posts`, {
          params: { category: categorySlug, limit: limit }
        });
        const data = response.data?.data || response.data || [];
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Gagal memuat postingan:", error);
      } finally {
        setLoading(false);
      }
    };
    if (categorySlug) fetchDynamicPosts();
  }, [categorySlug, limit]);

  return (
    <section className="py-24 bg-slate-50 font-sans select-none w-full">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(limit)].map((_, i) => <div key={i} className="animate-pulse bg-blue-100/50 h-[400px] rounded-[2rem] rounded-tr-none border border-blue-50" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white border-2 border-blue-50 rounded-[2rem] rounded-tr-none flex flex-col overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-cyan-100 transition-all duration-300 group cursor-pointer" onClick={() => navigate(`/read/${post.slug}`)}>
                
                {post.image && (
                  <div className="w-full h-52 overflow-hidden relative">
                    <img 
                      src={sanitizeUrl(post.image)} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-blue-950/10 group-hover:bg-transparent transition-colors duration-300" />
                  </div>
                )}

                <div className="p-8 flex flex-col justify-between flex-grow bg-white">
                  <div className="space-y-4">
                    <div className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-cyan-600 transition-colors flex items-center gap-2">
                      <Calendar size={14} /> {new Date(post.publishedAt).toLocaleDateString('id-ID')}
                    </div>
                    <h3 className="text-base font-black text-slate-800 line-clamp-2 group-hover:text-blue-950 transition-colors leading-snug">
                      {post.title}
                    </h3>
                  </div>
                  
                  <button 
                    className="mt-8 flex items-center gap-2 text-xs font-black text-blue-900 group-hover:text-cyan-600 transition-colors"
                  >
                    Baca Selengkapnya <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};