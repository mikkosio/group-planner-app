import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/** Axios instance configured with base URL and JSON headers */
export const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

/** Interceptor to unwrap `data` from Axios responses, and auto-logout on 401 */
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("authToken");
            window.dispatchEvent(new Event("auth:logout"));
        }
        return Promise.reject(error);
    }
);

/** Interceptor to add Authorization header if token exists */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});