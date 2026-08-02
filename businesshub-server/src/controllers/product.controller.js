// Product controllers: thin HTTP layer over the product service.

import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import * as productService from "../services/product.service.js";

// GET /api/products?page=&pageSize=&q=
export const listProducts = asyncHandler(async (req, res) => {
  const page = req.query.page ? Number(req.query.page) : undefined;
  const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined;
  const result = await productService.listProducts({
    page,
    pageSize,
    search: req.query.q,
  });
  sendSuccess(res, { message: "Products retrieved.", data: result });
});

// GET /api/products/:id
export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProduct(req.productId);
  sendSuccess(res, { message: "Product retrieved.", data: product });
});

// POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: "Product created.",
    data: product,
  });
});

// PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.productId, req.body);
  sendSuccess(res, { message: "Product updated.", data: product });
});

// DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.productId);
  sendSuccess(res, { message: "Product deleted." });
});
