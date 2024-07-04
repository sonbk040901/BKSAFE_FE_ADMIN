import axios, { AxiosError } from "axios";
import { getData } from "../utils/storage";
import { ErrorResponse } from "./types";
import { notification } from "antd";
const { VITE_BACKEND_URL, VITE_BACKEND_PORT } = import.meta.env as Record<
  string,
  string
>;
export const BASE_URL = VITE_BACKEND_PORT
  ? `${VITE_BACKEND_URL}:${VITE_BACKEND_PORT}/admin`
  : `${VITE_BACKEND_URL}/admin`;
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use((config) => {
  const token = getData<string>("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const data = error.response?.data;
    if (data?.error)
      void notification.error({
        message: data.error,
        description:
          data.message instanceof Array
            ? data.message.join("\n")
            : data.message,
      });
    return Promise.reject(error);
  },
);
export default axiosInstance;
