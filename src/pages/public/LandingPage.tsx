/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { publicApi } from '../../services/publicApi';
import { HeroBanner } from '../../components/landing/HeroBanner';
import { AboutSection } from '../../components/landing/AboutSection';
import { PurposeSection } from '../../components/landing/PurposeSection';
import { CoreMandateSection } from '../../components/landing/CoreMandateSection';
import { StrategicSectors } from '../../components/landing/StrategicSectors';
import { LeaderQuoteSection } from '../../components/landing/LeaderQuoteSection';
import { NewsroomSection } from '../../components/landing/NewsroomSection';
import { EsgImpactSection } from '../../components/landing/EsgImpactSection';
import { GlobalSupplyChain } from '../../components/landing/GlobalSupplyChain';
import { CareerApprenticeship } from '../../components/landing/CareerApprenticeship';
import { InvestorRelationsStripe } from '../../components/landing/InvestorRelationsStripe';

export const LandingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');

  const [posts, setPosts] = useState<any[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Penarikan Artikel Siaran Pers dari Engine CMS
  useEffect(() => {
    setIsLoadingPosts(true);
    const query = categoryFilter ? `?category=${categoryFilter}&limit=6` : '?limit=6';
    
    publicApi.get(`/posts${query}`)
      .then(res => setPosts(res.data.data))
      .catch(err => console.error("Gagal menyedot artikel publikasi:", err))
      .finally(() => setIsLoadingPosts(false));
  }, [categoryFilter]);

  return (
    <div className="font-sans selection:bg-[#0B4028] selection:text-white">
      
      {/* 1. Spanduk Interaktif Puncak */}
      <HeroBanner />

      {/* 2. Tentang Kami (Meniru Gambar #1) */}
      <AboutSection />

      {/* 3. Tujuan Kami Vertical Scroller (Meniru Gambar #2) */}
      <PurposeSection />

      {/* 4. Lingkup Kerja Hover Image Muncul (Meniru Gambar #3) */}
      <CoreMandateSection />

      {/* 5. Sektor Strategis Mineral Kritis (Meniru Gambar #4) */}
      <StrategicSectors />

      {/* 6. Kutipan Pimpinan Siluet PNG (Meniru Gambar #5) */}
      <LeaderQuoteSection />

      {/* 7. Sorotan Pemberitaan CMS Galeri Horizontal (Meniru Gambar #6) */}
      <NewsroomSection posts={posts} isLoading={isLoadingPosts} />

      {/* 8. Dasbor Indikator Kelestarian Lingkungan (Seksi Baru #1) */}
      <EsgImpactSection />

      {/* 9. Peta Distribusi Rantai Pasok Global (Seksi Baru #2) */}
      <GlobalSupplyChain />

      {/* 10. Pintasan Pendaftaran Magang & Karier (Seksi Baru #3) */}
      <CareerApprenticeship />

      {/* 11. Penampang Laporan Hubungan Investor (Seksi Baru #4) */}
      <InvestorRelationsStripe />

    </div>
  );
};