import axios from "axios";
import useUserStore from "@/store/userStore";

const axiosInstance = axios.create({
  baseURL: "https://cfd.surdonline.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach auth token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from Zustand store
    const token = useUserStore.getState().token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 (Unauthorized) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Clear user data and redirect to login
      useUserStore.getState().clearUser()

      // Redirect to login if in browser environment
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance;
