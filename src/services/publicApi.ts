import axios from "axios";

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