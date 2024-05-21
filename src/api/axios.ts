import axios from "axios";
import { getData } from "../utils/storage";
const { VITE_BACKEND_URL, VITE_BACKEND_PORT } = import.meta.env;
// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
export const BASE_URL = `${VITE_BACKEND_URL}:${VITE_BACKEND_PORT}/`;
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use((config) => {
  const token = getData<string>("token");
  // if (token) {
  config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

export default axiosInstance;
