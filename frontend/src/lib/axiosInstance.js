import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api", // Базовый URL содержит /api
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// Правильное подключение интерсептора
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        "API Error:",
        error.response.status,
        error.response.data?.message || error.message
      );
      
      // Автоматический переход на login при 401
      if (error.response.status === 401) {
        window.location.href = "/login";
      }
    } else {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);