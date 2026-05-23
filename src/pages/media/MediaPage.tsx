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

  const { uploadImageFile } = usePages();

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
    <div className="space-y-8 max-w-7xl mx-auto pb-10 font-sans animate-in fade-in duration-300">
      
      {/* Header Utama */}
      <div className="bg-white p-6 lg:p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-cyan-100 transition-colors">
        <div>
          <h1 className="text-2xl lg:text-3xl font-light text-slate-800 tracking-tight">Manajemen Pustaka Media</h1>
          <p className="text-sm text-slate-500 font-medium mt-2">Pusat kendali seluruh aset grafis, video, dan dokumen pada server.</p>
        </div>
        
        <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end border-t-2 md:border-t-0 pt-4 md:pt-0 border-blue-50">
          <div className="text-left md:text-right">
            <span className="text-[10px] font-black text-slate-400 block uppercase tracking-widest">Total Kapasitas Terpakai</span>
            <span className="text-sm font-mono font-black text-cyan-600">{totalStorageMB} MB</span>
          </div>
          <button 
            onClick={fetchMediaAssets} disabled={isLoading}
            className="p-3.5 bg-blue-50 hover:bg-cyan-50 text-blue-900 hover:text-cyan-700 rounded-2xl rounded-tr-none border border-blue-100 transition-colors shadow-sm group"
            title="Segarkan Pustaka"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin text-cyan-500" : "group-hover:rotate-180 transition-transform"} />
          </button>
        </div>
      </div>

      {/* Uploader Multi-file */}
      <div className="bg-white p-6 lg:p-8 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm hover:border-cyan-100 transition-colors">
        <div className="w-full border-2 border-dashed border-blue-200 hover:border-cyan-500 rounded-[2rem] rounded-tr-none bg-blue-50/50 p-10 text-center transition-colors relative group">
          {isUploading ? (
            <div className="space-y-4">
              <Loader2 className="animate-spin mx-auto text-cyan-500" size={40} />
              <p className="text-sm font-black text-blue-950 uppercase tracking-widest">Mengunggah & Mendaftarkan Aset...</p>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 bg-white rounded-2xl rounded-tr-none shadow-sm border border-blue-100 flex items-center justify-center text-cyan-500 mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload size={24} />
              </div>
              <span className="text-sm font-black text-blue-950 block uppercase tracking-widest">Letakkan File atau Klik untuk Mengunggah</span>
              <span className="text-[11px] text-slate-500 block mt-2 font-medium">Mendukung Gambar, Video, PDF, Word, Excel, dll.</span>
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
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 bg-white p-5 rounded-[2rem] rounded-tr-none border-2 border-blue-50 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={18} />
          <input 
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-5 py-3.5 bg-white border border-blue-100 rounded-2xl rounded-tr-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none text-sm font-bold text-slate-800 shadow-sm transition-all"
            placeholder="Kueri pencarian arsip media..." 
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-2xl rounded-tr-none border border-blue-100">
          <button 
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${filterType === 'ALL' ? 'bg-blue-950 text-white shadow-sm' : 'text-slate-500 hover:text-blue-950 hover:bg-white'}`}
          >
            Semua ({mediaList.length})
          </button>
          <button 
            onClick={() => setFilterType('IMAGE')}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${filterType === 'IMAGE' ? 'bg-blue-950 text-white shadow-sm' : 'text-slate-500 hover:text-blue-950 hover:bg-white'}`}
          >
            <ImageIcon size={14} className={filterType === 'IMAGE' ? 'text-cyan-400' : 'text-cyan-500'} /> Gambar
          </button>
          <button 
            onClick={() => setFilterType('VIDEO')}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${filterType === 'VIDEO' ? 'bg-blue-950 text-white shadow-sm' : 'text-slate-500 hover:text-blue-950 hover:bg-white'}`}
          >
            <Video size={14} className={filterType === 'VIDEO' ? 'text-cyan-400' : 'text-cyan-500'} /> Video
          </button>
          <button 
            onClick={() => setFilterType('DOCUMENT')}
            className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${filterType === 'DOCUMENT' ? 'bg-blue-950 text-white shadow-sm' : 'text-slate-500 hover:text-blue-950 hover:bg-white'}`}
          >
            <FileText size={14} className={filterType === 'DOCUMENT' ? 'text-cyan-400' : 'text-cyan-500'} /> Dokumen
          </button>
        </div>
      </div>

      {/* Grid Pustaka */}
      {isLoading ? (
        <div className="py-24 text-center"><Loader2 className="animate-spin mx-auto text-cyan-500" size={40} /></div>
      ) : filteredMedia.length === 0 ? (
        <div className="p-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-blue-100 text-center">
          <Layers className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Arsip Tidak Ditemukan</p>
          <p className="text-sm text-slate-500 mt-2 font-medium">Belum ada aset fisik yang sesuai dengan parameter filter atau kueri pencarian Anda.</p>
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
              <div key={item.id} className="bg-white border-2 border-blue-50 rounded-[1.5rem] rounded-tr-none overflow-hidden shadow-sm hover:border-cyan-400 hover:shadow-md transition-all flex flex-col justify-between group">
                
                <div className="aspect-square bg-blue-50 relative overflow-hidden flex items-center justify-center border-b-2 border-blue-50">
                  {isVideo && (
                    <>
                      <video src={fullUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-blue-950/40 flex items-center justify-center backdrop-blur-sm">
                        <div className="p-3 bg-cyan-500 text-white rounded-2xl rounded-tr-none shadow-md"><Video size={20} /></div>
                      </div>
                    </>
                  )}
                  {isImage && (
                    <img src={fullUrl} alt={item.fileName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                  {isDocument && (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 text-slate-400">
                      <FileText size={48} className="mb-3 text-slate-300 group-hover:text-cyan-500 transition-colors" />
                      <span className="text-[11px] font-black uppercase tracking-widest bg-white px-3 py-1 rounded-xl shadow-sm border border-slate-100">{fileExtension}</span>
                    </div>
                  )}

                  <div className="absolute inset-x-0 top-0 p-3 bg-gradient-to-b from-blue-950/70 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={fullUrl} target="_blank" rel="noreferrer"
                      className="p-2 bg-white/90 hover:bg-white text-blue-950 rounded-xl shadow-sm transition-colors"
                      title="Buka File"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-sm transition-colors"
                      title="Hapus Fisik Permanen"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="absolute bottom-3 right-3 left-3">
                    <button 
                      onClick={() => handleCopyUrl(item.fileUrl, item.id)}
                      className={`w-full py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all ${isCopied ? 'bg-cyan-500 text-white' : 'bg-blue-950/90 hover:bg-blue-950 text-white opacity-0 group-hover:opacity-100 backdrop-blur-sm'}`}
                    >
                      {isCopied ? <><Check size={14}/> Disalin!</> : <><Copy size={14}/> Salin Tautan</>}
                    </button>
                  </div>
                </div>

                <div className="p-4 truncate bg-white">
                  <span className="text-[13px] font-black text-slate-800 block truncate group-hover:text-cyan-600 transition-colors" title={item.fileName}>
                    {item.fileName}
                  </span>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-medium">
                    <span className="font-mono bg-slate-50 px-2 py-1 rounded border border-slate-100">{(item.size / 1024).toFixed(1)} KB</span>
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