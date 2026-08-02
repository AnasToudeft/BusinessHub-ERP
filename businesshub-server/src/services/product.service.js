// Product business logic: pagination, existence checks, and SKU uniqueness.

import ApiError from "../utils/ApiError.js";
import { toPublicProduct } from "../models/product.model.js";
import * as productRepository from "../repositories/product.repository.js";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function normalizePaging({ page, pageSize }) {
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  let safeSize = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE;
  if (safeSize > MAX_PAGE_SIZE) safeSize = MAX_PAGE_SIZE;
  return { page: safePage, pageSize: safeSize };
}

function normalizeSku(sku) {
  return String(sku).trim();
}

export async function listProducts({ page, pageSize, search }) {
  const paging = normalizePaging({ page, pageSize });
  const { items, total } = await productRepository.list({
    ...paging,
    search: search ? String(search).trim() : null,
  });

  return {
    items: items.map(toPublicProduct),
    pagination: {
      page: paging.page,
      pageSize: paging.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / paging.pageSize)),
    },
  };
}

export async function getProduct(id) {
  const row = await productRepository.findById(id);
  if (!row) {
    throw ApiError.notFound("Product not found.");
  }
  return toPublicProduct(row);
}

export async function createProduct(data) {
  const sku = normalizeSku(data.sku);

  const existing = await productRepository.findBySku(sku);
  if (existing) {
    throw ApiError.conflict("A product with this SKU already exists.");
  }

  const row = await productRepository.create({ ...data, sku });
  return toPublicProduct(row);
}

export async function updateProduct(id, data) {
  const existing = await productRepository.findById(id);
  if (!existing) {
    throw ApiError.notFound("Product not found.");
  }

  const sku = normalizeSku(data.sku);
  if (sku !== existing.Sku) {
    const conflict = await productRepository.findBySku(sku);
    if (conflict && conflict.Id !== id) {
      throw ApiError.conflict("A product with this SKU already exists.");
    }
  }

  const row = await productRepository.update(id, { ...data, sku });
  return toPublicProduct(row);
}

export async function deleteProduct(id) {
  const deleted = await productRepository.remove(id);
  if (!deleted) {
    throw ApiError.notFound("Product not found.");
  }
}
