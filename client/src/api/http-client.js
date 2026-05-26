import axios from "axios";
import { clearAccessToken, getAccessToken, saveAccessToken } from "../shared/utils/token-storage";
import { extractErrorMessage } from "../shared/utils/response";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api/v1";

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 12000
});

let isRefreshing = false;
let pendingRequests = [];

function resolvePending(token) {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
}

http.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error?.response?.status;

    if (status !== 401 || originalRequest._retry) {
      return Promise.reject(new Error(extractErrorMessage(error)));
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(http(originalRequest));
        });
      });
    }

    try {
      isRefreshing = true;
      originalRequest._retry = true;

      const refreshResponse = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      const newToken = refreshResponse?.data?.data?.token || refreshResponse?.data?.token;
      if (!newToken) throw new Error("Session expired. Please login again.");

      saveAccessToken(newToken);
      resolvePending(newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return http(originalRequest);
    } catch (refreshError) {
      clearAccessToken();
      return Promise.reject(new Error(extractErrorMessage(refreshError)));
    } finally {
      isRefreshing = false;
    }
  }
);

export { http };
