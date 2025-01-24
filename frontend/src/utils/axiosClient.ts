import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true, 
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;