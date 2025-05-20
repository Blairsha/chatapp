import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isLoggingOut: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.error("Ошибка при проверке авторизации:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      return { success: true };
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Не удалось создать аккаунт. Пожалуйста, попробуйте снова." 
      };
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Вход выполнен успешно"); // Переведено
    } catch (error) {
      console.error("Ошибка входа:", error);
      toast.error(
        error.response?.data?.message || 
        "Не удалось войти. Пожалуйста, попробуйте снова." // Переведено
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      return { success: true };
    } catch (error) {
      console.error("Ошибка выхода:", error);
      toast.error(error.response?.data?.message || "Не удалось выйти"); // Переведено
      return { 
        success: false,
        error: error.response?.data?.message || "Не удалось выйти" // Переведено
      };
    } finally {
      set({ isLoggingOut: false });
    }
  },
  
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Профиль успешно обновлен"); // Переведено
    } catch (error) {
      console.log("Ошибка при обновлении профиля:", error); // Переведено
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));