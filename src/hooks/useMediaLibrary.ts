import { useState, useCallback } from 'react';
import { api } from '../services/api';
import { usePages } from './usePages';

export interface MediaAssetItem {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export const useMediaLibrary = () => {
  const [mediaList, setMediaList] = useState<MediaAssetItem[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // Catatan: Pastikan logika hook uploadImageFile Anda di backend/API
  // tidak menolak ekstensi selain gambar/video.
  const { uploadImageFile } = usePages();

  const fetchMediaAssets = useCallback(async () => {
    setIsLoadingMedia(true);
    try {
      const res = await api.get('/media');
      if (res.data?.data && Array.isArray(res.data.data)) {
        setMediaList(res.data.data);
      }
    } catch (err) {
      console.error("Gagal menyedot daftar pustaka media:", err);
    } finally {
      setIsLoadingMedia(false);
    }
  }, []);

  const uploadAndRegisterSingleMedia = useCallback(async (file: File): Promise<string | null> => {
    setIsUploadingMedia(true);
    try {
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
        return uploadedPath;
      }
      return null;
    } catch (err) {
      console.error("Gagal proses unggah & registrasi file tunggal:", err);
      return null;
    } finally {
      setIsUploadingMedia(false);
    }
  }, [uploadImageFile]);

  const deleteMediaAsset = useCallback(async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/media/${id}`);
      setMediaList(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err) {
      console.error(`Gagal membasmi aset ID ${id}:`, err);
      return false;
    }
  }, []);

  return {
    mediaList,
    isLoadingMedia,
    isUploadingMedia,
    fetchMediaAssets,
    uploadAndRegisterSingleMedia,
    deleteMediaAsset
  };
};