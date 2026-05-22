import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../../services/publicApi';
import { ArchiveBerita } from '../../components/archives/ArchiveBerita';
import { ArchiveArtikel } from '../../components/archives/ArchiveArtikel';
import { Loader2 } from 'lucide-react';

export const CategoryArchivePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [posts, setPosts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categoryMeta, setCategoryMeta] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArchive = async () => {
      setIsLoading(true);
      try {
        // Ambil data artikel yang terfilter khusus kategori ini
        const resPosts = await publicApi.get(`/posts?category=${slug}&limit=20`);
        setPosts(resPosts.data.data);

        // Ambil detail metadata kategori untuk membaca instruksi slug template-nya
        const resCats = await publicApi.get('/categories');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const targetCat = resCats.data.data.find((c: any) => c.slug === slug);
        if (targetCat) setCategoryMeta(targetCat);

      } catch (err) {
        console.error("Gagal memuat arsip kategori", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchArchive();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!categoryMeta) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Kategori Kosong</h2>
        <p className="text-slate-500 mb-6 font-medium">Kategori ini tidak ditemukan atau belum memiliki publikasi aktif.</p>
        <Link to="/" className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs">Kembali ke Beranda</Link>
      </div>
    );
  }

  // ==========================================================================
  // DYNAMIC RENDERING UNTUK ARSIP/FEED KATEGORI
  // ==========================================================================
  const templateSlug = categoryMeta.template?.slug;

  const renderArchiveLayout = () => {
    switch (templateSlug) {
      case 'layout-berita':
        // Jika kategori diikat ke layout berita, tampilkan list view ringkas
        return <ArchiveBerita category={categoryMeta} posts={posts} />;
      
      case 'layout-artikel':
      case 'layout-blog':
        // Jika kategori diikat ke layout artikel, tampilkan grid view mewah
        return <ArchiveArtikel category={categoryMeta} posts={posts} />;
      
      default:
        // Default mutlak
        return <ArchiveBerita category={categoryMeta} posts={posts} />;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {renderArchiveLayout()}
    </div>
  );
};