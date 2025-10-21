// frontend/api/client.ts
import axios from "axios";

export const client = axios.create({
  baseURL: "http://localhost:5000",
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
