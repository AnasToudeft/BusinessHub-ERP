// Request-body validators for the auth endpoints. On failure they forward a
// 400 ApiError whose `details` map field -> message.

import ApiError from "../utils/ApiError.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function validateRegister(req, res, next) {
  const { email, password, firstName, lastName } = req.body || {};
  const errors = {};

  if (!email || !EMAIL_REGEX.test(String(email))) {
    errors.email = "A valid email is required.";
  }
  if (!password || String(password).length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (firstName != null && String(firstName).length > 100) {
    errors.firstName = "First name must be at most 100 characters.";
  }
  if (lastName != null && String(lastName).length > 100) {
    errors.lastName = "Last name must be at most 100 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return next(ApiError.badRequest("Validation failed.", errors));
  }
  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body || {};
  const errors = {};

  if (!email || !EMAIL_REGEX.test(String(email))) {
    errors.email = "A valid email is required.";
  }
  if (!password) {
    errors.password = "Password is required.";
  }

  if (Object.keys(errors).length > 0) {
    return next(ApiError.badRequest("Validation failed.", errors));
  }
  next();
}
