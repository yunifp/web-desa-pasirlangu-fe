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

  if (isLoading) return <div className="py-24 text-center"><Loader2 className="animate-spin mx-auto text-cyan-500" size={40} /></div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10 font-sans animate-in fade-in duration-300">
      
      <div className="bg-white p-6 lg:p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:border-cyan-100 transition-colors">
        <div>
          <h1 className="text-2xl lg:text-3xl font-light text-slate-800 tracking-tight">Atribut Identitas & Footer</h1>
          <p className="text-sm text-slate-500 font-medium mt-2">Konfigurasi variabel identitas merek, uploader logo eksekutif, topbar, dan footer.</p>
        </div>
        <button 
          onClick={handleSubmit} disabled={isSaving}
          className="bg-blue-950 hover:bg-blue-900 text-white px-6 py-3.5 rounded-2xl rounded-tr-none flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all font-black text-xs uppercase tracking-widest active:scale-95 group/btn"
        >
          {isSaving ? <Loader2 className="animate-spin text-cyan-400" size={16} /> : <Save size={16} className="text-cyan-400 group-hover/btn:rotate-12 transition-transform" />} Simpan Parameter
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* --- SEKSI BARU: BANNER PENGUMUMAN --- */}
        <div className="bg-white p-6 lg:p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm space-y-6 hover:border-cyan-100 transition-colors">
          <div className="border-b-2 border-blue-50 pb-4">
            <h2 className="text-sm font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
              <Megaphone size={16} className="text-cyan-500" /> Banner Pengumuman Navigasi
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Status Tampil</label>
              <select 
                value={settings.announcement_active || 'false'} 
                onChange={e => handleChange('announcement_active', e.target.value)}
                className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all"
              >
                <option value="false">🔴 Sembunyikan Pengumuman</option>
                <option value="true">🟢 Tampilkan di Website</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Tautan Rujukan URL</label>
              <input 
                value={settings.announcement_url || ''} 
                onChange={e => handleChange('announcement_url', e.target.value)}
                className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-mono text-slate-800 shadow-sm transition-all"
                placeholder="e.g. /p/siaran-pers atau https://..."
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Teks Pengumuman Singkat</label>
              <input 
                value={settings.announcement_text || ''} 
                onChange={e => handleChange('announcement_text', e.target.value)}
                className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-900 shadow-sm transition-all"
                placeholder="Contoh: Info Pemilihan Kepala Desa..."
              />
            </div>
          </div>
        </div>

        {/* --- SEKSI BARU: BAR AFILIASI (TOP BAR) --- */}
        <div className="bg-white p-6 lg:p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm space-y-6 hover:border-cyan-100 transition-colors">
          <div className="border-b-2 border-blue-50 pb-4 flex justify-between items-center">
            <h2 className="text-sm font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
              <Layers size={16} className="text-cyan-500" /> Pengaturan Bar Afiliasi (Top Bar)
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black text-slate-800">Daftar Afiliasi (Kiri)</span>
                <button type="button" onClick={handleAddTopbarLink} className="text-[10px] px-3 py-1.5 bg-cyan-50 text-cyan-600 border border-cyan-100 font-black rounded-lg hover:bg-cyan-100 transition-colors flex items-center gap-1 uppercase tracking-widest">
                  <Plus size={12}/> Tambah
                </button>
              </div>
              
              {topbarLinks.length === 0 ? (
                <p className="text-xs text-slate-400 italic font-medium p-4 bg-slate-50 border-2 border-dashed border-blue-100 rounded-2xl rounded-tr-none text-center">Tidak ada tautan afiliasi. Gunakan tombol Tambah.</p>
              ) : (
                <div className="space-y-3">
                  {topbarLinks.map((link, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-blue-50/50 p-3 rounded-2xl border border-blue-100">
                      <input 
                        value={link.label} onChange={e => handleUpdateTopbarLink(idx, 'label', e.target.value)}
                        className="text-xs font-bold text-slate-900 bg-white border border-blue-100 p-2.5 rounded-xl w-1/2 outline-none focus:border-cyan-500 shadow-sm"
                        placeholder="Label Afiliasi" 
                      />
                      <input 
                        value={link.url} onChange={e => handleUpdateTopbarLink(idx, 'url', e.target.value)}
                        className="text-xs font-mono text-cyan-600 bg-white border border-blue-100 p-2.5 rounded-xl flex-1 outline-none focus:border-cyan-500 shadow-sm"
                        placeholder="URL / #" 
                      />
                      <button type="button" onClick={() => handleRemoveTopbarLink(idx)} className="p-2.5 text-slate-400 hover:text-white hover:bg-red-500 bg-white border border-slate-200 rounded-xl transition-colors shadow-sm">
                        <Minus size={14}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4 border-t-2 lg:border-t-0 lg:border-l-2 border-blue-50 lg:pl-8 pt-6 lg:pt-0">
              <span className="text-xs font-black text-slate-800 mb-2 block">Tautan Aksi Cepat (Kanan)</span>
              
              <div>
                <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Label Tautan Kanan</label>
                <input 
                  value={settings.topbar_right_label || ''} 
                  onChange={e => handleChange('topbar_right_label', e.target.value)}
                  className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-900 shadow-sm transition-all"
                  placeholder="e.g. Pusat Media"
                />
              </div>

              <div className="mt-4">
                <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Destinasi URL Kanan</label>
                <input 
                  value={settings.topbar_right_url || ''} 
                  onChange={e => handleChange('topbar_right_url', e.target.value)}
                  className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-mono text-slate-800 shadow-sm transition-all"
                  placeholder="e.g. /p/siaran-pers"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- SEKSI 1: LOGO & MEREK --- */}
        <div className="bg-white p-6 lg:p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm space-y-6 hover:border-cyan-100 transition-colors">
          <div className="border-b-2 border-blue-50 pb-4">
            <h2 className="text-sm font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
              <Globe size={16} className="text-cyan-500" /> Atribut Merek Pokok
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Judul Web / Merek Korporat *</label>
              <input 
                required value={settings.site_title || ''} onChange={e => handleChange('site_title', e.target.value)}
                className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-900 shadow-sm transition-all" 
                placeholder="e.g. DESA PASIRLANGU"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Slogan Persuasi (Tagline)</label>
              <input 
                value={settings.site_tagline || ''} onChange={e => handleChange('site_tagline', e.target.value)}
                className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all" 
                placeholder="e.g. Inovasi Desa Digital"
              />
            </div>

            <div className="space-y-3 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 shadow-sm">
              <span className="text-xs font-black text-blue-950 block uppercase tracking-widest">Aset Visual Header (Navbar)</span>
              <div className="flex items-center gap-5">
                <div className="w-32 h-16 bg-white rounded-xl border border-blue-200 flex items-center justify-center overflow-hidden relative p-1 shadow-sm">
                  {settings.site_logo ? (
                    <img src={getBackendImageUrl(settings.site_logo)} className="w-full h-full object-contain" />
                  ) : <span className="text-[10px] font-black text-slate-300 uppercase">Teks Murni</span>}
                  {isUploadingLogo && <div className="absolute inset-0 bg-blue-950/60 flex items-center justify-center"><Loader2 className="animate-spin text-white" size={16}/></div>}
                </div>
                <div className="flex-1 space-y-2">
                  <input type="file" accept="image/*" id="logoUp" className="hidden" onChange={e => { if(e.target.files?.[0]) handleLogoUpload(e.target.files[0], 'MAIN'); }} />
                  <label htmlFor="logoUp" className="px-4 py-2.5 bg-white border border-blue-200 hover:bg-blue-50 hover:border-cyan-400 text-xs font-black rounded-xl cursor-pointer block text-center shadow-sm text-blue-950 transition-colors uppercase tracking-widest">Unggah Logo</label>
                  {settings.site_logo && <button type="button" onClick={() => handleChange('site_logo', '')} className="text-[10px] font-black uppercase text-red-500 block text-center w-full hover:underline tracking-widest">Hapus Rujukan</button>}
                </div>
              </div>
            </div>

            <div className="space-y-3 p-5 bg-slate-900 rounded-2xl border border-slate-800 shadow-sm">
              <span className="text-xs font-black text-white block uppercase tracking-widest">Aset Visual Penampang Bawah (Footer)</span>
              <div className="flex items-center gap-5">
                <div className="w-32 h-16 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden relative p-1 shadow-sm">
                  {settings.site_footer_logo ? (
                    <img src={getBackendImageUrl(settings.site_footer_logo)} className="w-full h-full object-contain" />
                  ) : <span className="text-[10px] font-black text-slate-600 uppercase">Ikut Induk</span>}
                  {isUploadingFooterLogo && <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center"><Loader2 className="animate-spin text-cyan-400" size={16}/></div>}
                </div>
                <div className="flex-1 space-y-2">
                  <input type="file" accept="image/*" id="fLogoUp" className="hidden" onChange={e => { if(e.target.files?.[0]) handleLogoUpload(e.target.files[0], 'FOOTER'); }} />
                  <label htmlFor="fLogoUp" className="px-4 py-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-black rounded-xl cursor-pointer block text-center shadow-sm text-white transition-colors uppercase tracking-widest">Unggah Footer</label>
                  {settings.site_footer_logo && <button type="button" onClick={() => handleChange('site_footer_logo', '')} className="text-[10px] font-black uppercase text-red-400 block text-center w-full hover:underline tracking-widest">Hapus Rujukan</button>}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Deskripsi Narasi Footer</label>
              <textarea 
                value={settings.site_footer_desc || ''} onChange={e => handleChange('site_footer_desc', e.target.value)}
                className="w-full p-4 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-medium text-slate-700 shadow-sm transition-all resize-none leading-relaxed h-20" 
                placeholder="Tuliskan atribusi korporat ringkas..."
              />
            </div>
          </div>
        </div>

        {/* --- SEKSI 2: PERANCANG KOLOM FOOTER (DYNAMIC JSON BUILDER) --- */}
        <div className="bg-white p-6 lg:p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm space-y-6 hover:border-cyan-100 transition-colors">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-blue-50 pb-4">
            <h2 className="text-sm font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
              <Layers size={16} className="text-cyan-500" /> Penataan Kolom Navigasi Bawah
            </h2>
            <button type="button" onClick={handleAddColumn} className="px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white font-black rounded-xl text-xs flex items-center gap-2 transition-colors uppercase tracking-widest shadow-sm">
              <Plus size={14} className="text-cyan-400"/> Tambah Kolom
            </button>
          </div>

          <div className="space-y-5">
            {footerCols.length === 0 ? (
              <div className="border-2 border-dashed border-blue-100 rounded-[2rem] p-12 text-center bg-slate-50">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Struktur Kolom Kosong</p>
                <p className="text-sm text-slate-500 mt-2 font-medium">Sistem akan mencetak menu fallback bawaan. Rangkai kolom tautan kustom di sini.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {footerCols.map((col, cIdx) => (
                  <div key={cIdx} className="border-2 border-blue-50 rounded-2xl rounded-tr-none bg-blue-50/30 p-5 space-y-4 relative group">
                    <div className="flex items-center gap-3 pr-8">
                      <input 
                        value={col.title} onChange={e => handleUpdateColTitle(cIdx, e.target.value)}
                        className="font-black text-sm text-slate-900 bg-white border border-blue-100 p-3 rounded-xl flex-1 outline-none focus:border-cyan-500 shadow-sm"
                        placeholder="Judul Kolom..." 
                      />
                      <button type="button" onClick={() => handleRemoveColumn(cIdx)} className="absolute top-5 right-4 text-slate-400 hover:text-red-500 transition-colors bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                        <Trash2 size={16}/>
                      </button>
                    </div>

                    <div className="space-y-3 pt-4 border-t-2 border-blue-50">
                      {col.links.map((link, lIdx) => (
                        <div key={lIdx} className="flex gap-2 items-center">
                          <input 
                            value={link.label} onChange={e => handleUpdateLink(cIdx, lIdx, 'label', e.target.value)}
                            className="text-xs text-slate-800 bg-white border border-blue-100 p-2.5 rounded-xl w-1/3 font-bold outline-none focus:border-cyan-500 shadow-sm"
                            placeholder="Label" 
                          />
                          <input 
                            value={link.url} onChange={e => handleUpdateLink(cIdx, lIdx, 'url', e.target.value)}
                            className="text-xs text-cyan-600 font-mono bg-white border border-blue-100 p-2.5 rounded-xl flex-1 outline-none focus:border-cyan-500 shadow-sm"
                            placeholder="/p/rute" 
                          />
                          <button type="button" onClick={() => handleRemoveLinkFromCol(cIdx, lIdx)} className="p-2.5 text-slate-400 hover:text-white hover:bg-red-500 bg-white border border-slate-200 rounded-xl transition-colors shadow-sm">
                            <Trash2 size={14}/>
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => handleAddLinkToCol(cIdx)} className="text-[10px] font-black text-cyan-600 hover:text-cyan-700 hover:underline block pt-2 uppercase tracking-widest">
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
        <div className="bg-white p-6 lg:p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm space-y-6 hover:border-cyan-100 transition-colors">
          <div className="border-b-2 border-blue-50 pb-4">
            <h2 className="text-sm font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">Komunikasi & Jejaring</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-2"><Mail size={14} className="text-cyan-500"/> Email Operasional</label>
              <input value={settings.site_email || ''} onChange={e => handleChange('site_email', e.target.value)} className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-mono font-bold text-slate-800 shadow-sm transition-all" placeholder="contact@desapasirlangu.go.id" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-2"><Phone size={14} className="text-cyan-500"/> Kontak / WhatsApp</label>
              <input value={settings.site_phone || ''} onChange={e => handleChange('site_phone', e.target.value)} className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-mono font-bold text-slate-800 shadow-sm transition-all" placeholder="+62 812-..." />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-2"><MapPin size={14} className="text-cyan-500"/> Alamat Kantor Pusat</label>
              <textarea value={settings.site_address || ''} onChange={e => handleChange('site_address', e.target.value)} className="w-full p-4 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-medium text-slate-700 shadow-sm transition-all resize-none leading-relaxed h-20" placeholder="Kantor Kepala Desa..." />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-2"><Share2 size={14} className="text-cyan-500"/> Facebook URL</label>
              <input value={settings.social_facebook || ''} onChange={e => handleChange('social_facebook', e.target.value)} className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-mono font-medium text-cyan-600 shadow-sm transition-all" />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-2"><Link2 size={14} className="text-cyan-500"/> Instagram URL</label>
              <input value={settings.social_instagram || ''} onChange={e => handleChange('social_instagram', e.target.value)} className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-mono font-medium text-cyan-600 shadow-sm transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest flex items-center gap-2"><Share2 size={14} className="text-cyan-500"/> LinkedIn / Youtube URL</label>
              <input value={settings.social_linkedin || ''} onChange={e => handleChange('social_linkedin', e.target.value)} className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-mono font-medium text-cyan-600 shadow-sm transition-all" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={isSaving} className="w-full py-4 bg-blue-950 hover:bg-blue-900 text-white font-black rounded-[2rem] rounded-tr-none text-sm uppercase tracking-widest shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 group/btn">
          {isSaving ? <Loader2 className="animate-spin text-cyan-400" size={20} /> : <Save size={20} className="text-cyan-400 group-hover/btn:rotate-12 transition-transform" />} Terapkan Sinkronisasi Atribut
        </button>
      </form>

      {isSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] rounded-tr-none w-full max-w-sm shadow-2xl text-center p-8 border-4 border-white/20 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-cyan-100">
                <CheckCircle className="text-cyan-500" size={40} />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Variabel Tersimpan</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">Struktur parameter global serta tata letak berhasil disinkronisasi.</p>
            <button onClick={() => setIsSuccessModal(false)} className="mt-8 w-full py-3.5 bg-blue-950 hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-widest active:scale-95">Tutup Panel</button>
          </div>
        </div>
      )}
    </div>
  );
};