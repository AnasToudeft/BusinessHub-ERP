// Auth API calls. Each returns the `data` payload from the API envelope.

import api from "./api.js";

export async function login(email, password) {
  const { data } = await api.post("/auth/login", { email, password });
  return data.data; // { user, roles, permissions, token }
}

export async function register(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data.data; // { user, roles, permissions, token }
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data.data; // { user, roles, permissions }
}
