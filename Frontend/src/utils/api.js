// src/utils/api.js
import axios from "axios";

// ✅ Base URL (falls back to excel-analytics-backend-daoj.onrender.com if env not set)
const baseURL =
  process.env.REACT_APP_API_URL || "https://excel-analytics-backend-daoj.onrender.com";

// ✅ Ensure API suffix
const api = axios.create({
  baseURL: baseURL.endsWith("/api") ? baseURL : `${baseURL}/api`,
});

// ✅ Attach JWT token automatically (only if exists)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle 401 (unauthorized) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // redirect if token expired
    }
    return Promise.reject(error);
  }
);

export default api;