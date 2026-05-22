/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../../services/publicApi';
import { LayoutBerita } from '../../components/templates/LayoutBerita';
import { LayoutArtikel } from '../../components/templates/LayoutArtikel';
import { LayoutHalamanStatis } from '../../components/templates/LayoutHalamanStatis';
import { Loader2, ArrowLeft } from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [postData, setPostData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const res = await publicApi.get(`/posts/${slug}`);
        setPostData(res.data.data);
      } catch (err: any) {
        setError('Konten tidak ditemukan atau belum dipublikasikan secara publik.');
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchDetail();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <span className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">Loading Content</span>
      </div>
    );
  }

  if (error || !postData) {
     return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white p-6 text-center">
           <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 max-w-md">
              <h2 className="text-2xl font-black text-slate-800 mb-2">Konten Tidak Tersedia</h2>
              <p className="text-slate-500 mb-8 font-medium leading-relaxed">{error}</p>
              <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-all text-xs">
                 <ArrowLeft size={16} /> Kembali ke Beranda
              </Link>
           </div>
        </div>
     );
  }

  // ==========================================================================
  // CORE DYNAMIC TEMPLATING ENGINE
  // ==========================================================================
  const templateSlug = postData.category?.template?.slug;

  const renderTemplate = () => {
    switch (templateSlug) {
      case 'layout-berita':
        return <LayoutBerita data={postData} />;
      case 'layout-artikel':
      case 'layout-blog':
        return <LayoutArtikel data={postData} />;
      case 'layout-halaman-statis':
        return <LayoutHalamanStatis data={postData} />;
      default:
        return <LayoutBerita data={postData} />;
    }
  };

  return (
    <div className="bg-white">
      {/* Eksekusi Hasil Render Layout Murni */}
      <main>
        {renderTemplate()}
      </main>
    </div>
  );
};