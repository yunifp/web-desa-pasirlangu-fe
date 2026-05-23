import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '../../services/publicApi';
import { Globe, Share2, Link2, Mail, Phone, MapPin } from 'lucide-react';

interface FooterLink {
  label: string;
  url: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export const Footer: React.FC = () => {
  const [options, setOptions] = useState<Record<string, string>>({});
  const [footerColumns, setFooterColumns] = useState<FooterColumn[]>([]);

  const getBackendImageUrl = (pathString: string) => {
    if (!pathString) return '';
    if (pathString.startsWith('http')) return pathString;
    const backendOrigin = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/api$/, "");
    return `${backendOrigin}${pathString}`;
  };

  useEffect(() => {
    publicApi.get('/settings').then(res => {
      const data = res.data?.data || {};
      setOptions(data);

      if (data.footer_columns) {
        try {
          const parsed = JSON.parse(data.footer_columns);
          if (Array.isArray(parsed)) setFooterColumns(parsed);
        } catch (err) {
          console.error("Gagal mem-parse JSON kolom footer:", err);
        }
      }
    });
  }, []);

  const siteTitle = options.site_title || 'PT BENTANG INSPIRA';
  const footerDesc = options.site_footer_desc || 'Memberikan solusi teknologi mutakhir dengan integrasi sistem berstandar industri tinggi untuk digitalisasi Anda.';
  const email = options.site_email || 'contact@bentanginspira.com';
  const phone = options.site_phone || '+62 812-3456-7890';
  const address = options.site_address || 'Purbalingga, Jawa Tengah, Indonesia';
  
  const targetLogoUrl = options.site_footer_logo || options.site_logo;

  return (
    <footer className="bg-[#0A1128] text-white pt-24 pb-10 border-t border-blue-900 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-blue-900/50">
        
        {/* --- BAGIAN KIRI: KONTAK & LOKASI (Tadinya Kanan) --- */}
        <div className="md:col-span-3 space-y-4">
          <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest block mb-2">
            Pusat Komunikasi
          </span>
          <div className="space-y-3 text-sm text-blue-100 font-medium">
            {address && (
              <p className="flex items-start gap-3 leading-relaxed">
                <div className="p-2 bg-blue-900 rounded-full flex-shrink-0 text-cyan-400">
                  <MapPin size={16} />
                </div>
                <span className="mt-1">{address}</span>
              </p>
            )}
            {phone && (
              <p className="flex items-center gap-3">
                <div className="p-2 bg-blue-900 rounded-full flex-shrink-0 text-cyan-400">
                  <Phone size={14} />
                </div>
                <span className="font-mono">{phone}</span>
              </p>
            )}
            {email && (
              <p className="flex items-center gap-3">
                <div className="p-2 bg-blue-900 rounded-full flex-shrink-0 text-cyan-400">
                  <Mail size={14} />
                </div>
                <span className="text-blue-300 hover:text-cyan-400 font-bold truncate transition-colors cursor-pointer">{email}</span>
              </p>
            )}
          </div>
        </div>

        {/* --- BAGIAN TENGAH: KOLOM DINAMIS BUILDER --- */}
        <div className="md:col-span-5 grid grid-cols-2 gap-8 md:pl-10">
          {footerColumns.length > 0 ? (
            footerColumns.map((col, idx) => (
              <div key={idx}>
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest block mb-5 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-blue-800">
                  {col.title}
                </span>
                <ul className="space-y-3 text-sm font-semibold text-blue-200">
                  {col.links.map((link, lIdx) => {
                    const isExternal = link.url.startsWith('http');
                    if (isExternal) {
                      return (
                        <li key={lIdx}>
                          <a href={link.url} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors block truncate">
                            {link.label} ↗
                          </a>
                        </li>
                      );
                    }
                    return (
                      <li key={lIdx}>
                        <Link to={link.url} className="hover:text-cyan-400 transition-colors block truncate hover:translate-x-1 transform duration-200">
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          ) : (
            <div>
              <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest block mb-5 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-blue-800">Akses Cepat</span>
              <ul className="space-y-3 text-sm font-semibold text-blue-200">
                <li><Link to="/" className="hover:text-cyan-400 transition-colors block hover:translate-x-1 transform duration-200">Beranda Utama</Link></li>
                <li><Link to="/p/tentang-kami" className="hover:text-cyan-400 transition-colors block hover:translate-x-1 transform duration-200">Profil Perusahaan</Link></li>
                <li><Link to="/p/layanan" className="hover:text-cyan-400 transition-colors block hover:translate-x-1 transform duration-200">Solusi & Layanan</Link></li>
              </ul>
            </div>
          )}
        </div>

        {/* --- BAGIAN KANAN: LOGO & DESKRIPSI (Tadinya Kiri, Rata Kanan) --- */}
        <div className="md:col-span-4 space-y-6 flex flex-col md:items-end text-left md:text-right">
          <Link to="/" className="flex items-center gap-3 group w-fit flex-row-reverse md:flex-row">
            {targetLogoUrl ? (
              <img 
                src={getBackendImageUrl(targetLogoUrl)} 
                alt={siteTitle} 
                className="h-10 w-auto object-contain max-w-[180px]" 
              />
            ) : (
              <>
                <span className="font-black tracking-tight text-xl uppercase text-white">{siteTitle}</span>
                <div className="p-2.5 bg-blue-600 text-white rounded-full">
                  <Globe size={20} />
                </div>
              </>
            )}
          </Link>
          
          <p className="text-blue-200/80 text-sm leading-relaxed font-medium">
            {footerDesc}
          </p>

          {/* Ikon Sosial Media (Lingkaran) */}
          <div className="flex flex-wrap items-center md:justify-end gap-3 pt-2">
            {options.social_facebook && (
              <a href={options.social_facebook} target="_blank" rel="noreferrer" title="Facebook" className="p-2.5 bg-blue-900/50 border border-blue-800 hover:bg-blue-600 hover:border-blue-500 rounded-full text-blue-300 hover:text-white transition-all transform hover:-translate-y-1">
                <Share2 size={16}/>
              </a>
            )}
            {options.social_instagram && (
              <a href={options.social_instagram} target="_blank" rel="noreferrer" title="Instagram" className="p-2.5 bg-blue-900/50 border border-blue-800 hover:bg-pink-600 hover:border-pink-500 rounded-full text-blue-300 hover:text-white transition-all transform hover:-translate-y-1">
                <Link2 size={16}/>
              </a>
            )}
            {options.social_linkedin && (
              <a href={options.social_linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="p-2.5 bg-blue-900/50 border border-blue-800 hover:bg-blue-500 hover:border-blue-400 rounded-full text-blue-300 hover:text-white transition-all transform hover:-translate-y-1">
                <Share2 size={16}/>
              </a>
            )}
          </div>
        </div>

      </div>

      {/* --- BAR ATRIBUSI BAWAH (Diubah Susunannya) --- */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row-reverse items-center justify-between gap-4 text-[11px] font-bold text-blue-400/60 uppercase tracking-widest">
        <div className="flex gap-6">
          <Link to="/p/syarat-ketentuan" className="hover:text-cyan-400 transition-colors">Syarat & Ketentuan</Link>
          <Link to="/p/kebijakan-privasi" className="hover:text-cyan-400 transition-colors">Kebijakan Privasi</Link>
        </div>
        <p className="normal-case tracking-normal">&copy; {new Date().getFullYear()} {siteTitle}. Hak Cipta Dilindungi.</p>
      </div>
    </footer>
  );
};