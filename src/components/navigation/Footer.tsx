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

      // Ekstrak dan parse JSON Footer Columns secara aman
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
  
  // Prioritaskan logo khusus footer jika ada, alternatif ke logo utama
  const targetLogoUrl = options.site_footer_logo || options.site_logo;

  return (
    <footer className="bg-slate-950 text-white pt-20 pb-12 border-t border-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-slate-900">
        
        {/* --- BAGIAN KIRI: LOGO & DESKRIPSI (SPAN 4) --- */}
        <div className="md:col-span-4 space-y-5">
          <Link to="/" className="flex items-center gap-3 group w-fit">
            {targetLogoUrl ? (
              <img 
                src={getBackendImageUrl(targetLogoUrl)} 
                alt={siteTitle} 
                className="h-10 w-auto object-contain max-w-[180px]" 
              />
            ) : (
              <>
                <div className="p-2 bg-blue-600 text-white rounded-lg">
                  <Globe size={18} />
                </div>
                <span className="font-black tracking-tight text-lg uppercase">{siteTitle}</span>
              </>
            )}
          </Link>
          
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            {footerDesc}
          </p>

          {/* Ikon Sosial Media Dinamis */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {options.social_facebook && (
              <a href={options.social_facebook} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-blue-600 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-colors">
                <Share2 size={13}/> Facebook
              </a>
            )}
            {options.social_instagram && (
              <a href={options.social_instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-pink-600 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-colors">
                <Link2 size={13}/> Instagram
              </a>
            )}
            {options.social_linkedin && (
              <a href={options.social_linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-blue-500 rounded-lg text-xs font-bold text-slate-400 hover:text-white transition-colors">
                <Share2 size={13}/> LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* --- BAGIAN TENGAH: KOLOM DINAMIS BUILDER (SPAN 5) --- */}
        <div className="md:col-span-5 grid grid-cols-2 gap-8">
          {footerColumns.length > 0 ? (
            footerColumns.map((col, idx) => (
              <div key={idx}>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">
                  {col.title}
                </span>
                <ul className="space-y-2.5 text-sm font-semibold text-slate-300">
                  {col.links.map((link, lIdx) => {
                    const isExternal = link.url.startsWith('http');
                    if (isExternal) {
                      return (
                        <li key={lIdx}>
                          <a href={link.url} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors block truncate">
                            {link.label} ↗
                          </a>
                        </li>
                      );
                    }
                    return (
                      <li key={lIdx}>
                        <Link to={link.url} className="hover:text-blue-400 transition-colors block truncate">
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          ) : (
            /* Fallback Default Jika Builder Footer Kosong */
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">Akses Cepat</span>
              <ul className="space-y-2.5 text-sm font-semibold text-slate-300">
                <li><Link to="/" className="hover:text-blue-400 transition-colors">Beranda Utama</Link></li>
                <li><Link to="/p/tentang-kami" className="hover:text-blue-400 transition-colors">Profil Perusahaan</Link></li>
                <li><Link to="/p/layanan" className="hover:text-blue-400 transition-colors">Solusi & Layanan</Link></li>
              </ul>
            </div>
          )}
        </div>

        {/* --- BAGIAN KANAN: KONTAK & LOKASI (SPAN 3) --- */}
        <div className="md:col-span-3 space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
            Pusat Komunikasi
          </span>
          <div className="space-y-2 text-sm text-slate-400 font-medium">
            {address && (
              <p className="flex items-start gap-2 leading-relaxed">
                <MapPin size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </p>
            )}
            {phone && (
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-blue-500 flex-shrink-0" />
                <span className="font-mono">{phone}</span>
              </p>
            )}
            {email && (
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-blue-500 flex-shrink-0" />
                <span className="text-blue-400 font-bold truncate">{email}</span>
              </p>
            )}
          </div>
        </div>

      </div>

      {/* --- BAR ATRIBUSI BAWAH --- */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-600">
        <p>&copy; {new Date().getFullYear()} {siteTitle}. Hak Cipta Dilindungi.</p>
        <div className="flex gap-6">
          <Link to="/p/syarat-ketentuan" className="hover:text-slate-500 transition-colors">Syarat & Ketentuan</Link>
          <Link to="/p/kebijakan-privasi" className="hover:text-slate-500 transition-colors">Kebijakan Privasi</Link>
        </div>
      </div>
    </footer>
  );
};