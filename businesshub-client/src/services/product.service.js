// Product API calls. Each returns the `data` payload from the API envelope.

import api from "./api.js";

export async function listProducts({ page = 1, pageSize = 20, q = "" } = {}) {
  const { data } = await api.get("/products", {
    params: { page, pageSize, q: q || undefined },
  });
  return data.data; // { items, pagination }
}

export async function getProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return data.data;
}

export async function createProduct(payload) {
  const { data } = await api.post("/products", payload);
  return data.data;
}

export async function updateProduct(id, payload) {
  const { data } = await api.put(`/products/${id}`, payload);
  return data.data;
}

export async function deleteProduct(id) {
  await api.delete(`/products/${id}`);
}
