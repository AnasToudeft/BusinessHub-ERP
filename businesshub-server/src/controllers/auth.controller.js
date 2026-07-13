// Auth controllers: thin HTTP layer over the auth service.

import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import * as authService from "../services/auth.service.js";

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const result = await authService.register({ email, password, firstName, lastName });
  sendSuccess(res, {
    statusCode: 201,
    message: "Registration successful.",
    data: result,
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  sendSuccess(res, { message: "Login successful.", data: result });
});

// GET /api/auth/me (protected)
export const me = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user.id);
  sendSuccess(res, { message: "Current user.", data: profile });
});
