// Customer business logic: pagination, existence checks, and email uniqueness.

import ApiError from "../utils/ApiError.js";
import { toPublicCustomer } from "../models/customer.model.js";
import * as customerRepository from "../repositories/customer.repository.js";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function normalizePaging({ page, pageSize }) {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  let safeSize = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE;
  if (safeSize > MAX_PAGE_SIZE) safeSize = MAX_PAGE_SIZE;
  return { page: safePage, pageSize: safeSize };
}

function normalizeEmail(email) {
  return email ? String(email).trim().toLowerCase() : null;
}

export async function listCustomers({ page, pageSize, search }) {
  const paging = normalizePaging({ page, pageSize });
  const { items, total } = await customerRepository.list({
    ...paging,
    search: search ? String(search).trim() : null,
  });

  return {
    items: items.map(toPublicCustomer),
    pagination: {
      page: paging.page,
      pageSize: paging.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / paging.pageSize)),
    },
  };
}

export async function getCustomer(id) {
  const row = await customerRepository.findById(id);
  if (!row) {
    throw ApiError.notFound("Customer not found.");
  }
  return toPublicCustomer(row);
}

export async function createCustomer(data) {
  const email = normalizeEmail(data.email);

  if (email) {
    const existing = await customerRepository.findByEmail(email);
    if (existing) {
      throw ApiError.conflict("A customer with this email already exists.");
    }
  }

  const row = await customerRepository.create({ ...data, email });
  return toPublicCustomer(row);
}

export async function updateCustomer(id, data) {
  const existing = await customerRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound("Customer not found.");
  }

  const email = normalizeEmail(data.email);
  if (email && email !== (existing.Email ?? null)) {
    const conflict = await customerRepository.findByEmail(email);
    if (conflict && conflict.Id !== id) {
      throw ApiError.conflict("A customer with this email already exists.");
    }
  }

  const row = await customerRepository.update(id, { ...data, email });
  return toPublicCustomer(row);
}

export async function deleteCustomer(id) {
  const deleted = await customerRepository.remove(id);
  if (!deleted) {
    throw ApiError.notFound("Customer not found.");
  }
}
