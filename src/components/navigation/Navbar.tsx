/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '../../services/publicApi';
import { Globe, Menu, X, ChevronDown, Megaphone, Search } from 'lucide-react';

interface SubNavItem {
  label: string;
  url: string;
}

interface DynamicNavItemObj {
  id: string;
  label: string;
  url: string;
  subMenus: SubNavItem[];
}

export const Navbar: React.FC = () => {
  const [navTree, setNavTree] = useState<DynamicNavItemObj[]>([]);
  const [siteOptions, setSiteOptions] = useState<Record<string, string>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdowns, setOpenMobileDropdowns] = useState<any>({});
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLang, setActiveLang] = useState<'ID' | 'EN'>('ID');
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  // Variabel untuk Top Bar (Bar Afiliasi)
  const [topbarLinks, setTopbarLinks] = useState<{label: string, url: string}[]>([
    { label: 'BPI Danantara', url: '#' },
    { label: 'Danantara Asset Management', url: '#' },
    { label: 'Danantara Investment Management', url: '#' }
  ]);

  const getBackendImageUrl = (pathString: string) => {
    if (!pathString) return '';
    if (pathString.startsWith('http')) return pathString;
    const backendOrigin = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/api$/, "");
    return `${backendOrigin}${pathString}`;
  };

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/id\/(en|id)/);
    if (match && match[1] === 'en') {
      setActiveLang('EN');
    } else {
      setActiveLang('ID');
    }

    publicApi.get('/settings').then(res => {
      const data = res.data?.data || {};
      setSiteOptions(data);

      if (data.public_navbar_structure) {
        try {
          const parsed = JSON.parse(data.public_navbar_structure);
          if (Array.isArray(parsed)) setNavTree(parsed);
        } catch (err) {
          console.error("Gagal mem-parse hierarki menu bertingkat:", err);
        }
      }

      if (data.topbar_links) {
        try {
          const parsedTopbar = JSON.parse(data.topbar_links);
          if (Array.isArray(parsedTopbar) && parsedTopbar.length > 0) {
            setTopbarLinks(parsedTopbar);
          }
        } catch (err) {
          console.error("Gagal mem-parse topbar links:", err);
        }
      }
    });

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLanguage = (lang: 'id' | 'en') => {
    document.cookie = `googtrans=/id/${lang}; path=/`;
    document.cookie = `googtrans=/id/${lang}; domain=${window.location.hostname}; path=/`;
    window.location.reload();
  };

  const toggleMobileDropdown = (id: string) => {
    setOpenMobileDropdowns((prev: any) => ({ ...prev, [id]: !prev[id] }));
  };

  const siteTitle = siteOptions.site_title || 'PT PERMINAS';
  const siteTagline = siteOptions.site_tagline || 'Perusahaan Mineral Nasional';
  const logoUrl = siteOptions.site_logo;

  const annActive = siteOptions.announcement_active === 'true';
  const annText = siteOptions.announcement_text || '';
  const annUrl = siteOptions.announcement_url || '#';
  
  const rightTopbarLabel = siteOptions.topbar_right_label || 'Pusat Media';
  const rightTopbarUrl = siteOptions.topbar_right_url || '/p/siaran-pers';

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex flex-col font-sans select-none">
      
      {/* ===================================================================== */}
      {/* LAPIS 1: STRIPE ATAS (BANNER PENGUMUMAN) - TEMA BIRU TUA */}
      {/* ===================================================================== */}
      {annActive && isBannerVisible && (
        <div className="w-full bg-blue-950 text-blue-50 border-b border-blue-900 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-center text-xs font-semibold tracking-wide relative">
            <div className="flex items-center gap-2.5 truncate">
              <Megaphone size={14} className="text-cyan-400 flex-shrink-0 animate-pulse" />
              <span className="truncate">{annText}</span>
              {annUrl.startsWith('http') ? (
                <a href={annUrl} target="_blank" rel="noreferrer" className="underline font-bold text-cyan-400 hover:text-white transition-colors flex-shrink-0">Selengkapnya di sini</a>
              ) : (
                <Link to={annUrl} className="underline font-bold text-cyan-400 hover:text-white transition-colors flex-shrink-0">Selengkapnya di sini</Link>
              )}
            </div>
            <button onClick={() => setIsBannerVisible(false)} className="absolute right-6 p-1 hover:bg-white/10 rounded-full transition-colors text-blue-300 hover:text-white" title="Tutup">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* LAPIS 2: BAR TAJUK (DITUKAR POSISINYA) */}
      {/* ===================================================================== */}
      <div 
        className={`hidden md:block w-full transition-colors duration-300 ${
          isScrolled 
            ? 'bg-blue-900 border-b border-blue-800 text-blue-200 shadow-sm' 
            : 'bg-transparent border-b border-white/15 text-white/90'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-11 flex items-center justify-between text-[11px] font-bold tracking-wider">
          
          {/* Menu Kiri: Bahasa & Media (Tadinya di Kanan) */}
          <div className="flex items-center gap-5">
            <div className={`flex items-center gap-1.5 group relative cursor-pointer py-1 border-r pr-5 ${isScrolled ? 'border-blue-800' : 'border-white/20'}`}>
              <span className="text-xs">{activeLang === 'ID' ? '🇮🇩' : '🇬🇧'}</span>
              <span className={`font-bold transition-colors group-hover:text-cyan-400 ${isScrolled ? 'text-blue-50' : 'text-white'}`}>
                {activeLang === 'ID' ? 'Indonesia' : 'English'}
              </span>
              <ChevronDown size={12} className={`transition-transform duration-200 group-hover:rotate-180 group-hover:text-cyan-400 ${isScrolled ? 'text-blue-400' : 'text-white/70'}`} />
              
              {/* Dropdown Bahasa Tema Gelap */}
              <div className="absolute top-full left-0 w-32 bg-blue-950 rounded-xl shadow-xl border border-blue-800 p-1.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 text-blue-100">
                <button onClick={() => switchLanguage('id')} className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-colors ${activeLang === 'ID' ? 'bg-blue-800 text-cyan-400' : 'hover:bg-blue-900 hover:text-white'}`}>🇮🇩 Indonesia</button>
                <button onClick={() => switchLanguage('en')} className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-colors ${activeLang === 'EN' ? 'bg-blue-800 text-cyan-400' : 'hover:bg-blue-900 hover:text-white'}`}>🇬🇧 English</button>
              </div>
            </div>

            {rightTopbarUrl.startsWith('http') ? (
              <a href={rightTopbarUrl} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
                {rightTopbarLabel}
              </a>
            ) : (
              <Link to={rightTopbarUrl} className="hover:text-cyan-400 transition-colors">
                {rightTopbarLabel}
              </Link>
            )}
          </div>

          {/* Menu Kanan: Afiliasi (Tadinya di Kiri) */}
          <div className="flex items-center gap-5">
            {topbarLinks.map((item, idx) => {
              const isExternal = item.url.startsWith('http');
              // Beri penanda batas kiri untuk item pertama
              if (idx === 0) {
                return isExternal ? (
                  <a key={idx} href={item.url} target="_blank" rel="noreferrer" className={`font-black tracking-widest flex items-center gap-1.5 border-l pl-5 transition-colors ${isScrolled ? 'border-blue-800 hover:text-cyan-400 text-white' : 'border-white/20 hover:text-cyan-400 text-white'}`}>
                    {item.label}
                  </a>
                ) : (
                  <Link key={idx} to={item.url} className={`font-black tracking-widest flex items-center gap-1.5 border-l pl-5 transition-colors ${isScrolled ? 'border-blue-800 hover:text-cyan-400 text-white' : 'border-white/20 hover:text-cyan-400 text-white'}`}>
                    {item.label}
                  </Link>
                );
              }

              return isExternal ? (
                <a key={idx} href={item.url} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors cursor-pointer">
                  {item.label}
                </a>
              ) : (
                <Link key={idx} to={item.url} className="hover:text-cyan-400 transition-colors cursor-pointer">
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* LAPIS 3: BAR UTAMA (BENTUK FLOATING PILL SAAT SCROLL) */}
      {/* ===================================================================== */}
      <div className={`w-full transition-all duration-500 ease-in-out ${isScrolled ? 'px-4 pt-3' : 'px-0 pt-0'}`}>
        <div 
          className={`mx-auto flex items-center justify-between transition-all duration-500 ease-in-out ${
            isScrolled 
              ? 'max-w-6xl bg-blue-950/95 backdrop-blur-md shadow-2xl border border-blue-800 rounded-full h-16 px-6' 
              : 'max-w-7xl h-20 px-6 border-transparent bg-transparent'
          }`}
        >
          {/* Logo & Judul */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            {logoUrl ? (
              <img src={getBackendImageUrl(logoUrl)} alt={siteTitle} className="h-10 w-auto object-contain max-w-[120px] transition-transform duration-300 group-hover:scale-105" />
            ) : (
              <div className={`p-2.5 rounded-full transition-all duration-300 shadow-sm ${isScrolled ? 'bg-blue-600 text-white group-hover:bg-cyan-500' : 'bg-white text-blue-900 group-hover:bg-white/90'}`}>
                <Globe size={18} />
              </div>
            )}
            <div className="flex flex-col border-l border-white/20 pl-3">
              <span className="font-black tracking-tight text-base sm:text-lg block leading-none text-white transition-colors duration-300 truncate max-w-[200px] group-hover:text-cyan-400">
                {siteTitle}
              </span>
              <span className={`text-[8px] font-bold uppercase tracking-widest block mt-1 truncate max-w-[200px] transition-colors duration-300 ${isScrolled ? 'text-cyan-400' : 'text-white/70'}`}>
                {siteTagline}
              </span>
            </div>
          </Link>

          {/* Menu Utama (Tengah/Kanan) */}
          <nav className="hidden md:flex items-center justify-end flex-1 pr-6 gap-6 ml-10">
            {navTree.length > 0 ? (
              navTree.map(item => {
                const hasSub = Array.isArray(item.subMenus) && item.subMenus.length > 0;
                if (hasSub) {
                  return (
                    <div key={item.id} className="relative group py-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest cursor-pointer flex items-center gap-1 transition-colors duration-200 text-white/90 hover:text-cyan-400">
                        {item.label} <ChevronDown size={11} className="transition-transform duration-300 group-hover:rotate-180 text-white/60 group-hover:text-cyan-400" />
                      </span>

                      {/* Dropdown Bertema Biru Tua */}
                      <div className="absolute top-[85%] left-1/2 -translate-x-1/2 w-56 bg-blue-950 rounded-2xl shadow-xl border border-blue-800 p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 z-50 text-blue-50">
                        {item.subMenus.map((sub, sIdx) => {
                          const isExt = sub.url.startsWith('http');
                          if (isExt) return <a key={sIdx} href={sub.url} target="_blank" rel="noreferrer" className="block px-4 py-3 text-[11px] font-bold hover:text-cyan-400 hover:bg-blue-900 rounded-xl transition-colors truncate">{sub.label} ↗</a>;
                          return <Link key={sIdx} to={sub.url} className="block px-4 py-3 text-[11px] font-bold hover:text-cyan-400 hover:bg-blue-900 rounded-xl transition-colors truncate">{sub.label}</Link>;
                        })}
                      </div>
                    </div>
                  );
                }
                const isExt = item.url.startsWith('http');
                if (isExt) return <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 text-white/90 hover:text-cyan-400">{item.label} ↗</a>;
                return <Link key={item.id} to={item.url} className="text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 text-white/90 hover:text-cyan-400">{item.label}</Link>;
              })
            ) : (
              <Link to="/" className="text-[10px] font-bold uppercase tracking-widest transition-colors text-white hover:text-cyan-400">Beranda</Link>
            )}
          </nav>

          {/* Tombol Aksi Kanan */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => alert("Membuka Modul Pencarian Global...")} className="p-2.5 rounded-full transition-colors text-white bg-white/10 hover:bg-cyan-500 hover:text-blue-950" title="Cari Dokumen">
              <Search size={16} strokeWidth={2.5} />
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-full md:hidden transition-colors text-white bg-white/10 hover:bg-cyan-500 hover:text-blue-950">
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- LACI SELULER TEMA GELAP --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-950 border-b border-blue-900 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300 max-h-[80vh] overflow-y-auto text-blue-50 shadow-2xl">
          
          <div className="flex items-center justify-between border-b border-blue-900 pb-4 sm:hidden">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Bahasa Portal</span>
            <div className="flex gap-2">
              <button onClick={() => switchLanguage('id')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-colors ${activeLang === 'ID' ? 'bg-blue-600 text-white' : 'bg-blue-900 text-blue-300'}`}>🇮🇩 ID</button>
              <button onClick={() => switchLanguage('en')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-colors ${activeLang === 'EN' ? 'bg-blue-600 text-white' : 'bg-blue-900 text-blue-300'}`}>🇬🇧 EN</button>
            </div>
          </div>
          
          {/* Tautan Topbar di Mode Seluler */}
          <div className="border-b border-blue-900 pb-4 space-y-3">
             <span className="text-[9px] font-bold text-cyan-500 uppercase tracking-widest block">Afiliasi & Eksternal</span>
             <div className="grid grid-cols-1 gap-2.5">
               {topbarLinks.map((item, idx) => (
                 <a key={idx} href={item.url} className="text-xs font-semibold text-blue-100 hover:text-cyan-400 block truncate">{item.label}</a>
               ))}
               <Link to={rightTopbarUrl} className="text-xs font-semibold text-blue-100 hover:text-cyan-400 block truncate">{rightTopbarLabel}</Link>
             </div>
          </div>

          <div className="pt-2 space-y-1">
            {navTree.map(item => {
              const hasSub = Array.isArray(item.subMenus) && item.subMenus.length > 0;
              const isOpen = !!openMobileDropdowns[item.id];
              if (hasSub) {
                return (
                  <div key={item.id} className="space-y-2 border-b border-blue-900/50 pb-2">
                    <button onClick={() => toggleMobileDropdown(item.id)} className="flex items-center justify-between w-full p-2 rounded-lg text-left font-black text-xs text-white uppercase tracking-wide hover:bg-blue-900 transition-colors">
                      <span>{item.label}</span>
                      <ChevronDown size={14} className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : 'text-blue-400'}`} />
                    </button>
                    {isOpen && (
                      <div className="pl-4 space-y-3 border-l-2 border-cyan-500/30 ml-2 pt-2 pb-1 animate-in fade-in duration-200">
                        {item.subMenus.map((sub, sIdx) => {
                          const isExt = sub.url.startsWith('http');
                          if (isExt) return <a key={sIdx} href={sub.url} target="_blank" rel="noreferrer" className="block text-xs font-semibold text-blue-200 hover:text-cyan-400 transition-colors">{sub.label} ↗</a>;
                          return <Link key={sIdx} onClick={() => setIsMobileMenuOpen(false)} to={sub.url} className="block text-xs font-semibold text-blue-200 hover:text-cyan-400 transition-colors">{sub.label}</Link>;
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              const isExt = item.url.startsWith('http');
              if (isExt) return <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="block p-2 rounded-lg text-xs font-black text-white uppercase tracking-wide border-b border-blue-900/50 hover:bg-blue-900 transition-colors">{item.label} ↗</a>;
              return <Link key={item.id} onClick={() => setIsMobileMenuOpen(false)} to={item.url} className="block p-2 rounded-lg text-xs font-black text-white uppercase tracking-wide border-b border-blue-900/50 hover:bg-blue-900 transition-colors">{item.label}</Link>;
            })}
          </div>
        </div>
      )}
    </header>
  );
};