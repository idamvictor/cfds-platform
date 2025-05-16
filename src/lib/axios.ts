import axios from "axios";
import useUserStore from "@/store/userStore";

// Get the base URL from the current domain
const getBaseUrl = () => {
    const origin = window.location.origin;
    const hostname = window.location.hostname;

    // Special handling for localhost environments
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return "https://demo.13i7.com/api/v1";
    } else if (hostname.includes('cfds-platform.vercel.app')){
        return "https://demo.13i7.com/api/v1";
    } else {
        return `${origin}/api/v1`;
    }
};

const axiosInstance = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000, // 15 second timeout for all requests
});

export const setApiBaseUrl = (baseUrl: string) => {
    axiosInstance.defaults.baseURL = baseUrl;
};

// Add request interceptor to log requests
axiosInstance.interceptors.request.use(
    (config) => {

        // Get token from Zustand store
        const token = useUserStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Log the error response for debugging
        console.error("API Error:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method,
        });

        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const currentPath = window.location.pathname;

            const authRoutes = ["/", "/login", "/register", "/forgot-password"];
            const isAuthRoute = authRoutes.some((route) => currentPath === route);

            if (!isAuthRoute) {
                useUserStore.getState().clearUser();
                window.history.pushState({}, "", "/");
                window.dispatchEvent(new Event("popstate"));
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
