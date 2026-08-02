// Validators for the Products endpoints.

import ApiError from "../utils/ApiError.js";

const MAX_LENGTHS = {
  sku: 50,
  name: 200,
  description: 1000,
  category: 100,
  unit: 20,
};

function validateMoney(value, field, errors, { required }) {
  if (value == null || value === "") {
    if (required) errors[field] = `${field} is required.`;
    return;
  }
  if (typeof value !== "number" || !Number.isFinite(value)) {
    errors[field] = `${field} must be a number.`;
  } else if (value < 0) {
    errors[field] = `${field} must be zero or greater.`;
  }
}

export function validateProduct(req, res, next) {
  const body = req.body || {};
  const errors = {};

  if (!body.sku || String(body.sku).trim().length === 0) {
    errors.sku = "SKU is required.";
  } else if (String(body.sku).length > MAX_LENGTHS.sku) {
    errors.sku = `SKU must be at most ${MAX_LENGTHS.sku} characters.`;
  }

  if (!body.name || String(body.name).trim().length === 0) {
    errors.name = "Name is required.";
  } else if (String(body.name).length > MAX_LENGTHS.name) {
    errors.name = `Name must be at most ${MAX_LENGTHS.name} characters.`;
  }

  for (const field of ["description", "category", "unit"]) {
    if (body[field] != null && String(body[field]).length > MAX_LENGTHS[field]) {
      errors[field] = `${field} must be at most ${MAX_LENGTHS[field]} characters.`;
    }
  }

  validateMoney(body.price, "price", errors, { required: true });
  validateMoney(body.cost, "cost", errors, { required: false });

  if (body.isActive != null && typeof body.isActive !== "boolean") {
    errors.isActive = "isActive must be a boolean.";
  }

  if (Object.keys(errors).length > 0) {
    return next(ApiError.badRequest("Validation failed.", errors));
  }
  next();
}

// Ensures :id is a positive integer and exposes it as req.productId.
export function validateIdParam(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return next(ApiError.badRequest("Invalid product id."));
  }
  req.productId = id;
  next();
}
