// Validators for the Customers endpoints.

import ApiError from "../utils/ApiError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_LENGTHS = {
  name: 200,
  email: 255,
  phone: 50,
  company: 200,
  addressLine: 255,
  city: 100,
  country: 100,
  notes: 1000,
};

function validateBody(body, errors) {
  const {
    name,
    email,
    phone,
    company,
    addressLine,
    city,
    country,
    notes,
    isActive,
  } = body;

  if (!name || String(name).trim().length === 0) {
    errors.name = "Name is required.";
  } else if (String(name).length > MAX_LENGTHS.name) {
    errors.name = `Name must be at most ${MAX_LENGTHS.name} characters.`;
  }

  if (email != null && email !== "") {
    if (!EMAIL_REGEX.test(String(email))) {
      errors.email = "Email must be a valid address.";
    } else if (String(email).length > MAX_LENGTHS.email) {
      errors.email = `Email must be at most ${MAX_LENGTHS.email} characters.`;
    }
  }

  for (const field of ["phone", "company", "addressLine", "city", "country", "notes"]) {
    const value = { phone, company, addressLine, city, country, notes }[field];
    if (value != null && String(value).length > MAX_LENGTHS[field]) {
      errors[field] = `${field} must be at most ${MAX_LENGTHS[field]} characters.`;
    }
  }

  if (isActive != null && typeof isActive !== "boolean") {
    errors.isActive = "isActive must be a boolean.";
  }
}

export function validateCustomer(req, res, next) {
  const errors = {};
  validateBody(req.body || {}, errors);
  if (Object.keys(errors).length > 0) {
    return next(ApiError.badRequest("Validation failed.", errors));
  }
  next();
}

// Ensures :id is a positive integer and exposes it as req.customerId.
export function validateIdParam(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return next(ApiError.badRequest("Invalid customer id."));
  }
  req.customerId = id;
  next();
}
