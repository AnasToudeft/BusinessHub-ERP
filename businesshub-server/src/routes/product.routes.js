// Product routes. Mounted at /api/products. All require authentication and the
// relevant products:* permission.

import { Router } from "express";

import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import {
  validateProduct,
  validateIdParam,
} from "../validators/product.validator.js";
import { authenticate } from "../middleware/authenticate.js";
import { requirePermissions } from "../middleware/authorize.js";

const router = Router();

router.use(authenticate);

router.get("/", requirePermissions("products:view"), listProducts);
router.post("/", requirePermissions("products:create"), validateProduct, createProduct);
router.get("/:id", requirePermissions("products:view"), validateIdParam, getProduct);
router.put(
  "/:id",
  requirePermissions("products:update"),
  validateIdParam,
  validateProduct,
  updateProduct
);
router.delete(
  "/:id",
  requirePermissions("products:delete"),
  validateIdParam,
  deleteProduct
);

export default router;
