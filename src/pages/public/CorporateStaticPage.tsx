import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';

// --- IMPOR KOMPONEN HALAMAN PROFIL PERUSAHAAN (TETAP STATIS) ---
import { ProfileHero } from '../../components/about/ProfileHero';
import { MandateHistory } from '../../components/about/MandateHistory';
import { CoreValuesGrid } from '../../components/about/CoreValuesGrid';
import { LeadershipTeam } from '../../components/about/LeadershipTeam';
import { GovernanceStructure } from '../../components/about/GovernanceStructure';
import { CertificationsAwards } from '../../components/about/CertificationsAwards';

export const CorporateStaticPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // Gulir layar otomatis ke puncak setiap perpindahan URL
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  // Logika Render Konten Berdasarkan URL Sitemap
  const renderCorporateContent = () => {
    
    // ========================================================================
    // KLASTER 2.0: TENTANG KAMI (PROFIL PERUSAHAAN TETAP STATIS)
    // ========================================================================
    if (path.includes('/tentang-kami/profil') || path.includes('/p/profil-perusahaan')) {
      return (
        <div className="w-full font-sans">
          <ProfileHero />
          <MandateHistory />
          <CoreValuesGrid />
          <LeadershipTeam />
          <GovernanceStructure />
          <CertificationsAwards />
        </div>
      );
    }

    // ========================================================================
    // FALLBACK PREMIUM UNTUK HALAMAN SITEMAP STATIS LAINNYA
    // Catatan: 4 Pilar Operasi kini dikendalikan penuh oleh StaticPageDetail.tsx 
    // melalui rute dinamis CMS hasil injeksi Prisma Seeder.
    // ========================================================================
    const pageTitleClean = path.split('/').pop()?.replace(/-/g, ' ') || 'Laman Informasi';

    return (
      <div className="min-h-[80vh] pt-32 pb-24 bg-slate-50 flex items-center justify-center p-6 font-sans select-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0B4028]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-[#0B4028] text-[#C5A059] rounded-2xl flex items-center justify-center mx-auto shadow-md border border-[#C5A059]/20">
            <FileText size={32} />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-slate-200">
              <ShieldCheck size={12} className="text-[#0B4028]" /> Klaster Dokumen Resmi
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight capitalize leading-tight">
              {pageTitleClean}
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-lg mx-auto border-t border-slate-100 pt-6">
            Penampang informasi eksekutif <strong className="text-slate-900 font-bold">PT Perusahaan Mineral Nasional (Perminas)</strong>. Struktur data halaman ini sedang diselaraskan secara dinamis dengan arsitektur sitemap korporat di bawah supervisi BPI Danantara.
          </p>

          <div className="pt-2 flex justify-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B4028] hover:bg-[#0B4028]/90 text-white font-black text-xs uppercase tracking-widest shadow-md transition-all active:scale-95"
            >
              <ArrowLeft size={14} /> <span>Kembali ke Beranda Utama</span>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {renderCorporateContent()}
    </div>
  );
};