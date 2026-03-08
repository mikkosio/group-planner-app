import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/** Axios instance configured with base URL and JSON headers */
export const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

/** Interceptor to unwrap `data` from Axios responses */
api.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
);

/** Interceptor to add Authorization header if token exists */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});