/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { usePages } from '../../hooks/usePages'; 
import { 
  Save, CheckCircle, Loader2, Globe, Mail, 
  MapPin, Phone, Link2, Share2, Plus, Trash2, Layers, Megaphone, Minus
} from 'lucide-react';

interface FooterLinkItem {
  label: string;
  url: string;
}

interface FooterColumnItem {
  title: string;
  links: FooterLinkItem[];
}

interface TopbarLinkItem {
  label: string;
  url: string;
}

export const SettingPage: React.FC = () => {
  const { uploadImageFile } = usePages(); 
  
  const [settings, setSettings] = useState<Record<string, string>>({
    site_title: '', site_tagline: '', site_footer_desc: '',
    site_email: '', site_phone: '', site_address: '',
    social_facebook: '', social_instagram: '', social_linkedin: '',
    site_logo: '', site_footer_logo: '', footer_columns: '',
    announcement_active: 'false', announcement_text: '', announcement_url: '',
    topbar_links: '', topbar_right_label: '', topbar_right_url: ''
  });

  const [footerCols, setFooterCols] = useState<FooterColumnItem[]>([]);
  
  // State untuk Builder Bar Atas
  const [topbarLinks, setTopbarLinks] = useState<TopbarLinkItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFooterLogo, setIsUploadingFooterLogo] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  const getBackendImageUrl = (pathString: string) => {
    if (!pathString) return '';
    if (pathString.startsWith('http')) return pathString;
    const backendOrigin = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/api$/, "");
    return `${backendOrigin}${pathString}`;
  };

  useEffect(() => {
    api.get('/settings')
      .then(res => {
        if (res.data?.data) {
          const data = res.data.data;
          setSettings(prev => ({ ...prev, ...data }));
          
          if (data.footer_columns) {
            try {
              const parsed = JSON.parse(data.footer_columns);
              if (Array.isArray(parsed)) setFooterCols(parsed);
            } catch (err) {
              console.error("Gagal memuat struktur builder footer", err);
            }
          }

          if (data.topbar_links) {
            try {
              const parsedTopbar = JSON.parse(data.topbar_links);
              if (Array.isArray(parsedTopbar)) setTopbarLinks(parsedTopbar);
            } catch (err) {
              console.error("Gagal memuat struktur builder topbar", err);
            }
          }
        }
      })
      .catch(err => console.error("Gagal memuat pengaturan:", err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      footer_columns: JSON.stringify(footerCols),
      topbar_links: JSON.stringify(topbarLinks)
    }));
  }, [footerCols, topbarLinks]);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  /* ----- FOOTER HANDLERS ----- */
  const handleAddColumn = () => setFooterCols(prev => [...prev, { title: 'Kolom Tautan', links: [{ label: 'Menu 1', url: '/' }] }]);
  const handleRemoveColumn = (colIdx: number) => setFooterCols(prev => prev.filter((_, i) => i !== colIdx));
  const handleUpdateColTitle = (colIdx: number, title: string) => setFooterCols(prev => prev.map((col, i) => i === colIdx ? { ...col, title } : col));
  const handleAddLinkToCol = (colIdx: number) => setFooterCols(prev => prev.map((col, i) => i === colIdx ? { ...col, links: [...col.links, { label: 'Tautan Baru', url: '/p/rute' }] } : col));
  const handleRemoveLinkFromCol = (colIdx: number, linkIdx: number) => setFooterCols(prev => prev.map((col, i) => i === colIdx ? { ...col, links: col.links.filter((_, lI) => lI !== linkIdx) } : col));
  const handleUpdateLink = (colIdx: number, linkIdx: number, prop: 'label' | 'url', val: string) => setFooterCols(prev => prev.map((col, i) => {
    if (i === colIdx) {
      const newLinks = [...col.links];
      newLinks[linkIdx] = { ...newLinks[linkIdx], [prop]: val };
      return { ...col, links: newLinks };
    }
    return col;
  }));

  /* ----- TOPBAR HANDLERS ----- */
  const handleAddTopbarLink = () => setTopbarLinks(prev => [...prev, { label: 'Afiliasi Baru', url: '#' }]);
  const handleRemoveTopbarLink = (idx: number) => setTopbarLinks(prev => prev.filter((_, i) => i !== idx));
  const handleUpdateTopbarLink = (idx: number, prop: 'label' | 'url', val: string) => {
    setTopbarLinks(prev => prev.map((link, i) => i === idx ? { ...link, [prop]: val } : link));
  };

  const handleLogoUpload = async (file: File, type: 'MAIN' | 'FOOTER') => {
    if (type === 'MAIN') setIsUploadingLogo(true);
    else setIsUploadingFooterLogo(true);

    const url = await uploadImageFile(file);
    if (url) {
      if (type === 'MAIN') handleChange('site_logo', url);
      else handleChange('site_footer_logo', url);
    }

    if (type === 'MAIN') setIsUploadingLogo(false);
    else setIsUploadingFooterLogo(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/settings/bulk', settings);
      setIsSuccessModal(true);
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal menyimpan pengaturan global.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-teal-600" size={32} /></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20 font-sans animate-in fade-in duration-300">
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Atribut Identitas & Perancang Footer</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Konfigurasi variabel identitas merek, uploader logo eksekutif, topbar, dan footer.</p>
        </div>
        <button 
          onClick={handleSubmit} disabled={isSaving}
          className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-teal-950/20 transition-all active:scale-95 flex items-center gap-2"
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Simpan Parameter
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* --- SEKSI BARU: BANNER PENGUMUMAN --- */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Megaphone size={14} className="text-[#C5A059]" /> Banner Pengumuman Navigasi
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Status Tampil</label>
              <select 
                value={settings.announcement_active || 'false'} 
                onChange={e => handleChange('announcement_active', e.target.value)}
                className="w-full border border-slate-200 p-3.5 rounded-xl text-xs font-bold outline-none focus:border-teal-600 bg-slate-50/50"
              >
                <option value="false">🔴 Sembunyikan Pengumuman</option>
                <option value="true">🟢 Tampilkan di Website</option>
              </select>
            </div>
            
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tautan Rujukan URL</label>
              <input 
                value={settings.announcement_url || ''} 
                onChange={e => handleChange('announcement_url', e.target.value)}
                className="w-full border border-slate-200 p-3.5 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-teal-600 bg-slate-50/50 shadow-2xs"
                placeholder="e.g. /p/siaran-pers atau https://..."
              />
            </div>
            
            <div className="md:col-span-2 space-y-1.5 group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Teks Pengumuman Singkat</label>
              <input 
                value={settings.announcement_text || ''} 
                onChange={e => handleChange('announcement_text', e.target.value)}
                className="w-full border border-slate-200 p-3.5 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-teal-600 bg-slate-50/50 shadow-2xs"
                placeholder="Contoh: Danantara Buka Pelatihan Semikonduktor..."
              />
            </div>
          </div>
        </div>

        {/* --- SEKSI BARU: BAR AFILIASI (TOP BAR) --- */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layers size={14} className="text-teal-600" /> Pengaturan Bar Afiliasi (Top Bar)
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sisi Kiri: Dynamic Links Afiliasi */}
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-slate-800">Daftar Afiliasi (Kiri)</span>
                <button type="button" onClick={handleAddTopbarLink} className="text-[10px] px-2 py-1 bg-teal-50 text-teal-700 font-bold rounded hover:bg-teal-100 transition-colors flex items-center gap-1">
                  <Plus size={12}/> Tambah
                </button>
              </div>
              
              {topbarLinks.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Tidak ada tautan afiliasi. Gunakan tombol Tambah.</p>
              ) : (
                <div className="space-y-2">
                  {topbarLinks.map((link, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-slate-50/80 p-2 rounded-xl border border-slate-150">
                      <input 
                        value={link.label} onChange={e => handleUpdateTopbarLink(idx, 'label', e.target.value)}
                        className="text-xs font-bold text-slate-900 bg-white border border-slate-200 p-2 rounded-lg w-1/2 outline-none focus:border-teal-600 shadow-2xs"
                        placeholder="Label Afiliasi" 
                      />
                      <input 
                        value={link.url} onChange={e => handleUpdateTopbarLink(idx, 'url', e.target.value)}
                        className="text-xs font-mono text-slate-600 bg-white border border-slate-200 p-2 rounded-lg flex-1 outline-none focus:border-teal-600 shadow-2xs"
                        placeholder="URL / #" 
                      />
                      <button type="button" onClick={() => handleRemoveTopbarLink(idx)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                        <Minus size={14}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sisi Kanan: Single Link Khusus */}
            <div className="space-y-3 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-8 pt-4 lg:pt-0">
              <span className="text-[11px] font-bold text-slate-800 mb-2 block">Tautan Aksi Cepat (Kanan)</span>
              
              <div className="space-y-1.5 group">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Label Tautan Kanan</label>
                <input 
                  value={settings.topbar_right_label || ''} 
                  onChange={e => handleChange('topbar_right_label', e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-teal-600 bg-slate-50/50"
                  placeholder="e.g. Pusat Media"
                />
              </div>

              <div className="space-y-1.5 group mt-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Destinasi URL Kanan</label>
                <input 
                  value={settings.topbar_right_url || ''} 
                  onChange={e => handleChange('topbar_right_url', e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-teal-600 bg-slate-50/50"
                  placeholder="e.g. /p/siaran-pers"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- SEKSI 1: LOGO & MEREK --- */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Globe size={14} className="text-teal-600" /> Atribut Merek Pokok
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Judul Web / Merek Korporat *</label>
              <input 
                required value={settings.site_title || ''} onChange={e => handleChange('site_title', e.target.value)}
                className="w-full border border-slate-200 p-3.5 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-teal-600 bg-slate-50/50 focus:bg-white transition-all shadow-2xs" 
                placeholder="e.g. PT PERMINAS"
              />
            </div>
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Slogan Persuasi (Tagline)</label>
              <input 
                value={settings.site_tagline || ''} onChange={e => handleChange('site_tagline', e.target.value)}
                className="w-full border border-slate-200 p-3.5 rounded-xl text-xs text-slate-800 outline-none focus:border-teal-600 bg-slate-50/50 focus:bg-white transition-all shadow-2xs" 
                placeholder="e.g. Inovasi Energi Masa Depan"
              />
            </div>

            <div className="space-y-2.5 p-4 bg-slate-50/60 rounded-2xl border border-slate-150">
              <span className="text-[11px] font-bold text-slate-800 block">Aset Visual Header (Navbar)</span>
              <div className="flex items-center gap-4">
                <div className="w-28 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden relative p-1 shadow-2xs">
                  {settings.site_logo ? (
                    <img src={getBackendImageUrl(settings.site_logo)} className="w-full h-full object-contain" />
                  ) : <span className="text-[9px] font-bold text-slate-300">Teks Murni</span>}
                  {isUploadingLogo && <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center"><Loader2 className="animate-spin text-white" size={16}/></div>}
                </div>
                <div className="flex-1 space-y-1">
                  <input type="file" accept="image/*" id="logoUp" className="hidden" onChange={e => { if(e.target.files?.[0]) handleLogoUpload(e.target.files[0], 'MAIN'); }} />
                  <label htmlFor="logoUp" className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold rounded-lg cursor-pointer block text-center shadow-2xs text-slate-700 transition-colors">Unggah Logo Header</label>
                  {settings.site_logo && <button type="button" onClick={() => handleChange('site_logo', '')} className="text-[10px] text-red-500 block text-center w-full hover:underline font-medium">Hapus Rujukan Logo</button>}
                </div>
              </div>
            </div>

            <div className="space-y-2.5 p-4 bg-slate-50/60 rounded-2xl border border-slate-150">
              <span className="text-[11px] font-bold text-slate-800 block">Aset Visual Penampang Bawah (Footer)</span>
              <div className="flex items-center gap-4">
                <div className="w-28 h-12 bg-slate-950 rounded-xl border border-slate-900 flex items-center justify-center overflow-hidden relative p-1 shadow-2xs">
                  {settings.site_footer_logo ? (
                    <img src={getBackendImageUrl(settings.site_footer_logo)} className="w-full h-full object-contain" />
                  ) : <span className="text-[9px] font-bold text-slate-600">Ikut Induk</span>}
                  {isUploadingFooterLogo && <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center"><Loader2 className="animate-spin text-white" size={16}/></div>}
                </div>
                <div className="flex-1 space-y-1">
                  <input type="file" accept="image/*" id="fLogoUp" className="hidden" onChange={e => { if(e.target.files?.[0]) handleLogoUpload(e.target.files[0], 'FOOTER'); }} />
                  <label htmlFor="fLogoUp" className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold rounded-lg cursor-pointer block text-center shadow-2xs text-slate-700 transition-colors">Unggah Logo Footer</label>
                  {settings.site_footer_logo && <button type="button" onClick={() => handleChange('site_footer_logo', '')} className="text-[10px] text-red-500 block text-center w-full hover:underline font-medium">Hapus Rujukan Logo</button>}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5 group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Deskripsi Narasi Footer</label>
              <textarea 
                value={settings.site_footer_desc || ''} onChange={e => handleChange('site_footer_desc', e.target.value)}
                className="w-full border border-slate-200 p-3.5 rounded-xl text-xs outline-none focus:border-teal-600 h-16 resize-none leading-relaxed text-slate-800 bg-slate-50/50 focus:bg-white transition-all shadow-2xs" 
                placeholder="Tuliskan atribusi korporat ringkas..."
              />
            </div>
          </div>
        </div>

        {/* --- SEKSI 2: PERANCANG KOLOM FOOTER (DYNAMIC JSON BUILDER) --- */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layers size={14} className="text-teal-600" /> Penataan Kolom Navigasi Bawah
            </h2>
            <button type="button" onClick={handleAddColumn} className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors">
              <Plus size={14}/> Tambah Kolom
            </button>
          </div>

          <div className="space-y-4">
            {footerCols.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Struktur Kolom Kosong</p>
                <p className="text-xs text-slate-500 mt-1">Sistem akan mencetak menu fallback bawaan. Rangkai kolom tautan kustom di atas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {footerCols.map((col, cIdx) => (
                  <div key={cIdx} className="border border-slate-200 rounded-2xl bg-slate-50/60 p-4 space-y-3 relative group">
                    <div className="flex items-center gap-2 pr-8">
                      <input 
                        value={col.title} onChange={e => handleUpdateColTitle(cIdx, e.target.value)}
                        className="font-bold text-xs text-slate-900 bg-white border border-slate-200 p-2.5 rounded-xl flex-1 outline-none focus:border-teal-600 shadow-2xs"
                        placeholder="Judul Kolom..." 
                      />
                      <button type="button" onClick={() => handleRemoveColumn(cIdx)} className="absolute top-3.5 right-3 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16}/>
                      </button>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-200/60">
                      {col.links.map((link, lIdx) => (
                        <div key={lIdx} className="flex gap-1.5 items-center">
                          <input 
                            value={link.label} onChange={e => handleUpdateLink(cIdx, lIdx, 'label', e.target.value)}
                            className="text-xs text-slate-800 bg-white border border-slate-200 p-2 rounded-lg w-1/3 font-bold outline-none focus:border-teal-600 shadow-2xs"
                            placeholder="Label" 
                          />
                          <input 
                            value={link.url} onChange={e => handleUpdateLink(cIdx, lIdx, 'url', e.target.value)}
                            className="text-xs text-slate-600 font-mono bg-white border border-slate-200 p-2 rounded-lg flex-1 outline-none focus:border-teal-600 shadow-2xs"
                            placeholder="/p/rute" 
                          />
                          <button type="button" onClick={() => handleRemoveLinkFromCol(cIdx, lIdx)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-colors">
                            <Trash2 size={13}/>
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => handleAddLinkToCol(cIdx)} className="text-[10px] font-bold text-teal-600 hover:underline block pt-1">
                        + Sisipkan Rute Tautan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- SEKSI 3: KONTAK & SOSIAL --- */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Komunikasi Pusat & Relasi Jejaring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors flex items-center gap-1"><Mail size={12}/> Email Operasional</label>
              <input value={settings.site_email || ''} onChange={e => handleChange('site_email', e.target.value)} className="w-full border border-slate-200 p-3 rounded-xl text-xs font-mono font-semibold text-slate-800 outline-none focus:border-teal-600 bg-slate-50/50 focus:bg-white" placeholder="contact@perminas.com" />
            </div>
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors flex items-center gap-1"><Phone size={12}/> Kontak / WhatsApp</label>
              <input value={settings.site_phone || ''} onChange={e => handleChange('site_phone', e.target.value)} className="w-full border border-slate-200 p-3 rounded-xl text-xs font-mono font-semibold text-slate-800 outline-none focus:border-teal-600 bg-slate-50/50 focus:bg-white" placeholder="+62 812-..." />
            </div>
            <div className="md:col-span-2 space-y-1.5 group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors flex items-center gap-1"><MapPin size={12}/> Alamat Kantor Pusat</label>
              <textarea value={settings.site_address || ''} onChange={e => handleChange('site_address', e.target.value)} className="w-full border border-slate-200 p-3 rounded-xl text-xs h-16 resize-none font-medium text-slate-800 outline-none focus:border-teal-600 bg-slate-50/50 focus:bg-white" placeholder="Gedung Perminas Tower..." />
            </div>
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors flex items-center gap-1"><Share2 size={12}/> Facebook URL</label>
              <input value={settings.social_facebook || ''} onChange={e => handleChange('social_facebook', e.target.value)} className="w-full border border-slate-200 p-3 rounded-xl text-xs text-slate-600 outline-none focus:border-teal-600 bg-slate-50/50 focus:bg-white font-mono" />
            </div>
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors flex items-center gap-1"><Link2 size={12}/> Instagram URL</label>
              <input value={settings.social_instagram || ''} onChange={e => handleChange('social_instagram', e.target.value)} className="w-full border border-slate-200 p-3 rounded-xl text-xs text-slate-600 outline-none focus:border-teal-600 bg-slate-50/50 focus:bg-white font-mono" />
            </div>
            <div className="md:col-span-2 space-y-1.5 group">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors flex items-center gap-1"><Share2 size={12}/> LinkedIn URL</label>
              <input value={settings.social_linkedin || ''} onChange={e => handleChange('social_linkedin', e.target.value)} className="w-full border border-slate-200 p-3 rounded-xl text-xs text-slate-600 outline-none focus:border-teal-600 bg-slate-50/50 focus:bg-white font-mono" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={isSaving} className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-slate-950/20 transition-all active:scale-95 flex items-center justify-center gap-2">
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Terapkan Sinkronisasi Atribut
        </button>
      </form>

      {isSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm text-center p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
            <CheckCircle className="text-teal-600 mx-auto mb-3" size={40} />
            <h2 className="text-base font-black text-slate-900 uppercase">Variabel Tersimpan</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Struktur parameter global serta tata letak berhasil disinkronisasi.</p>
            <button onClick={() => setIsSuccessModal(false)} className="mt-6 w-full py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-colors">Tutup Jendela</button>
          </div>
        </div>
      )}
    </div>
  );
};