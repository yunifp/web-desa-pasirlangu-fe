/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { api } from "../services/api";
import type {
  Template,
  TemplateFormData,
  Category,
  CategoryFormData,
  PaginationMeta,
} from "../types/cms";

export const useCmsConfig = () => {
  // --- States untuk Template ---
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateMeta, setTemplateMeta] = useState<PaginationMeta>({
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 0,
  });

  // --- States untuk Kategori ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryMeta, setCategoryMeta] = useState<PaginationMeta>({
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 0,
  });

  // --- Loading States ---
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // ==========================================================================
  // LOGIKA API TEMPLATE
  // ==========================================================================
  const fetchTemplates = useCallback(
    async (page: number = 1, limit: number = 10, search: string = "") => {
      setIsLoadingTemplates(true);
      try {
        const query = `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
        const res = await api.get(`/templates${query}`);
        setTemplates(res.data.data);
        if (res.data.meta) setTemplateMeta(res.data.meta);
      } catch (err: any) {
        console.error("Gagal memuat templates:", err);
      } finally {
        setIsLoadingTemplates(false);
      }
    },
    [],
  );

  const createTemplate = async (data: TemplateFormData) => {
    try {
      await api.post("/templates", data);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Gagal membuat template",
      };
    }
  };

  const updateTemplate = async (id: string, data: TemplateFormData) => {
    try {
      await api.put(`/templates/${id}`, data);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Gagal memperbarui template",
      };
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await api.delete(`/templates/${id}`);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Gagal menghapus template",
      };
    }
  };

  // ==========================================================================
  // LOGIKA API KATEGORI
  // ==========================================================================
  const fetchCategories = useCallback(
    async (page: number = 1, limit: number = 10, search: string = "") => {
      setIsLoadingCategories(true);
      try {
        const query = `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
        const res = await api.get(`/categories${query}`);
        setCategories(res.data.data);
        if (res.data.meta) setCategoryMeta(res.data.meta);
      } catch (err: any) {
        console.error("Gagal memuat kategori:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    },
    [],
  );

  const createCategory = async (data: CategoryFormData) => {
    try {
      await api.post("/categories", data);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Gagal membuat kategori",
      };
    }
  };

  const updateCategory = async (id: string, data: CategoryFormData) => {
    try {
      await api.put(`/categories/${id}`, data);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Gagal memperbarui kategori",
      };
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Gagal menghapus kategori",
      };
    }
  };

  return {
    // Return Template
    templates,
    templateMeta,
    isLoadingTemplates,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,

    // Return Category
    categories,
    categoryMeta,
    isLoadingCategories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};