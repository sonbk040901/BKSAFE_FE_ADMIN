import axios, { AxiosError } from "axios";
import { getData } from "../utils/storage";
import { ErrorResponse } from "./types";
import { notification } from "antd";
const { VITE_BACKEND_URL, VITE_BACKEND_PORT } = import.meta.env;
// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
export const BASE_URL = `${VITE_BACKEND_URL}:${VITE_BACKEND_PORT}/admin`;
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
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response?.data.error)
      void notification.error({
        message: error.response?.data.error,
        description: error.response?.data.message,
      });
    return Promise.reject(error);
  },
);
export default axiosInstance;
