// src/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // example: http://localhost:5000/api
  withCredentials: true, // ✅ include cookies (like JWT token)
});

export default axiosInstance;
