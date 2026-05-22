/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { api } from "../services/api";
import type { Page, PageFormData, Template } from "../types/cms";

export const usePages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  // Mengambil daftar master template untuk opsi dropdown pengikat layout
  const fetchTemplatesList = useCallback(async () => {
    setIsLoadingTemplates(true);
    try {
      const res = await api.get("/templates/all");
      setTemplates(res.data.data);
    } catch (err) {
      console.error("Gagal memuat daftar template:", err);
    } finally {
      setIsLoadingTemplates(false);
    }
  }, []);

  // Mengambil daftar seluruh halaman statis
  const fetchPages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/pages");
      setPages(res.data.data);
    } catch (err) {
      console.error("Gagal memuat halaman statis:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mengambil detail satu halaman berdasarkan ID
  const getPageById = async (id: string): Promise<Page | null> => {
    try {
      const res = await api.get(`/pages/${id}`);
      return res.data.data;
    } catch (err) {
      console.error("Gagal memuat detail halaman statis:", err);
      return null;
    }
  };

  // Mengunggah file gambar aktual secara aman (menggunakan endpoint upload artikel yang membagikan storage publik serupa)
  const uploadImageFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/posts/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data.url;
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengunggah file gambar halaman.");
      return null;
    }
  };

  const createPage = async (data: PageFormData) => {
    try {
      await api.post("/pages", data);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Gagal membuat halaman statis",
      };
    }
  };

  const updatePage = async (id: string, data: PageFormData) => {
    try {
      await api.put(`/pages/${id}`, data);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Gagal memperbarui halaman statis",
      };
    }
  };

  const deletePage = async (id: string) => {
    try {
      await api.delete(`/pages/${id}`);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Gagal menghapus halaman statis",
      };
    }
  };

  return {
    pages,
    templates,
    isLoading,
    isLoadingTemplates,
    fetchPages,
    fetchTemplatesList,
    getPageById,
    uploadImageFile,
    createPage,
    updatePage,
    deletePage,
  };
};