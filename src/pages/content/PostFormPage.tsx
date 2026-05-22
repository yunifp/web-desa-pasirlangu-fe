/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';
import { useCategories } from '../../hooks/useCategories';
import type { PostFormData, PostStatus, Category } from '../../types/cms';
import { MediaPickerModal } from '../../components/media/MediaPickerModal';
import {
  ArrowLeft, Save, CheckCircle, Loader2, FileCode, Layers,
  Bold, Italic, Underline, List, ListOrdered, ImagePlus, Upload
} from 'lucide-react';

interface AdvancedEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onOpenMediaPicker: () => void;
}

const AdvancedRichTextEditor: React.FC<AdvancedEditorProps> = ({ value, onChange, placeholder, onOpenMediaPicker }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSourceMode, setIsSourceMode] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value && !isSourceMode) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isSourceMode]);

  const execCmd = (command: string, arg: string = '') => {
    document.execCommand(command, false, arg);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs flex flex-col font-sans">
      <div className="bg-slate-50/80 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => execCmd('bold')} className="p-2 hover:bg-slate-200 text-slate-700 rounded-lg"><Bold size={14} /></button>
          <button type="button" onClick={() => execCmd('italic')} className="p-2 hover:bg-slate-200 text-slate-700 rounded-lg"><Italic size={14} /></button>
          <button type="button" onClick={() => execCmd('underline')} className="p-2 hover:bg-slate-200 text-slate-700 rounded-lg"><Underline size={14} /></button>
          <div className="w-px h-4 bg-slate-200 mx-1.5" />
          <button type="button" onClick={() => execCmd('insertUnorderedList')} className="p-2 hover:bg-slate-200 text-slate-700 rounded-lg"><ListOrdered size={14} /></button>
          <button type="button" onClick={() => execCmd('insertOrderedList')} className="p-2 hover:bg-slate-200 text-slate-700 rounded-lg"><List size={14} /></button>
          <div className="w-px h-4 bg-slate-200 mx-1.5" />
          
          <button 
            type="button" onClick={onOpenMediaPicker}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg font-bold text-xs border border-teal-100 transition-colors"
            title="Sisipkan Gambar atau Video ke Tubuh Artikel"
          >
            <ImagePlus size={14} /> Sisip Aset
          </button>
        </div>

        <button type="button" onClick={() => setIsSourceMode(!isSourceMode)} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${isSourceMode ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-600 border-slate-200 shadow-2xs'}`}>
          {isSourceMode ? 'Visual Mode' : 'HTML Code'}
        </button>
      </div>

      {isSourceMode ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} className="w-full h-96 p-5 font-mono text-xs outline-none border-none leading-relaxed text-slate-800 bg-slate-50/50" placeholder="<p>Ketik tag HTML mentah...</p>" />
      ) : (
        <div 
          ref={editorRef} contentEditable onInput={handleInput} onBlur={handleInput} 
          className="w-full h-96 p-6 outline-none overflow-y-auto text-xs prose max-w-none leading-relaxed text-slate-800 font-medium" 
          data-placeholder={placeholder} 
        />
      )}
    </div>
  );
};

