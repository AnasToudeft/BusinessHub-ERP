// Customer API calls. Each returns the `data` payload from the API envelope.

import api from "./api.js";

export async function listCustomers({ page = 1, pageSize = 20, q = "" } = {}) {
  const { data } = await api.get("/customers", {
    params: { page, pageSize, q: q || undefined },
  });
  return data.data; // { items, pagination }
}

export async function getCustomer(id) {
  const { data } = await api.get(`/customers/${id}`);
  return data.data;
}

export async function createCustomer(payload) {
  const { data } = await api.post("/customers", payload);
  return data.data;
}

export async function updateCustomer(id, payload) {
  const { data } = await api.put(`/customers/${id}`, payload);
  return data.data;
}

export async function deleteCustomer(id) {
  await api.delete(`/customers/${id}`);
}
