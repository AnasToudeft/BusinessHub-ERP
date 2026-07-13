import axios from "axios";

// Central Axios instance for talking to the BusinessHub ERP API.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ---- Token storage (JWT session) ----
const TOKEN_KEY = "businesshub-token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Attach the Bearer token (when present) to every request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, drop the (now invalid) token and notify the app to end the session.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  }
);

// Pulls a user-facing message out of an Axios error (API envelope or fallback).
export function getErrorMessage(
  error,
  fallback = "Something went wrong. Please try again."
) {
  return error?.response?.data?.message || error?.message || fallback;
}

export default api;
