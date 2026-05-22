/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { api } from "../services/api"; // cite: uploaded:yunifp/cms-fe/cms-fe-4215d9316244a542ddeae0c0972e5fbd4c87613e/src/services/api.ts
import type { Post, PostFormData, Category, PaginationMeta } from "../types/cms";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    totalItems: 0, currentPage: 1, itemsPerPage: 10, totalPages: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const fetchCategoriesList = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      const res = await api.get("/categories/all"); // cite: uploaded:yunifp/cms-fe/cms-fe-4215d9316244a542ddeae0c0972e5fbd4c87613e/src/services/api.ts
      setCategories(res.data.data);
    } catch (err) { console.error(err); } 
    finally { setIsLoadingCategories(false); }
  }, []);

  const fetchPosts = useCallback(async (page = 1, limit = 10, search = "", status = "", categoryId = "") => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) query.append("search", search);
      if (status) query.append("status", status);
      if (categoryId) query.append("categoryId", categoryId);

      const res = await api.get(`/posts?${query.toString()}`); // cite: uploaded:yunifp/cms-fe/cms-fe-4215d9316244a542ddeae0c0972e5fbd4c87613e/src/services/api.ts
      setPosts(res.data.data);
      if (res.data.meta) setMeta(res.data.meta);
    } catch (err) { console.error(err); } 
    finally { setIsLoading(false); }
  }, []);

  const getPostById = async (id: string): Promise<Post | null> => {
    try {
      const res = await api.get(`/posts/${id}`); // cite: uploaded:yunifp/cms-fe/cms-fe-4215d9316244a542ddeae0c0972e5fbd4c87613e/src/services/api.ts
      return res.data.data;
    } catch (err) { console.error(err); return null; }
  };

  // UPLOAD FILE GAMBAR
  const uploadImageFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/posts/upload-image", formData, { // cite: uploaded:yunifp/cms-fe/cms-fe-4215d9316244a542ddeae0c0972e5fbd4c87613e/src/services/api.ts
        headers: { "Content-Type": "multipart/form-data" }
      });
      return res.data.data.url; // Contoh: "/uploads/posts/post-123.jpg"
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengunggah file gambar.");
      return null;
    }
  };

  const createPost = async (data: PostFormData) => {
    try { await api.post("/posts", data); return { success: true }; }  // cite: uploaded:yunifp/cms-fe/cms-fe-4215d9316244a542ddeae0c0972e5fbd4c87613e/src/services/api.ts
    catch (err: any) { return { success: false, message: err.response?.data?.message }; }
  };

  const updatePost = async (id: string, data: PostFormData) => {
    try { await api.put(`/posts/${id}`, data); return { success: true }; }  // cite: uploaded:yunifp/cms-fe/cms-fe-4215d9316244a542ddeae0c0972e5fbd4c87613e/src/services/api.ts
    catch (err: any) { return { success: false, message: err.response?.data?.message }; }
  };

  const deletePost = async (id: string) => {
    try { await api.delete(`/posts/${id}`); return { success: true }; }  // cite: uploaded:yunifp/cms-fe/cms-fe-4215d9316244a542ddeae0c0972e5fbd4c87613e/src/services/api.ts
    catch (err: any) { return { success: false, message: err.response?.data?.message }; }
  };

  return {
    posts, categories, meta, isLoading, isLoadingCategories,
    fetchPosts, fetchCategoriesList, getPostById, uploadImageFile,
    createPost, updatePost, deletePost,
  };
};