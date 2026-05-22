/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { usePages } from '../../hooks/usePages';
import { 
  Loader2, Upload, Trash2, Copy, Check, ExternalLink, 
  Image as ImageIcon, Video, Search, Layers, RefreshCw, FileText 
} from 'lucide-react';

export interface MediaAssetItem {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export const MediaPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaAssetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { uploadImageFile } = usePages(); // Catatan: Pastikan endpoint API di balik ini menerima file selain gambar

  const getBackendUrl = (pathStr: string) => {
    if (!pathStr) return '';
    if (pathStr.startsWith('http')) return pathStr;
    const origin = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/api$/, "");
    return `${origin}${pathStr}`;
  };

  const fetchMediaAssets = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/media');
      if (res.data?.data) {
        setMediaList(res.data.data);
      }
    } catch (err) {
      console.error("Gagal memuat pustaka media:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaAssets();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedPath = await uploadImageFile(file);
        
        if (uploadedPath) {
          const payload = {
            fileName: file.name,
            fileUrl: uploadedPath,
            mimeType: file.type,
            size: file.size
          };
          
          const resReg = await api.post('/media/register', payload);
          if (resReg.data?.data) {
            setMediaList(prev => [resReg.data.data, ...prev]);
          }
        }
      }
    } catch (err) {
      alert("Gagal mengunggah dan meregistrasi beberapa aset media.");
    } finally {
      setIsUploading(false);
      e.target.value = ''; 
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Hapus aset fisik ini secara permanen dari server?")) return;
    try {
      await api.delete(`/media/${id}`);
      setMediaList(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      alert("Gagal membasmi aset media.");
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = getBackendUrl(url);
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalStorageBytes = mediaList.reduce((acc, item) => acc + item.size, 0);
  const totalStorageMB = (totalStorageBytes / (1024 * 1024)).toFixed(2);

  const filteredMedia = mediaList.filter(item => {
    const matchesSearch = item.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const isImage = item.mimeType.startsWith('image/');
    const isVideo = item.mimeType.startsWith('video/');
    const isDocument = !isImage && !isVideo;

    if (filterType === 'IMAGE') return matchesSearch && isImage;
    if (filterType === 'VIDEO') return matchesSearch && isVideo;
    if (filterType === 'DOCUMENT') return matchesSearch && isDocument;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20 font-sans animate-in fade-in duration-300">
      
      {/* Header Utama */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Pustaka Media</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Pusat kendali seluruh aset grafis, video, dan dokumen pada server.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          <div className="text-left md:text-right">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Total Kapasitas Terpakai</span>
            <span className="text-sm font-mono font-black text-teal-600">{totalStorageMB} MB</span>
          </div>
          <button 
            onClick={fetchMediaAssets} disabled={isLoading}
            className="p-2.5 bg-slate-50 hover:bg-teal-50 text-slate-600 hover:text-teal-700 rounded-xl border border-slate-200 transition-colors shadow-2xs"
            title="Segarkan Pustaka"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin text-teal-600" : ""} />
          </button>
        </div>
      </div>

      {/* Uploader Multi-file */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-full border-2 border-dashed border-slate-200 hover:border-teal-600 rounded-2xl bg-slate-50/50 p-8 text-center transition-colors relative group">
          {isUploading ? (
            <div className="space-y-3">
              <Loader2 className="animate-spin mx-auto text-teal-600" size={36} />
              <p className="text-xs font-bold text-slate-700">Mengunggah, Mengenkripsi & Mendaftarkan Aset ke Server...</p>
            </div>
          ) : (
            <div>
              <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-slate-200/60 flex items-center justify-center text-teal-600 mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Upload size={20} />
              </div>
              <span className="text-xs font-bold text-slate-900 block">Letakkan File atau Klik untuk Mengunggah Langsung</span>
              <span className="text-[10px] text-slate-400 block mt-1">Mendukung Gambar, Video, PDF, Word, Excel, dll.</span>
              <input 
                type="file" multiple 
                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv" 
                id="dashboardMediaUp" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileUpload} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Bar Pencarian & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-600 focus:bg-white transition-all font-semibold"
            placeholder="Kueri pencarian arsip media..." 
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === 'ALL' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Semua ({mediaList.length})
          </button>
          <button 
            onClick={() => setFilterType('IMAGE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${filterType === 'IMAGE' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <ImageIcon size={12} className="text-teal-600" /> Gambar
          </button>
          <button 
            onClick={() => setFilterType('VIDEO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${filterType === 'VIDEO' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Video size={12} className="text-teal-600" /> Video
          </button>
          <button 
            onClick={() => setFilterType('DOCUMENT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${filterType === 'DOCUMENT' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <FileText size={12} className="text-teal-600" /> Dokumen
          </button>
        </div>
      </div>

      {/* Grid Pustaka */}
      {isLoading ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-teal-600" size={36} /></div>
      ) : filteredMedia.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center">
          <Layers className="mx-auto text-slate-300 mb-2" size={40} />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Arsip Tidak Ditemukan</p>
          <p className="text-xs text-slate-400 mt-1">Belum ada aset fisik yang sesuai dengan parameter filter atau kueri pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMedia.map(item => {
            const isImage = item.mimeType.startsWith('image/');
            const isVideo = item.mimeType.startsWith('video/');
            const isDocument = !isImage && !isVideo;
            const fullUrl = getBackendUrl(item.fileUrl);
            const isCopied = copiedId === item.id;
            const fileExtension = item.fileName.split('.').pop()?.toUpperCase() || 'DOC';

            return (
              <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                
                <div className="aspect-square bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                  {isVideo && (
                    <>
                      <video src={fullUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                        <div className="p-2.5 bg-teal-600 text-white rounded-full shadow-md"><Video size={18} /></div>
                      </div>
                    </>
                  )}
                  {isImage && (
                    <img src={fullUrl} alt={item.fileName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                  {isDocument && (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-slate-100 text-slate-400">
                      <FileText size={42} className="mb-2 text-slate-300 group-hover:text-teal-500 transition-colors" />
                      <span className="text-[11px] font-black uppercase tracking-wider">{fileExtension}</span>
                    </div>
                  )}

                  <div className="absolute inset-x-0 top-0 p-2 bg-gradient-to-b from-slate-950/60 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={fullUrl} target="_blank" rel="noreferrer"
                      className="p-1.5 bg-white/90 hover:bg-white text-slate-900 rounded-lg shadow-xs transition-colors"
                      title="Buka File"
                    >
                      <ExternalLink size={13} />
                    </a>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs transition-colors"
                      title="Hapus Fisik Permanen"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="absolute bottom-2 right-2 left-2">
                    <button 
                      onClick={() => handleCopyUrl(item.fileUrl, item.id)}
                      className={`w-full py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm transition-all ${isCopied ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white' : 'bg-slate-950/90 hover:bg-slate-950 text-white opacity-0 group-hover:opacity-100'}`}
                    >
                      {isCopied ? <><Check size={12}/> Disalin!</> : <><Copy size={12}/> Salin Tautan</>}
                    </button>
                  </div>
                </div>

                <div className="p-3 truncate bg-white">
                  <span className="text-xs font-bold text-slate-900 block truncate" title={item.fileName}>
                    {item.fileName}
                  </span>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-medium">
                    <span className="font-mono">{(item.size / 1024).toFixed(1)} KB</span>
                    <span>{new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};