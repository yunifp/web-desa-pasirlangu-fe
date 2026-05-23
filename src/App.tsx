import { useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { RolePage } from './pages/role/RolePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MenuPage } from './pages/menu/MenuPage';
import { PermissionPage } from './pages/permission/PermissionPage';
import { UserPage } from './pages/user/UserPage';
import { useAuthStore } from './store/useAuthStore';
import { SearchX, ArrowLeft } from 'lucide-react';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { TemplatePage } from './pages/appearance/TemplatePage';
import { CategoryPage } from './pages/content/CategoryPage';
import { PostPage } from './pages/content/PostPage';
import { PostFormPage } from './pages/content/PostFormPage';

// --- IMPORT HALAMAN STATIS, MEDIA & PUBLIK ---
import { PageListPage } from './pages/content/PageListPage';
import { PageFormPage } from './pages/content/PageFormPage';
import { ArticleDetailPage } from './pages/public/ArticleDetailPage';
import { StaticPageDetail } from './pages/public/StaticPageDetail';
import { PublicLayout } from './layouts/PublicLayout';
import { CategoryArchivePage } from './pages/public/CategoryArchivePage';
import { NavbarBuilderPage } from './pages/appearance/NavbarBuilderPage';
import { SettingPage } from './pages/appearance/SettingPage';
import { MediaPage } from './pages/media/MediaPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProductPage } from './pages/content/ProductPage';

// --- IMPORT MASTER HALAMAN HARDCODE KORPORAT BUMN PERMINAS ---
import { CorporateStaticPage } from './pages/public/CorporateStaticPage';
import { LandingEditorPage } from './pages/appearance/LandingEditorPage'; // Import komponen
import { ProductDetailPage } from './pages/public/ProductDetailPage';

// Halaman 404 Diselaraskan ke Tema Eksekutif PT Perminas
const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#0B4028]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#C5A059]/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-lg p-8 animate-in fade-in zoom-in duration-500">
        <div className="mb-8 flex justify-center animate-[bounce_3s_ease-in-out_infinite]">
          <div className="relative w-32 h-32 bg-white rounded-full shadow-2xl shadow-[#0B4028]/10 flex items-center justify-center border-[8px] border-slate-50">
            <SearchX size={56} className="text-[#0B4028]" />
          </div>
        </div>

        <h1 className="text-[120px] sm:text-[150px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-br from-[#0B4028] to-[#C5A059] drop-shadow-sm select-none">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-4 tracking-tight">
          Gerbang Tidak Ditemukan
        </h2>
        <p className="text-slate-500 mt-3 font-medium leading-relaxed text-sm sm:text-base">
          Rute yang Anda tuju tidak terdaftar di dalam klaster jaringan operasional PT Perusahaan Mineral Nasional (Perminas).
        </p>

        <div className="mt-8 flex items-center justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-7 py-3.5 bg-[#0B4028] hover:bg-[#0B4028]/90 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 text-xs uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={16} />
            Kembali ke Rute Aman
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { user } = useAuthStore();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const INACTIVITY_LIMIT = 30 * 60 * 1000;

  const handleLogout = useCallback(() => {
    console.warn("Sesi berakhir karena tidak ada aktivitas.");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.location.replace("/login");
  }, []);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (user) {
      timeoutRef.current = setTimeout(handleLogout, INACTIVITY_LIMIT);
    }
  }, [user, handleLogout, INACTIVITY_LIMIT]);

  useEffect(() => {
    const events = [
      'mousedown', 'mousemove', 'keypress',
      'scroll', 'touchstart', 'click'
    ];

    if (user) {
      resetTimer();

      events.forEach(event => {
        window.addEventListener(event, resetTimer);
      });
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, resetTimer]);

  return (
    <BrowserRouter>
      <Routes>
        {/* =================================================================== */}
        {/* STRUKTUR RUTE PUBLIK & HARDCODED SITEMAP PERMINAS */}
        {/* =================================================================== */}
        <Route element={<PublicLayout />}>

          {/* Beranda Induk */}
          <Route path="/" element={<Navigate to="/p/landing-page" replace />} />
          {/* Rute Khusus Pembaca Artikel & Arsip Kategori */}
          <Route path="/read/:slug" element={<ArticleDetailPage />} />
          <Route path="/kategori/:slug" element={<CategoryArchivePage />} />
          <Route path="/produk/:slug" element={<ProductDetailPage />} />

          {/* ⚡ RUTE KHUSUS CMS BUILDER: Operasi Dinamis */}
          <Route path="/operasi/:slug" element={<StaticPageDetail />} />

          {/* 🏠 PEMETAAN RUTE HARDCODE SISA KORPORAT BUMN PERMINAS */}


          {/* Klaster Keberlanjutan (ESG) */}
          <Route path="/esg/lingkungan" element={<CorporateStaticPage />} />
          <Route path="/esg/sosial" element={<CorporateStaticPage />} />
          <Route path="/esg/laporan" element={<CorporateStaticPage />} />
          <Route path="/p/lingkungan" element={<CorporateStaticPage />} />

          {/* Klaster Hubungan Investor */}
          <Route path="/investor/keuangan" element={<CorporateStaticPage />} />
          <Route path="/investor/laporan-tahunan" element={<CorporateStaticPage />} />
          <Route path="/investor/prospektus" element={<CorporateStaticPage />} />
          <Route path="/investor/gcg" element={<CorporateStaticPage />} />

          {/* Klaster Karier & Kontak */}
          <Route path="/media/galeri" element={<CorporateStaticPage />} />
          <Route path="/p/hubungi-kami" element={<CorporateStaticPage />} />

          {/* Penangkap Rute Kustom Lawas & Halaman CMS Builder Lainnya (TERMASUK SIARAN PERS) */}
          <Route path="/p/:slug" element={<StaticPageDetail />} />
          <Route path="/pages/:slug" element={<StaticPageDetail />} />
        </Route>

        {/* --- STRUKTUR RUTE AUTENTIKASI --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* --- STRUKTUR RUTE DASBOR ADMIN --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="/admin/appearance/landing" element={<LandingEditorPage />} />
            <Route path="users" element={<UserPage />} />
            <Route path="roles" element={<RolePage />} />
            <Route path="menus" element={<MenuPage />} />
            <Route path="permissions" element={<PermissionPage />} />

            <Route path="templates" element={<TemplatePage />} />
            <Route path="categories" element={<CategoryPage />} />
            <Route path="appearance/navbar" element={<NavbarBuilderPage />} />
            <Route path="appearance/settings" element={<SettingPage />} />

            <Route path="posts" element={<PostPage />} />
            <Route path="posts/create" element={<PostFormPage />} />
            <Route path="posts/edit/:id" element={<PostFormPage />} />

            <Route path="pages" element={<PageListPage />} />
            <Route path="pages/create" element={<PageFormPage />} />
            <Route path="pages/edit/:id" element={<PageFormPage />} />
            <Route path="products" element={<ProductPage />} />

            <Route path="media" element={<MediaPage />} />
          </Route>
        </Route>

        {/* Penangkap Rute Liar */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;