export const PostFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 
  const { getPostById, createPost, updatePost } = usePosts();
  const { categories, fetchCategoriesList } = useCategories();

  const [formData, setFormData] = useState<PostFormData>({
    title: '', titleEn: '', slug: '', content: '', contentEn: '',
    image: '', imageCaption: '', status: 'DRAFT', categoryId: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoadingInit, setIsLoadingInit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState(false);

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [activeMediaTarget, setActiveMediaTarget] = useState<'EDITOR' | 'THUMBNAIL'>('EDITOR');

  const getBackendUrl = (pathStr: string) => {
    if (!pathStr) return '';
    if (pathStr.startsWith('http')) return pathStr;
    const origin = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/api$/, "");
    return `${origin}${pathStr}`;
  };

  useEffect(() => {
    const init = async () => {
      setIsLoadingInit(true);
      try {
        await fetchCategoriesList();
        if (id) {
          const post = await getPostById(id);
          if (post) {
            setFormData({
              title: post.title, titleEn: post.titleEn || '', slug: post.slug,
              content: post.content, contentEn: post.contentEn || '',
              image: post.image || '', imageCaption: post.imageCaption || '',
              status: post.status, categoryId: post.categoryId || ''
            });
            if (post.image) setImagePreview(getBackendUrl(post.image));
          }
        }
      } catch (err) {
        console.error("Gagal inisialisasi form postingan:", err);
      } finally {
        setIsLoadingInit(false);
      }
    };
    init();
  }, [id]);

  const handleMediaSelect = (url: string, type: 'IMAGE' | 'VIDEO' | 'DOCUMENT') => {
  const fullUrl = getBackendUrl(url);

  if (activeMediaTarget === 'THUMBNAIL') {
    if (type === 'VIDEO' || type === 'DOCUMENT') {
      alert("Peringatan: Thumbnail induk wajib berformat Gambar.");
      return;
    }
    setFormData(prev => ({ ...prev, image: url }));
    setImagePreview(fullUrl);
    return;
  }

  let injectedTag = '';
  if (type === 'IMAGE') {
    injectedTag = `<img src="${fullUrl}" alt="Aset Sisipan" style="max-width: 100%; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 24px auto; display: block;" />`;
  } else if (type === 'VIDEO') {
    injectedTag = `<video src="${fullUrl}" controls style="max-width: 100%; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 24px auto; display: block;"></video>`;
  } else {
    // DOCUMENT — sisipkan sebagai tautan unduhan
    injectedTag = `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 12px; color: #0f172a; font-weight: 700; text-decoration: none; margin: 16px 0;">📄 Unduh Dokumen</a>`;
  }

  setFormData(prev => ({ ...prev, content: `${prev.content}<p><br></p>${injectedTag}<p><br></p>` }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert("Kategori artikel wajib dipilih.");
      return;
    }

    setIsSaving(true);
    const res = id ? await updatePost(id, formData) : await createPost(formData);
    setIsSaving(false);

    if (res.success) setIsSuccessModal(true);
    else alert(res.message);
  };

  if (isLoadingInit) return <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-teal-600" size={32} /></div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 font-sans animate-in fade-in duration-300">
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200">
        <button type="button" onClick={() => navigate('/posts')} className="flex items-center gap-1.5 text-slate-600 font-bold text-xs hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} /> Arsip Berita
        </button>
        <span className="text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-widest bg-slate-50 text-slate-700 border border-slate-200/60">
          Form: {id ? 'Pembaruan' : 'Rilis Baru'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-200 space-y-5">
            
            <div className="border-b border-slate-100 pb-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Judul Postingan / Headline *</label>
              <input 
                required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
                className="w-full border border-slate-200 p-3.5 rounded-xl font-black text-lg text-slate-900 mt-1.5 outline-none focus:border-teal-600 focus:bg-white bg-slate-50/50 transition-all" 
                placeholder="Tuliskan headline pemikat pembaca..." 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tubuh Paragraf & Konten Artikel *</label>
              <AdvancedRichTextEditor 
                value={formData.content} 
                onChange={val => setFormData({...formData, content: val})} 
                placeholder="Rangkai tulisan paragraf korporat Anda di sini..."
                onOpenMediaPicker={() => {
                  setActiveMediaTarget('EDITOR');
                  setIsMediaModalOpen(true);
                }}
              />
            </div>

          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-200 space-y-5">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">Atribut Distribusi</h3>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Layers size={12} className="text-teal-600" /> Kategori Induk *
              </label>
              <select 
                required value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} 
                className="w-full border border-slate-200 p-3 rounded-xl font-bold text-xs text-slate-800 outline-none focus:border-teal-600 bg-white cursor-pointer shadow-2xs"
              >
                <option value="">-- Pengelompokan --</option>
                {categories.map((c: Category) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status Peredaran</label>
              <select 
                value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as PostStatus })} 
                className="w-full border border-slate-200 p-3 rounded-xl font-bold text-xs bg-white text-slate-800 outline-none focus:border-teal-600 cursor-pointer shadow-2xs"
              >
                <option value="DRAFT">DRAFT (Konsep)</option>
                <option value="PUBLISHED">PUBLISHED (Rilis Aktif)</option>
                <option value="ARCHIVED">ARCHIVED (Arsip)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between items-center">
                <span>Rute Kustom (Slug)</span>
                <FileCode size={12} className="text-slate-400" />
              </label>
              <input 
                value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} 
                className="w-full border border-slate-200 p-3 rounded-xl font-mono text-xs text-slate-800 outline-none focus:border-teal-600 bg-slate-50/50" 
                placeholder="otomatis-jika-kosong" 
              />
            </div>

            <button type="submit" disabled={isSaving} className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white p-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-1.5 mt-2 shadow-md shadow-teal-950/10">
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Transmisikan Postingan
            </button>
          </div>

          <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">Gambar Pratinjau</h3>
            
            <div className="w-full aspect-video bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden relative shadow-2xs">
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" />
              ) : <span className="text-[10px] font-bold text-slate-400">Pilih berkas sampul</span>}
            </div>

            <button 
              type="button" 
              onClick={() => {
                setActiveMediaTarget('THUMBNAIL');
                setIsMediaModalOpen(true);
              }}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200/80 shadow-2xs"
            >
              <Upload size={13} /> Pustaka Media Terpusat
            </button>
            {formData.image && <button type="button" onClick={() => { setFormData(p => ({...p, image: ''})); setImagePreview(null); }} className="text-[10px] text-red-500 font-bold block text-center w-full hover:underline">Hapus Sampul</button>}
          </div>

        </div>
      </form>

      <MediaPickerModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaSelect}
      />

      {isSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm text-center p-8 border border-slate-100 animate-in zoom-in-95 duration-200">
            <CheckCircle className="text-teal-600 mx-auto mb-4" size={40} />
            <h2 className="text-lg font-black text-slate-900">Publikasi Terverifikasi</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">Artikel dan lampiran aset berhasil dieksekusi.</p>
            <button onClick={() => { setIsSuccessModal(false); navigate('/posts'); }} className="mt-6 w-full py-3 bg-slate-950 text-white font-bold text-xs rounded-xl shadow-md">Kembali ke Arsip</button>
          </div>
        </div>
      )}
    </div>
  );
};