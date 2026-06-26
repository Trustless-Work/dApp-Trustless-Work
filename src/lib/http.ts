import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getStoredNetwork } from "@/lib/client-storage";
import { parseApiError, type ApiError, type ProblemDetails } from "@/lib/api-error";

const http = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30_000,
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    config.headers.set("x-network", getStoredNetwork());
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ProblemDetails>) => {
    const apiError: ApiError = parseApiError(error);
    return Promise.reject(apiError);
  },
);

export default http;
export type { ApiError };
