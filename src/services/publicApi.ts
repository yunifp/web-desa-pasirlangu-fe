import axios from "axios";
import { api } from "./api";

const baseURL = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/api$/, "") + "/api/public";

export const publicApi = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export const getBackendMediaUrl = (pathString: string) => {
  if (!pathString) return "";
  if (pathString.startsWith("http")) return pathString;
  const backendOrigin = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/api$/, "");
  return `${backendOrigin}${pathString}`;
};

export const publicProductApi = {
  getPublishedProducts: async (search?: string) => {
    const response = await api.get("/products", {
      params: { 
        status: "PUBLISHED", 
        search,
        limit: 100 // <--- TAMBAHKAN INI AGAR TAMPIL LEBIH DARI 10 PRODUK
      }
    });
    return response.data; 
  }
};