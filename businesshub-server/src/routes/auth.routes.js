// Auth routes. Mounted at /api/auth by the router aggregator.

import { Router } from "express";

import { register, login, me } from "../controllers/auth.controller.js";
import { validateRegister, validateLogin } from "../validators/auth.validator.js";
import { authenticate } from "../middleware/authenticate.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.get("/me", authenticate, me);

export default router;
