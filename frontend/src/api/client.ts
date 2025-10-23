import axios from "axios";
import { getApiBase } from "./config";

export const client = axios.create({
  baseURL: getApiBase(), // Will be: http://localhost:5000/api or http://your-vps-ip/api
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("⚠️ No auth token found");
  } else {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("❌ API Error:", {
      status: err.response?.status,
      url: err.config?.url,
      method: err.config?.method,
      data: err.response?.data,
    });
    return Promise.reject(err);
  }
);

export default client;
