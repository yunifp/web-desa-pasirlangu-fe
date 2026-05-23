import { api } from "./api";
import { type Product } from "../types/cms";

export const productApi = {
 getAll: async (params?: { search?: string; status?: string; page?: number; limit?: number }) => {
    const response = await api.get("/products/manage/me", { params });
    return response.data;
  },
  
  getByIdOrSlug: async (idOrSlug: string) => {
    const response = await api.get(`/products/${idOrSlug}`);
    return response.data;
  },

  create: async (data: Partial<Product>) => {
    const response = await api.post("/products", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Product>) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  uploadImage: async (formData: FormData) => {
    const response = await api.post("/products/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
};