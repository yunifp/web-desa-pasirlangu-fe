/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { useMediaLibrary } from '../../hooks/useMediaLibrary';
import { X, Upload, Loader2, Image as ImageIcon, Video, Trash2, FileText } from 'lucide-react';

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, type: 'IMAGE' | 'VIDEO' | 'DOCUMENT') => void;
}

export const MediaPickerModal: React.FC<MediaPickerProps> = ({ isOpen, onClose, onSelect }) => {
  const [activeTab, setActiveTab] = useState<'LIBRARY' | 'UPLOAD'>('LIBRARY');
  
  const { 
    mediaList, 
    isLoadingMedia, 
    isUploadingMedia, 
    fetchMediaAssets, 
    uploadAndRegisterSingleMedia, 
    deleteMediaAsset 
  } = useMediaLibrary();

  const getBackendUrl = (pathStr: string) => {
    if (!pathStr) return '';
    if (pathStr.startsWith('http')) return pathStr;
    const origin = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/api$/, "");
    return `${origin}${pathStr}`;
  };

  useEffect(() => {
    if (isOpen) {
      fetchMediaAssets();
      setActiveTab('LIBRARY');
    }
  }, [isOpen, fetchMediaAssets]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const finalPath = await uploadAndRegisterSingleMedia(file);
    
    if (finalPath) {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const fileType = isImage ? 'IMAGE' : isVideo ? 'VIDEO' : 'DOCUMENT';
      
      onSelect(finalPath, fileType);
      onClose();
    } else {
      alert("Gagal mengunggah dan meregistrasi aset media.");
    }
    
    e.target.value = '';
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Hapus permanen aset ini dari server?")) return;
    
    const success = await deleteMediaAsset(id);
    if (!success) {
      alert("Gagal menghapus aset penyimpanan.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 font-sans">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] animate-in zoom-in-95 duration-200 border border-slate-100">
        
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-800">Pustaka Aset Media & Dokumen</h2>
            <p className="text-xs text-slate-500 font-medium">Sisipkan visual, video, atau tautan dokumen langsung dari server penyimpanan.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-slate-100 px-6 pt-2 bg-slate-50/50 gap-2">
          <button 
            type="button" onClick={() => setActiveTab('LIBRARY')}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${activeTab === 'LIBRARY' ? 'border-blue-600 text-blue-600 bg-white rounded-t-xl shadow-2xs' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <ImageIcon size={14} /> Arsip Tersimpan ({mediaList.length})
          </button>
          <button 
            type="button" onClick={() => setActiveTab('UPLOAD')}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${activeTab === 'UPLOAD' ? 'border-blue-600 text-blue-600 bg-white rounded-t-xl shadow-2xs' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Upload size={14} /> Unggah File Baru
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto bg-slate-50/30">
          {activeTab === 'LIBRARY' && (
            isLoadingMedia ? (
              <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={32} /></div>
            ) : mediaList.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                <ImageIcon className="mx-auto text-slate-300 mb-2" size={36} />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pustaka Server Kosong</p>
                <p className="text-xs text-slate-400 mt-1">Gunakan laci 'Unggah File Baru' untuk mengisi penyimpanan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaList.map(item => {
                  const isImage = item.mimeType.startsWith('image/');
                  const isVideo = item.mimeType.startsWith('video/');
                  const isDocument = !isImage && !isVideo;
                  const fileType = isImage ? 'IMAGE' : isVideo ? 'VIDEO' : 'DOCUMENT';
                  const fullUrl = getBackendUrl(item.fileUrl);
                  const fileExtension = item.fileName.split('.').pop()?.toUpperCase() || 'FILE';
                  
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => {
                        onSelect(item.fileUrl, fileType);
                        onClose();
                      }}
                      className="aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200/80 hover:border-blue-600 cursor-pointer group relative shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="w-full h-4/5 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                        {isVideo && (
                          <>
                            <video src={fullUrl} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                              <div className="p-2 bg-blue-600 text-white rounded-full"><Video size={16} /></div>
                            </div>
                          </>
                        )}
                        {isImage && (
                          <img src={fullUrl} alt={item.fileName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        )}
                        {isDocument && (
                          <div className="flex flex-col items-center justify-center w-full h-full bg-slate-100 text-slate-400 group-hover:text-blue-500 transition-colors">
                            <FileText size={32} className="mb-1" />
                            <span className="text-[10px] font-black">{fileExtension}</span>
                          </div>
                        )}
                        
                        <button 
                          type="button" 
                          onClick={(e) => handleDelete(e, item.id)}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-sm"
                          title="Hapus Permanen"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div className="p-2 bg-slate-50 border-t border-slate-100 truncate text-center">
                        <span className="text-[10px] font-bold text-slate-700 block truncate">{item.fileName}</span>
                        <span className="text-[9px] text-slate-400 font-mono block">{(item.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {activeTab === 'UPLOAD' && (
            <div className="py-8">
              <div className="max-w-md mx-auto aspect-video border-2 border-dashed border-slate-300 hover:border-blue-600 rounded-3xl bg-white flex flex-col items-center justify-center p-6 relative transition-colors group">
                {isUploadingMedia ? (
                  <div className="text-center space-y-3">
                    <Loader2 className="animate-spin mx-auto text-blue-600" size={36} />
                    <p className="text-xs font-bold text-slate-600">Mengunggah & Meregistrasi Aset...</p>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={28} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 block">Pilih File Lokal dari Perangkat Anda</span>
                    <span className="text-[10px] text-slate-400 mt-1 block text-center">Mendukung Gambar, Video, dan Dokumen (PDF/Word/Excel)</span>
                    <input 
                      type="file" 
                      accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv" 
                      id="libUpload" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onChange={handleFileUpload} 
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-slate-100 text-center">
          <p className="text-[10px] font-semibold text-slate-400">
            💡 Tips: Jika Anda memilih dokumen, ia akan disuntikkan sebagai tautan (*link*). Gambar/Video akan disuntikkan sebagai media tertanam.
          </p>
        </div>

      </div>
    </div>
  );
};