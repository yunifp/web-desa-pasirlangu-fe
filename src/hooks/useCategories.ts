/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { api } from '../services/api';
import type { Category, CategoryFormData, PaginationMeta } from '../types/cms';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1
  });
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Ambil daftar kategori dengan paginasi (untuk tabel Admin)
  const fetchCategories = useCallback(async (page = 1, limit = 10, search = '') => {
    setIsLoadingCategories(true);
    try {
      const query = `?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`;
      const res = await api.get(`/categories${query}`);
      
      if (res.data?.data) {
        setCategories(res.data.data);
        if (res.data.meta) setPagination(res.data.meta);
      }
    } catch (err) {
      console.error("Gagal memuat kategori berpaginasi:", err);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  // Ambil seluruh daftar kategori murni tanpa paginasi (untuk Dropdown Form Postingan)
  const fetchCategoriesList = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      // Minta limit besar agar semua kategori terambil untuk opsi select
      const res = await api.get('/categories?limit=100');
      if (res.data?.data) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error("Gagal memuat daftar opsi kategori:", err);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  // Ambil satu kategori berdasarkan ID
  const getCategoryById = useCallback(async (id: string): Promise<Category | null> => {
    try {
      const res = await api.get(`/categories/${id}`);
      return res.data?.data || null;
    } catch (err) {
      console.error(`Gagal memuat kategori ID ${id}:`, err);
      return null;
    }
  }, []);

  // Buat kategori baru
  const createCategory = useCallback(async (data: CategoryFormData) => {
    try {
      const res = await api.post('/categories', data);
      return { success: true, message: "Kategori berhasil dibuat.", data: res.data?.data };
    } catch (err: any) {
      return { 
        success: false, 
        message: err.response?.data?.message || "Gagal membuat kategori." 
      };
    }
  }, []);

  // Perbarui kategori
  const updateCategory = useCallback(async (id: string, data: CategoryFormData) => {
    try {
      const res = await api.put(`/categories/${id}`, data);
      return { success: true, message: "Kategori berhasil diperbarui.", data: res.data?.data };
    } catch (err: any) {
      return { 
        success: false, 
        message: err.response?.data?.message || "Gagal memperbarui kategori." 
      };
    }
  }, []);

  // Hapus kategori
  const deleteCategory = useCallback(async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
      return { success: true, message: "Kategori berhasil dihapus." };
    } catch (err: any) {
      return { 
        success: false, 
        message: err.response?.data?.message || "Gagal menghapus kategori." 
      };
    }
  }, []);

  return {
    categories,
    pagination,
    isLoadingCategories,
    fetchCategories,
    fetchCategoriesList,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
  };
};