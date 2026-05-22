/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { usePages } from '../../hooks/usePages';
import { 
  Plus, Trash2, ChevronUp, ChevronDown, CheckCircle, 
  Loader2, Globe, Link2, FileText, Layers, Save, FolderPlus
} from 'lucide-react';

interface SubMenuItem {
  label: string;
  url: string;
}

interface NavMenuItem {
  id: string;
  label: string;
  url: string; 
  subMenus: SubMenuItem[]; 
}

export const NavbarBuilderPage: React.FC = () => {
  const [navItems, setNavItems] = useState<NavMenuItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  
  const [labelInput, setLabelInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [targetParentId, setTargetParentId] = useState<string>('ROOT'); 

  const { pages, fetchPages } = usePages();

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      fetchPages();
      
      try {
        const resSet = await api.get('/settings');
        if (resSet.data?.data?.public_navbar_structure) {
          try {
            const parsed = JSON.parse(resSet.data.data.public_navbar_structure);
            if (Array.isArray(parsed)) setNavItems(parsed);
          } catch (err) {
            console.error("Gagal mem-parse JSON Navbar:", err);
          }
        }

        const resCat = await api.get('/categories');
        if (resCat.data?.data) setCategories(resCat.data.data);

      } catch (err) {
        console.error("Gagal memuat inisialisasi Navbar Builder", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const handleAutoSelect = (type: 'PAGE' | 'CATEGORY', slug: string, title: string) => {
    if (!slug) return;
    setLabelInput(title);
    setUrlInput(type === 'PAGE' ? `/p/${slug}` : `/kategori/${slug}`);
  };

  const handleAddMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labelInput) return;

    if (targetParentId === 'ROOT') {
      const newItem: NavMenuItem = {
        id: 'nav-' + Date.now(),
        label: labelInput,
        url: urlInput || '#', 
        subMenus: []
      };
      setNavItems(prev => [...prev, newItem]);
    } else {
      setNavItems(prev => prev.map(item => {
        if (item.id === targetParentId) {
          return {
            ...item,
            subMenus: [...item.subMenus, { label: labelInput, url: urlInput || '/' }]
          };
        }
        return item;
      }));
    }

    setLabelInput('');
    setUrlInput('');
    setTargetParentId('ROOT');
  };

  const handleDeleteParent = (id: string) => {
    setNavItems(prev => prev.filter(item => item.id !== id));
  };

  const handleDeleteSubMenu = (parentId: string, subIndex: number) => {
    setNavItems(prev => prev.map(item => {
      if (item.id === parentId) {
        return {
          ...item,
          subMenus: item.subMenus.filter((_, idx) => idx !== subIndex)
        };
      }
      return item;
    }));
  };

  const handleUpdateItem = (id: string, prop: 'label' | 'url', val: string) => {
    setNavItems(prev => prev.map(item => item.id === id ? { ...item, [prop]: val } : item));
  };

  const handleUpdateSubItem = (parentId: string, subIndex: number, prop: 'label' | 'url', val: string) => {
    setNavItems(prev => prev.map(item => {
      if (item.id === parentId) {
        const newSubs = [...item.subMenus];
        newSubs[subIndex] = { ...newSubs[subIndex], [prop]: val };
        return { ...item, subMenus: newSubs };
      }
      return item;
    }));
  };

  const moveMenu = (index: number, direction: 'UP' | 'DOWN') => {
    const newItems = [...navItems];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setNavItems(newItems);
  };

  const moveSubMenu = (parentId: string, subIndex: number, direction: 'UP' | 'DOWN') => {
    setNavItems(prev => prev.map(item => {
      if (item.id === parentId) {
        const newSubs = [...item.subMenus];
        const targetIdx = direction === 'UP' ? subIndex - 1 : subIndex + 1;
        if (targetIdx < 0 || targetIdx >= newSubs.length) return item;

        const temp = newSubs[subIndex];
        newSubs[subIndex] = newSubs[targetIdx];
        newSubs[targetIdx] = temp;
        return { ...item, subMenus: newSubs };
      }
      return item;
    }));
  };

  const handleSaveStructure = async () => {
    setIsSaving(true);
    try {
      const payload = { public_navbar_structure: JSON.stringify(navItems) };
      await api.put('/settings/bulk', payload);
      setIsSuccessModal(true);
    } catch (err) {
      alert("Gagal menyimpan struktur menu bertingkat.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 font-sans animate-in fade-in duration-300">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Perancang Menu Navbar Bertingkat</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Rangkai hierarki tautan utama dan dropdown kustom secara mandiri untuk navigasi publik.</p>
        </div>
        <button 
          onClick={handleSaveStructure} disabled={isSaving}
          className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-teal-950/20 transition-all active:scale-95 flex items-center gap-2"
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Simpan Hierarki Navigasi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- PANEL KIRI: PENYISIPAN MENU --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Plus size={14} className="text-teal-600" /> Injeksi Tautan Baru
              </h2>
            </div>

            {/* Opsi Injeksi Cerdas: Halaman Statis */}
            <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-xl border border-slate-150">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <FileText size={12} className="text-teal-600" /> Hubungkan Halaman Statis
              </label>
              <select
                onChange={e => {
                  const target = pages.find(p => p.slug === e.target.value);
                  if (target) handleAutoSelect('PAGE', target.slug, target.title);
                  e.target.value = "";
                }}
                className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-teal-600 shadow-2xs"
              >
                <option value="">-- Rujukan Halaman --</option>
                {pages.map(p => <option key={p.id} value={p.slug}>{p.title}</option>)}
              </select>
            </div>

            {/* Opsi Injeksi Cerdas: Kategori Artikel */}
            <div className="space-y-1.5 bg-slate-50/80 p-3 rounded-xl border border-slate-150">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <FolderPlus size={12} className="text-emerald-600" /> Hubungkan Arsip Kategori
              </label>
              <select
                onChange={e => {
                  const target = categories.find(c => c.slug === e.target.value);
                  if (target) handleAutoSelect('CATEGORY', target.slug, target.name);
                  e.target.value = "";
                }}
                className="w-full bg-white border border-slate-200 p-2 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-teal-600 shadow-2xs"
              >
                <option value="">-- Rujukan Kategori --</option>
                {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2 my-1">
              <div className="h-px bg-slate-100 flex-1" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Atau Kustomisasi</span>
              <div className="h-px bg-slate-100 flex-1" />
            </div>

            <form onSubmit={handleAddMenu} className="space-y-4">
              <div className="space-y-1 group">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Level Penempatan</label>
                <select
                  value={targetParentId} onChange={e => setTargetParentId(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-teal-700 bg-teal-50/50 outline-none focus:border-teal-600"
                >
                  <option value="ROOT">👑 Menu Utama (Root Induk)</option>
                  {navItems.map(item => (
                    <option key={item.id} value={item.id}>↳ Submenu dari: "{item.label}"</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 group">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block group-focus-within:text-teal-600 transition-colors">Label Menu *</label>
                <input 
                  required value={labelInput} onChange={e => setLabelInput(e.target.value)}
                  className="w-full border border-slate-200 p-2.5 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-teal-600 bg-slate-50/50 focus:bg-white transition-all" 
                  placeholder="e.g. Profil Perusahaan"
                />
              </div>

              <div className="space-y-1 group">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between group-focus-within:text-teal-600 transition-colors">
                  <span>Rute Destinasi URL</span>
                  <span className="text-[9px] text-slate-400 italic font-normal">kosongkan jika Induk Dropdown</span>
                </label>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={14} />
                  <input 
                    value={urlInput} onChange={e => setUrlInput(e.target.value)}
                    className="w-full pl-8 pr-3 border border-slate-200 p-2.5 rounded-xl text-xs font-mono text-slate-800 outline-none focus:border-teal-600 bg-slate-50/50 focus:bg-white transition-all" 
                    placeholder="e.g. /p/rute atau #"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-all active:scale-95">
                Sisipkan ke Struktur
              </button>
            </form>
          </div>
        </div>

        {/* --- PANEL KANAN: POHON MENU AKTIF --- */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Layers size={14} className="text-teal-600" /> Pohon Navigasi Aktif
              </h2>
              <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-wider">{navItems.length} Induk</span>
            </div>

            {isLoading ? (
              <div className="py-12 text-center"><Loader2 className="animate-spin mx-auto text-teal-600" size={28} /></div>
            ) : navItems.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <Globe className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hierarki Menu Kosong</p>
                <p className="text-xs text-slate-400 mt-1">Gunakan panel kiri untuk menyuntikkan rantai navigasi.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {navItems.map((item, index) => (
                  <div key={item.id} className="border border-slate-200 rounded-2xl bg-white shadow-2xs overflow-hidden transition-all group">
                    
                    {/* Bar Induk Utama */}
                    <div className="bg-slate-50/80 p-3.5 flex items-center justify-between gap-2 border-b border-slate-100">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 shadow-2xs">
                          {index + 1}
                        </span>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-1">
                          <input 
                            value={item.label} onChange={e => handleUpdateItem(item.id, 'label', e.target.value)}
                            className="font-bold text-xs text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg w-full sm:w-1/2 outline-none focus:border-teal-600 shadow-2xs"
                            placeholder="Label Induk"
                          />
                          <input 
                            value={item.url} onChange={e => handleUpdateItem(item.id, 'url', e.target.value)}
                            className="font-mono text-xs text-teal-600 bg-white border border-slate-200 px-2.5 py-1 rounded-lg w-full sm:w-1/2 outline-none focus:border-teal-600 shadow-2xs"
                            placeholder="URL Induk / #"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <button type="button" onClick={() => moveMenu(index, 'UP')} disabled={index === 0} className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-20 transition-colors"><ChevronUp size={16}/></button>
                        <button type="button" onClick={() => moveMenu(index, 'DOWN')} disabled={index === navItems.length - 1} className="p-1 text-slate-400 hover:text-slate-900 disabled:opacity-20 transition-colors"><ChevronDown size={16}/></button>
                        <div className="w-px h-4 bg-slate-200 mx-1" />
                        <button type="button" onClick={() => handleDeleteParent(item.id)} className="p-1 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={15}/></button>
                      </div>
                    </div>

                    {/* Area Render Submenu Bertingkat */}
                    <div className="p-3 bg-white space-y-2 pl-8">
                      <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">
                        ↳ Rantai Sub-menu ({item.subMenus.length} item)
                      </span>
                      
                      {item.subMenus.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic font-medium">Tanpa laci dropdown. Beroperasi sebagai rute mandiri.</p>
                      ) : (
                        <div className="space-y-2">
                          {item.subMenus.map((sub, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-2 bg-slate-50/60 p-2 rounded-xl border border-slate-150">
                              <span className="text-[10px] font-black text-teal-600 w-4">{sIdx + 1}.</span>
                              <input 
                                value={sub.label} onChange={e => handleUpdateSubItem(item.id, sIdx, 'label', e.target.value)}
                                className="text-xs font-bold text-slate-800 bg-white border border-slate-200 px-2 py-1 rounded-md w-1/3 outline-none focus:border-teal-600 shadow-2xs"
                                placeholder="Sub Label"
                              />
                              <input 
                                value={sub.url} onChange={e => handleUpdateSubItem(item.id, sIdx, 'url', e.target.value)}
                                className="text-xs font-mono text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-md flex-1 outline-none focus:border-teal-600 shadow-2xs"
                                placeholder="/p/rute"
                              />
                              
                              <div className="flex items-center gap-0.5">
                                <button type="button" onClick={() => moveSubMenu(item.id, sIdx, 'UP')} disabled={sIdx === 0} className="p-0.5 text-slate-400 hover:text-slate-900 disabled:opacity-20"><ChevronUp size={14}/></button>
                                <button type="button" onClick={() => moveSubMenu(item.id, sIdx, 'DOWN')} disabled={sIdx === item.subMenus.length - 1} className="p-0.5 text-slate-400 hover:text-slate-900 disabled:opacity-20"><ChevronDown size={14}/></button>
                                <button type="button" onClick={() => handleDeleteSubMenu(item.id, sIdx)} className="p-0.5 text-slate-400 hover:text-red-600"><Trash2 size={13}/></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {isSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm text-center p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
            <CheckCircle className="text-teal-600 mx-auto mb-3" size={40} />
            <h2 className="text-base font-black text-slate-900 uppercase">Struktur Diperbarui</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Rantai hierarki menu berhasil ditransmisikan ke antarmuka publik.</p>
            <button onClick={() => setIsSuccessModal(false)} className="mt-6 w-full py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-colors">Tutup Jendela</button>
          </div>
        </div>
      )}
    </div>
  );
};