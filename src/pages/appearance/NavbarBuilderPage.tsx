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
    <div className="space-y-8 max-w-6xl mx-auto pb-10 font-sans animate-in fade-in duration-300">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm hover:border-cyan-100 transition-colors">
        <div>
          <h1 className="text-2xl lg:text-3xl font-light text-slate-800 tracking-tight">Perancang Navbar Bertingkat</h1>
          <p className="text-sm text-slate-500 font-medium mt-2">Rangkai hierarki tautan utama dan dropdown kustom secara mandiri untuk navigasi publik.</p>
        </div>
        <button 
          onClick={handleSaveStructure} disabled={isSaving}
          className="bg-blue-950 hover:bg-blue-900 text-white px-6 py-3.5 rounded-2xl rounded-tr-none flex items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all font-black text-xs uppercase tracking-widest active:scale-95 group/btn"
        >
          {isSaving ? <Loader2 className="animate-spin text-cyan-400" size={16} /> : <Save size={16} className="text-cyan-400 group-hover/btn:rotate-12 transition-transform" />}
          Simpan Hierarki Navigasi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- PANEL KIRI: PENYISIPAN MENU --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm space-y-6 hover:border-cyan-100 transition-colors">
            <div className="border-b-2 border-blue-50 pb-4">
              <h2 className="text-sm font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
                <Plus size={16} className="text-cyan-500" /> Injeksi Tautan Baru
              </h2>
            </div>

            {/* Opsi Injeksi Cerdas: Halaman Statis */}
            <div className="space-y-2 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
              <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-2">
                <FileText size={14} className="text-cyan-600" /> Hubungkan Halaman Statis
              </label>
              <select
                onChange={e => {
                  const target = pages.find(p => p.slug === e.target.value);
                  if (target) handleAutoSelect('PAGE', target.slug, target.title);
                  e.target.value = "";
                }}
                className="w-full bg-white border border-blue-100 p-3 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-cyan-500 shadow-sm"
              >
                <option value="">-- Rujukan Halaman --</option>
                {pages.map(p => <option key={p.id} value={p.slug}>{p.title}</option>)}
              </select>
            </div>

            {/* Opsi Injeksi Cerdas: Kategori Artikel */}
            <div className="space-y-2 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
              <label className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-2">
                <FolderPlus size={14} className="text-cyan-600" /> Hubungkan Arsip Kategori
              </label>
              <select
                onChange={e => {
                  const target = categories.find(c => c.slug === e.target.value);
                  if (target) handleAutoSelect('CATEGORY', target.slug, target.name);
                  e.target.value = "";
                }}
                className="w-full bg-white border border-blue-100 p-3 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-cyan-500 shadow-sm"
              >
                <option value="">-- Rujukan Kategori --</option>
                {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-3 my-2">
              <div className="h-0.5 bg-blue-50 flex-1" />
              <span className="text-[9px] font-black text-cyan-600 uppercase tracking-widest">Atau Kustomisasi</span>
              <div className="h-0.5 bg-blue-50 flex-1" />
            </div>

            <form onSubmit={handleAddMenu} className="space-y-5">
              <div>
                <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Level Penempatan</label>
                <select
                  value={targetParentId} onChange={e => setTargetParentId(e.target.value)}
                  className="w-full border border-blue-100 p-3.5 rounded-2xl rounded-tr-none text-xs font-bold text-blue-900 bg-cyan-50 outline-none focus:border-cyan-500 shadow-sm"
                >
                  <option value="ROOT">👑 Menu Utama (Root Induk)</option>
                  {navItems.map(item => (
                    <option key={item.id} value={item.id}>↳ Submenu dari: "{item.label}"</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest">Label Menu *</label>
                <input 
                  required value={labelInput} onChange={e => setLabelInput(e.target.value)}
                  className="w-full p-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all" 
                  placeholder="e.g. Profil Perusahaan"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-widest flex justify-between">
                  <span>Rute Destinasi URL</span>
                  <span className="text-[9px] text-cyan-500 italic font-medium">kosongkan jika dropdown</span>
                </label>
                <div className="relative">
                  <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600" size={16} />
                  <input 
                    value={urlInput} onChange={e => setUrlInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-mono text-slate-800 shadow-sm transition-all" 
                    placeholder="e.g. /p/rute atau #"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 bg-blue-950 hover:bg-blue-900 text-white font-black rounded-2xl rounded-tr-none text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95">
                Sisipkan ke Struktur
              </button>
            </form>
          </div>
        </div>

        {/* --- PANEL KANAN: POHON MENU AKTIF --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 lg:p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm space-y-6 hover:border-cyan-100 transition-colors">
            <div className="flex items-center justify-between border-b-2 border-blue-50 pb-4">
              <h2 className="text-sm font-black text-blue-950 uppercase tracking-widest flex items-center gap-2">
                <Layers size={16} className="text-cyan-500" /> Pohon Navigasi Aktif
              </h2>
              <span className="text-[10px] font-black bg-cyan-50 text-cyan-600 px-3 py-1.5 rounded-xl uppercase tracking-widest border border-cyan-100">{navItems.length} Induk</span>
            </div>

            {isLoading ? (
              <div className="py-16 text-center"><Loader2 className="animate-spin mx-auto text-cyan-500" size={32} /></div>
            ) : navItems.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-blue-100 rounded-[2rem] bg-slate-50">
                <Globe className="mx-auto text-slate-300 mb-3" size={40} />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Hierarki Menu Kosong</p>
                <p className="text-sm text-slate-500 mt-2 font-medium">Gunakan panel kiri untuk menyuntikkan rantai navigasi.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {navItems.map((item, index) => (
                  <div key={item.id} className="border-2 border-blue-50 rounded-2xl bg-white shadow-sm overflow-hidden transition-all group">
                    
                    {/* Bar Induk Utama */}
                    <div className="bg-blue-50/50 p-4 flex items-center justify-between gap-3 border-b border-blue-100">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="w-8 h-8 bg-blue-950 text-white rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 shadow-sm">
                          {index + 1}
                        </span>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                          <input 
                            value={item.label} onChange={e => handleUpdateItem(item.id, 'label', e.target.value)}
                            className="font-bold text-sm text-slate-900 bg-white border border-blue-100 px-3 py-2 rounded-xl w-full sm:w-1/2 outline-none focus:border-cyan-500 shadow-sm"
                            placeholder="Label Induk"
                          />
                          <input 
                            value={item.url} onChange={e => handleUpdateItem(item.id, 'url', e.target.value)}
                            className="font-mono text-sm text-cyan-600 bg-white border border-blue-100 px-3 py-2 rounded-xl w-full sm:w-1/2 outline-none focus:border-cyan-500 shadow-sm"
                            placeholder="URL Induk / #"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button type="button" onClick={() => moveMenu(index, 'UP')} disabled={index === 0} className="p-1.5 text-slate-400 hover:text-blue-950 disabled:opacity-20 transition-colors bg-white rounded-lg border border-slate-200 shadow-sm"><ChevronUp size={16}/></button>
                        <button type="button" onClick={() => moveMenu(index, 'DOWN')} disabled={index === navItems.length - 1} className="p-1.5 text-slate-400 hover:text-blue-950 disabled:opacity-20 transition-colors bg-white rounded-lg border border-slate-200 shadow-sm"><ChevronDown size={16}/></button>
                        <div className="w-px h-6 bg-blue-100 mx-2" />
                        <button type="button" onClick={() => handleDeleteParent(item.id)} className="p-1.5 text-slate-400 hover:text-white hover:bg-red-500 transition-colors bg-white rounded-lg border border-slate-200 shadow-sm"><Trash2 size={15}/></button>
                      </div>
                    </div>

                    {/* Area Render Submenu Bertingkat */}
                    <div className="p-4 bg-white space-y-3 pl-10 border-l-[3px] border-cyan-400 ml-4 my-2">
                      <span className="text-[10px] font-black text-slate-400 block uppercase tracking-widest">
                        ↳ Rantai Sub-menu ({item.subMenus.length} item)
                      </span>
                      
                      {item.subMenus.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic font-medium">Tanpa laci dropdown. Beroperasi sebagai rute mandiri.</p>
                      ) : (
                        <div className="space-y-3">
                          {item.subMenus.map((sub, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-3 bg-blue-50/30 p-3 rounded-xl border border-blue-50">
                              <span className="text-[11px] font-black text-cyan-600 w-5">{sIdx + 1}.</span>
                              <input 
                                value={sub.label} onChange={e => handleUpdateSubItem(item.id, sIdx, 'label', e.target.value)}
                                className="text-xs font-bold text-slate-800 bg-white border border-blue-100 px-3 py-2 rounded-lg w-1/3 outline-none focus:border-cyan-500 shadow-sm"
                                placeholder="Sub Label"
                              />
                              <input 
                                value={sub.url} onChange={e => handleUpdateSubItem(item.id, sIdx, 'url', e.target.value)}
                                className="text-xs font-mono text-cyan-600 bg-white border border-blue-100 px-3 py-2 rounded-lg flex-1 outline-none focus:border-cyan-500 shadow-sm"
                                placeholder="/p/rute"
                              />
                              
                              <div className="flex items-center gap-1">
                                <button type="button" onClick={() => moveSubMenu(item.id, sIdx, 'UP')} disabled={sIdx === 0} className="p-1 text-slate-400 hover:text-blue-900 disabled:opacity-20"><ChevronUp size={14}/></button>
                                <button type="button" onClick={() => moveSubMenu(item.id, sIdx, 'DOWN')} disabled={sIdx === item.subMenus.length - 1} className="p-1 text-slate-400 hover:text-blue-900 disabled:opacity-20"><ChevronDown size={14}/></button>
                                <button type="button" onClick={() => handleDeleteSubMenu(item.id, sIdx)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-blue-950/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2rem] rounded-tr-none w-full max-w-sm shadow-2xl text-center p-8 border-4 border-white/20 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-cyan-100">
                <CheckCircle className="text-cyan-500" size={40} />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Struktur Diperbarui</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">Rantai hierarki menu berhasil ditransmisikan ke antarmuka publik.</p>
            <button onClick={() => setIsSuccessModal(false)} className="mt-8 w-full py-3.5 bg-blue-950 hover:bg-blue-900 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-xl transition-all uppercase tracking-widest active:scale-95">Tutup Panel</button>
          </div>
        </div>
      )}
    </div>
  );
};