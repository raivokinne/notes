import axios from "axios";
import { storage } from "./storage";

export const api = axios.create({
    baseURL: "http://localhost:8001/api/v1",
    headers: {
        "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = storage.get<string>("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
