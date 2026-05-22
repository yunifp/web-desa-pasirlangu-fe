import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { publicApi } from '../../services/publicApi';

interface MasterPostGridProps {
  sectionTitle: string;
  categorySlug: string;
  limit: number;
}

// ... interface PostItem disesuaikan
interface PostItem {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  image?: string; // Tambahkan field image
  category?: { name: string };
}

export const MasterPostGrid: React.FC<MasterPostGridProps> = ({
  categorySlug,
  limit = 3
}) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper untuk sanitasi URL gambar
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
        // Panggil endpoint tanpa /public karena sudah dikonfigurasi di publicApi
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
    <section className="py-20 bg-white border-b border-slate-100 font-sans select-none w-full">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* ... Header ... */}
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(limit)].map((_, i) => <div key={i} className="animate-pulse bg-slate-50 h-[350px] rounded-3xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white border border-slate-200 rounded-3xl flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                
                {/* 1. BAGIAN GAMBAR MUNCUL DI SINI */}
                {post.image && (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={sanitizeUrl(post.image)} 
                      alt={post.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div className="space-y-4">
                    <div className="text-[10px] font-bold text-slate-400 flex items-center gap-2">
                      <Calendar size={12} /> {new Date(post.publishedAt).toLocaleDateString('id-ID')}
                    </div>
                    <h3 className="text-sm font-black text-slate-900 line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/read/${post.slug}`)}
                    className="mt-6 flex items-center gap-2 text-xs font-bold text-[#0B4028] hover:text-[#C5A059] transition-colors"
                  >
                    Baca Selengkapnya <ArrowRight size={14} />
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