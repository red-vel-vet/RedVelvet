import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { useNavigate } from "react-router-dom";

const apiURL = import.meta.env.VITE_API_URL || "https://rv-backend.fly.dev";

const api = axios.create({
    baseURL: apiURL,
});

api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            localStorage.clear();
            window.location.href = "/logout";
        }
        return Promise.reject(error);
    }
);

export default api;