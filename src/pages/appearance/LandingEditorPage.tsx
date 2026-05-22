/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Save, Image as ImageIcon, Plus, Trash2, LayoutTemplate, MessageSquare, Quote } from 'lucide-react';
import { MediaPickerModal } from '../../components/media/MediaPickerModal';

export const LandingEditorPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [activeMediaTarget, setActiveMediaTarget] = useState<any>(null);

  // State untuk menyimpan seluruh konfigurasi halaman utama
  const [config, setConfig] = useState({
    hero: {
      slides: [
        { title: '', desc: '', image: '' }
      ]
    },
    about: {
      title: '',
      description: '',
      image: ''
    },
    quote: {
      text: '',
      author: '',
      role: '',
      image: ''
    }
    // Anda dapat menambahkan section lain (purpose, mandate, dll) di sini mengikuti pola yang sama
  });

  // Tarik data konfigurasi saat ini dari backend (tabel settings)
  useEffect(() => {
    api.get('/settings/landing_config')
      .then(res => {
        if (res.data?.data?.value) {
          setConfig(JSON.parse(res.data.data.value));
        }
      })
      .catch(err => console.warn("Belum ada konfigurasi landing page:", err));
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Menyimpan JSON string ke tabel settings dengan key 'landing_config'
      await api.post('/settings', { 
        key: 'landing_config', 
        value: JSON.stringify(config),
        description: 'Konfigurasi Konten Halaman Utama'
      });
      alert('Konfigurasi Halaman Utama berhasil disimpan!');
    } catch (error) {
      console.error('Gagal menyimpan:', error);
      alert('Terjadi kesalahan saat menyimpan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaSelected = (fileUrl: string) => {
    if (!activeMediaTarget) return;
    const { section, index, field } = activeMediaTarget;
    
    setConfig((prev: any) => {
      const newConfig = { ...prev };
      if (index !== undefined) {
        newConfig[section][field][index].image = fileUrl;
      } else {
        newConfig[section].image = fileUrl;
      }
      return newConfig;
    });
    
    setIsMediaModalOpen(false);
  };

  const addHeroSlide = () => {
    setConfig(prev => ({
      ...prev,
      hero: { slides: [...prev.hero.slides, { title: 'Slide Baru', desc: 'Deskripsi...', image: '' }] }
    }));
  };

  const removeHeroSlide = (idx: number) => {
    setConfig(prev => {
      const slides = [...prev.hero.slides];
      slides.splice(idx, 1);
      return { ...prev, hero: { slides } };
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 select-none font-sans">
      <MediaPickerModal 
        isOpen={isMediaModalOpen} 
        onClose={() => setIsMediaModalOpen(false)} 
        onSelect={handleMediaSelected} 
      />

      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Editor Halaman Utama</h1>
          <p className="text-xs text-slate-500 font-medium">Sesuaikan teks dan gambar untuk Landing Page publik.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isLoading}
          className="px-6 py-3 bg-[#0B4028] hover:bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all cursor-pointer"
        >
          <Save size={16} className="text-[#C5A059]" /> {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigasi Tab Kiri */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-3 space-y-1 shadow-sm">
          <button onClick={() => setActiveTab('hero')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors text-left ${activeTab === 'hero' ? 'bg-[#0B4028] text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
            <LayoutTemplate size={16} className={activeTab === 'hero' ? 'text-[#C5A059]' : ''} /> Spanduk Puncak (Hero)
          </button>
          <button onClick={() => setActiveTab('about')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors text-left ${activeTab === 'about' ? 'bg-[#0B4028] text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
            <MessageSquare size={16} className={activeTab === 'about' ? 'text-[#C5A059]' : ''} /> Seksi Tentang Kami
          </button>
          <button onClick={() => setActiveTab('quote')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-colors text-left ${activeTab === 'quote' ? 'bg-[#0B4028] text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Quote size={16} className={activeTab === 'quote' ? 'text-[#C5A059]' : ''} /> Kutipan Pimpinan
          </button>
        </div>

        {/* Area Formulir Kanan */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm min-h-[500px]">
          
          {/* TAB: HERO BANNER */}
          {activeTab === 'hero' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Spanduk Interaktif Puncak</h2>
                <button onClick={addHeroSlide} className="text-[10px] font-bold bg-[#C5A059] text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#b08d4a] transition-colors cursor-pointer">
                  <Plus size={12} /> Tambah Slide
                </button>
              </div>

              <div className="space-y-4">
                {config.hero.slides.map((slide, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative group">
                    <button onClick={() => removeHeroSlide(idx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 cursor-pointer transition-colors"><Trash2 size={14} /></button>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Headline Slide {idx + 1}</label>
                      <input type="text" value={slide.title} onChange={e => { const newSlides = [...config.hero.slides]; newSlides[idx].title = e.target.value; setConfig({...config, hero: {slides: newSlides}}) }} className="w-full text-xs font-bold border border-slate-200 rounded-xl px-4 py-2.5 bg-white" placeholder="Mendorong transformasi..." />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Deskripsi Pendukung</label>
                      <textarea rows={2} value={slide.desc} onChange={e => { const newSlides = [...config.hero.slides]; newSlides[idx].desc = e.target.value; setConfig({...config, hero: {slides: newSlides}}) }} className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-white" placeholder="Mengakselerasi lompatan..." />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Gambar Latar Belakang</label>
                      <div className="flex items-center gap-2">
                        <input type="text" readOnly value={slide.image} className="w-full text-xs font-mono text-slate-500 border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-100" placeholder="Pilih gambar dari pustaka..." />
                        <button onClick={() => { setActiveMediaTarget({ section: 'hero', field: 'slides', index: idx }); setIsMediaModalOpen(true); }} className="px-4 py-2.5 bg-slate-200 hover:bg-[#0B4028] hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer">
                          <ImageIcon size={14} /> Pustaka
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ABOUT SECTION */}
          {activeTab === 'about' && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4">Seksi Tentang Kami</h2>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Headline Utama (Format HTML Diperbolehkan)</label>
                <textarea rows={3} value={config.about.title} onChange={e => setConfig({...config, about: {...config.about, title: e.target.value}})} className="w-full text-xs font-mono border border-slate-200 rounded-xl px-4 py-3 bg-white" placeholder="<strong class='font-black'>PT Perminas</strong> merupakan..." />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Deskripsi Paragraf</label>
                <textarea rows={3} value={config.about.description} onChange={e => setConfig({...config, about: {...config.about, description: e.target.value}})} className="w-full text-xs border border-slate-200 rounded-xl px-4 py-3 bg-white" placeholder="Sebagai badan investasi negara..." />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Gambar Representasi</label>
                <div className="flex items-center gap-2">
                  <input type="text" readOnly value={config.about.image} className="w-full text-xs font-mono text-slate-500 border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-100" />
                  <button onClick={() => { setActiveMediaTarget({ section: 'about', field: 'image' }); setIsMediaModalOpen(true); }} className="px-4 py-2.5 bg-slate-200 hover:bg-[#0B4028] hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer">
                    <ImageIcon size={14} /> Pustaka
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LEADER QUOTE */}
          {activeTab === 'quote' && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-4">Kutipan Pimpinan</h2>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Teks Kutipan (Format HTML Diperbolehkan)</label>
                <textarea rows={3} value={config.quote.text} onChange={e => setConfig({...config, quote: {...config.quote, text: e.target.value}})} className="w-full text-xs font-mono border border-slate-200 rounded-xl px-4 py-3 bg-white" placeholder="“Semua kekayaan kita...”" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nama/Atribusi</label>
                  <input type="text" value={config.quote.author} onChange={e => setConfig({...config, quote: {...config.quote, author: e.target.value}})} className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-white" placeholder="Amanat Pimpinan Eksekutif" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Peran/Jabatan</label>
                  <input type="text" value={config.quote.role} onChange={e => setConfig({...config, quote: {...config.quote, role: e.target.value}})} className="w-full text-xs border border-slate-200 rounded-xl px-4 py-2.5 bg-white" placeholder="PT Perminas" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Gambar Latar Siluet</label>
                <div className="flex items-center gap-2">
                  <input type="text" readOnly value={config.quote.image} className="w-full text-xs font-mono text-slate-500 border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-100" />
                  <button onClick={() => { setActiveMediaTarget({ section: 'quote', field: 'image' }); setIsMediaModalOpen(true); }} className="px-4 py-2.5 bg-slate-200 hover:bg-[#0B4028] hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer">
                    <ImageIcon size={14} /> Pustaka
                  </button>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};