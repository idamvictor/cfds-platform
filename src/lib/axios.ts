import axios from "axios";
import useUserStore from "@/store/userStore";

const axiosInstance = axios.create({
  baseURL: "https://cfd.surdonline.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});


export const setApiBaseUrl = (baseUrl: string) => {
    axiosInstance.defaults.baseURL = baseUrl;
};

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

        const currentPath = window.location.pathname;

        const authRoutes = ['/', '/login', '/register', '/forgot-password'];
        const isAuthRoute = authRoutes.some(route => currentPath === route);


        if (!isAuthRoute) {

            useUserStore.getState().clearUser();

            window.history.pushState({}, '', '/');
            window.dispatchEvent(new Event('popstate'));
        }

    }

    return Promise.reject(error)
  },
)

export default axiosInstance;
