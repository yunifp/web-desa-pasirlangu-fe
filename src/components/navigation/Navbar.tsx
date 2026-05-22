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

  // Variabel Banner & Topbar Kanan
  const annActive = siteOptions.announcement_active === 'true';
  const annText = siteOptions.announcement_text || '';
  const annUrl = siteOptions.announcement_url || '#';
  
  const rightTopbarLabel = siteOptions.topbar_right_label || 'Pusat Media';
  const rightTopbarUrl = siteOptions.topbar_right_url || '/p/siaran-pers';

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex flex-col font-sans select-none">
      
      {/* ===================================================================== */}
      {/* LAPIS 1: STRIPE ATAS (BANNER PENGUMUMAN) */}
      {/* ===================================================================== */}
      {annActive && isBannerVisible && (
        <div className="w-full bg-[#0B4028] text-white border-b border-black/20 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between text-xs font-semibold tracking-wide">
            <div className="flex items-center gap-2.5 truncate flex-1 pr-4">
              <Megaphone size={14} className="text-[#C5A059] flex-shrink-0 animate-pulse" />
              <span className="truncate">{annText}</span>
              {annUrl.startsWith('http') ? (
                <a href={annUrl} target="_blank" rel="noreferrer" className="underline font-bold hover:text-[#C5A059] transition-colors flex-shrink-0">Selengkapnya di sini</a>
              ) : (
                <Link to={annUrl} className="underline font-bold hover:text-[#C5A059] transition-colors flex-shrink-0">Selengkapnya di sini</Link>
              )}
            </div>
            <button onClick={() => setIsBannerVisible(false)} className="p-1 hover:bg-black/20 rounded-full transition-colors flex-shrink-0 text-white/80 hover:text-white" title="Tutup">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* LAPIS 2: BAR TAJUK AFILIASI & DROPDOWN BAHASA (DINAMIS) */}
      {/* ===================================================================== */}
      <div 
        className={`hidden md:block w-full transition-colors duration-300 ${
          isScrolled 
            ? 'bg-slate-50 border-b border-slate-200 text-slate-800' 
            : 'bg-transparent border-b border-white/15 text-white/90'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-11 flex items-center justify-between text-[11px] font-bold tracking-wider">
          
          {/* Menu Afiliasi Kiri */}
          <div className="flex items-center gap-5">
            {topbarLinks.map((item, idx) => {
              const isExternal = item.url.startsWith('http');
              
              // Item pertama dibuat menonjol (font-black dengan border)
              if (idx === 0) {
                return isExternal ? (
                  <a key={idx} href={item.url} target="_blank" rel="noreferrer" className={`font-black tracking-widest flex items-center gap-1.5 border-r pr-5 transition-colors ${isScrolled ? 'text-slate-950 border-slate-300 hover:text-[#C5A059]' : 'text-white border-white/20 hover:text-[#C5A059]'}`}>
                    {item.label}
                  </a>
                ) : (
                  <Link key={idx} to={item.url} className={`font-black tracking-widest flex items-center gap-1.5 border-r pr-5 transition-colors ${isScrolled ? 'text-slate-950 border-slate-300 hover:text-[#C5A059]' : 'text-white border-white/20 hover:text-[#C5A059]'}`}>
                    {item.label}
                  </Link>
                );
              }

              // Item selanjutnya standar
              return isExternal ? (
                <a key={idx} href={item.url} target="_blank" rel="noreferrer" className="hover:text-[#C5A059] transition-colors cursor-pointer">
                  {item.label}
                </a>
              ) : (
                <Link key={idx} to={item.url} className="hover:text-[#C5A059] transition-colors cursor-pointer">
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Menu Kanan & Bahasa */}
          <div className="flex items-center gap-5">
            {rightTopbarUrl.startsWith('http') ? (
              <a href={rightTopbarUrl} target="_blank" rel="noreferrer" className={`hover:text-[#C5A059] transition-colors border-r pr-5 ${isScrolled ? 'border-slate-300' : 'border-white/20'}`}>
                {rightTopbarLabel}
              </a>
            ) : (
              <Link to={rightTopbarUrl} className={`hover:text-[#C5A059] transition-colors border-r pr-5 ${isScrolled ? 'border-slate-300' : 'border-white/20'}`}>
                {rightTopbarLabel}
              </Link>
            )}
            
            <div className={`flex items-center gap-1.5 group relative cursor-pointer py-1 border-r pr-5 ${isScrolled ? 'border-slate-300' : 'border-white/20'}`}>
              <span className="text-xs">{activeLang === 'ID' ? '🇮🇩' : '🇬🇧'}</span>
              <span className={`font-bold transition-colors group-hover:text-[#C5A059] ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                {activeLang === 'ID' ? 'Indonesia' : 'English'}
              </span>
              <ChevronDown size={12} className={`transition-transform duration-200 group-hover:rotate-180 group-hover:text-[#C5A059] ${isScrolled ? 'text-slate-400' : 'text-white/70'}`} />
              
              <div className="absolute top-full right-0 w-28 bg-white rounded-xl shadow-xl border border-slate-100 p-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 text-slate-800">
                <button onClick={() => switchLanguage('id')} className={`w-full text-left px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-colors ${activeLang === 'ID' ? 'bg-[#0B4028]/10 text-[#0B4028]' : 'hover:bg-slate-50 hover:text-[#C5A059]'}`}>🇮🇩 Indonesia</button>
                <button onClick={() => switchLanguage('en')} className={`w-full text-left px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-colors ${activeLang === 'EN' ? 'bg-[#0B4028]/10 text-[#0B4028]' : 'hover:bg-slate-50 hover:text-[#C5A059]'}`}>🇬🇧 English</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* LAPIS 3: BAR UTAMA MENU NAVIGASI */}
      {/* ===================================================================== */}
      <div 
        className={`w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' 
            : 'bg-transparent border-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            {logoUrl ? (
              <img src={getBackendImageUrl(logoUrl)} alt={siteTitle} className="h-10 w-auto object-contain max-w-[120px] transition-transform duration-300 group-hover:scale-105" />
            ) : (
              <div className={`p-2.5 rounded-xl transition-all duration-300 shadow-2xs ${isScrolled ? 'bg-[#0B4028] text-white group-hover:bg-[#C5A059]' : 'bg-white text-[#0B4028] group-hover:bg-white/90'}`}>
                <Globe size={18} />
              </div>
            )}
            <div className="flex flex-col border-l border-white/20 pl-3">
              <span className={`font-black tracking-tight text-base sm:text-lg block leading-none transition-colors duration-300 truncate max-w-[200px] ${isScrolled ? 'text-slate-900 group-hover:text-[#0B4028]' : 'text-white'}`}>
                {siteTitle}
              </span>
              <span className={`text-[8px] font-bold uppercase tracking-widest block mt-1 truncate max-w-[200px] transition-colors duration-300 ${isScrolled ? 'text-[#C5A059]' : 'text-white/70'}`}>
                {siteTagline}
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center justify-end flex-1 pr-6 gap-5.5 ml-10">
            {navTree.length > 0 ? (
              navTree.map(item => {
                const hasSub = Array.isArray(item.subMenus) && item.subMenus.length > 0;
                if (hasSub) {
                  return (
                    <div key={item.id} className="relative group py-2">
                      {item.url && item.url !== '#' ? (
                        <Link to={item.url} className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors duration-200 ${isScrolled ? 'text-slate-800 hover:text-[#C5A059]' : 'text-white/95 hover:text-[#C5A059]'}`}>
                          {item.label} <ChevronDown size={11} className={`transition-transform duration-300 group-hover:rotate-180 ${isScrolled ? 'text-slate-400 group-hover:text-[#C5A059]' : 'text-white/60 group-hover:text-[#C5A059]'}`} />
                        </Link>
                      ) : (
                        <span className={`text-[10px] font-bold uppercase tracking-widest cursor-pointer flex items-center gap-1 transition-colors duration-200 ${isScrolled ? 'text-slate-800 hover:text-[#C5A059]' : 'text-white/95 hover:text-[#C5A059]'}`}>
                          {item.label} <ChevronDown size={11} className={`transition-transform duration-300 group-hover:rotate-180 ${isScrolled ? 'text-slate-400 group-hover:text-[#C5A059]' : 'text-white/60 group-hover:text-[#C5A059]'}`} />
                        </span>
                      )}

                      <div className="absolute top-full left-0 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 text-slate-800">
                        {item.subMenus.map((sub, sIdx) => {
                          const isExt = sub.url.startsWith('http');
                          if (isExt) return <a key={sIdx} href={sub.url} target="_blank" rel="noreferrer" className="block px-3.5 py-2.5 text-[11px] font-bold text-slate-700 hover:text-[#C5A059] hover:bg-slate-50/80 rounded-xl transition-colors truncate">{sub.label} ↗</a>;
                          return <Link key={sIdx} to={sub.url} className="block px-3.5 py-2.5 text-[11px] font-bold text-slate-700 hover:text-[#C5A059] hover:bg-slate-50/80 rounded-xl transition-colors truncate">{sub.label}</Link>;
                        })}
                      </div>
                    </div>
                  );
                }
                const isExt = item.url.startsWith('http');
                if (isExt) return <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 ${isScrolled ? 'text-slate-800 hover:text-[#C5A059]' : 'text-white/95 hover:text-[#C5A059]'}`}>{item.label} ↗</a>;
                return <Link key={item.id} to={item.url} className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 ${isScrolled ? 'text-slate-800 hover:text-[#C5A059]' : 'text-white/95 hover:text-[#C5A059]'}`}>{item.label}</Link>;
              })
            ) : (
              <Link to="/" className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${isScrolled ? 'text-slate-800 hover:text-[#C5A059]' : 'text-white hover:text-[#C5A059]'}`}>Beranda</Link>
            )}
          </nav>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button onClick={() => alert("Membuka Modul Pencarian Global...")} className={`p-2 rounded-full transition-colors ${isScrolled ? 'text-slate-800 hover:bg-slate-100 hover:text-[#0B4028]' : 'text-white hover:bg-white/10 hover:text-[#C5A059]'}`} title="Cari Dokumen">
              <Search size={16} strokeWidth={2.5} />
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`p-1.5 rounded-lg md:hidden transition-colors ${isScrolled ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- LACI SELULER BERTINGKAT --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-300 max-h-[80vh] overflow-y-auto text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bahasa Portal</span>
            <div className="flex gap-2">
              <button onClick={() => switchLanguage('id')} className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${activeLang === 'ID' ? 'bg-[#0B4028] text-[#C5A059]' : 'bg-slate-100 text-slate-600'}`}>🇮🇩 ID</button>
              <button onClick={() => switchLanguage('en')} className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${activeLang === 'EN' ? 'bg-[#0B4028] text-[#C5A059]' : 'bg-slate-100 text-slate-600'}`}>🇬🇧 EN</button>
            </div>
          </div>
          
          {/* Tautan Topbar di Mode Seluler */}
          <div className="border-b border-slate-100 pb-3 space-y-2">
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Afiliasi & Eksternal</span>
             <div className="grid grid-cols-1 gap-1.5">
               {topbarLinks.map((item, idx) => (
                 <a key={idx} href={item.url} className="text-xs font-semibold text-slate-700 hover:text-[#C5A059] block truncate">{item.label}</a>
               ))}
             </div>
          </div>

          {navTree.map(item => {
            const hasSub = Array.isArray(item.subMenus) && item.subMenus.length > 0;
            const isOpen = !!openMobileDropdowns[item.id];
            if (hasSub) {
              return (
                <div key={item.id} className="space-y-2 border-b border-slate-50 pb-2">
                  <button onClick={() => toggleMobileDropdown(item.id)} className="flex items-center justify-between w-full text-left font-black text-xs text-slate-900 uppercase tracking-wide hover:text-[#0B4028] transition-colors">
                    <span>{item.label}</span>
                    <ChevronDown size={14} className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#C5A059]' : 'text-slate-400'}`} />
                  </button>
                  {isOpen && (
                    <div className="pl-3 space-y-2.5 border-l-2 border-[#C5A059]/30 pt-1.5 animate-in fade-in duration-200">
                      {item.subMenus.map((sub, sIdx) => {
                        const isExt = sub.url.startsWith('http');
                        if (isExt) return <a key={sIdx} href={sub.url} target="_blank" rel="noreferrer" className="block text-xs font-semibold text-slate-600 hover:text-[#C5A059] transition-colors">{sub.label} ↗</a>;
                        return <Link key={sIdx} onClick={() => setIsMobileMenuOpen(false)} to={sub.url} className="block text-xs font-semibold text-slate-600 hover:text-[#C5A059] transition-colors">{sub.label}</Link>;
                      })}
                    </div>
                  )}
                </div>
              );
            }
            const isExt = item.url.startsWith('http');
            if (isExt) return <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="block text-xs font-black text-slate-900 uppercase tracking-wide border-b border-slate-50 pb-2 hover:text-[#0B4028] transition-colors">{item.label} ↗</a>;
            return <Link key={item.id} onClick={() => setIsMobileMenuOpen(false)} to={item.url} className="block text-xs font-black text-slate-900 uppercase tracking-wide border-b border-slate-50 pb-2 hover:text-[#0B4028] transition-colors">{item.label}</Link>;
          })}
        </div>
      )}
    </header>
  );
};