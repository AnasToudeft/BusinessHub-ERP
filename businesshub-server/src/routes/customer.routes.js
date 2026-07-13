// Customer routes. Mounted at /api/customers. All require authentication and
// the relevant customers:* permission.

import { Router } from "express";

import {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller.js";
import {
  validateCustomer,
  validateIdParam,
} from "../validators/customer.validator.js";
import { authenticate } from "../middleware/authenticate.js";
import { requirePermissions } from "../middleware/authorize.js";

const router = Router();

// Every customer endpoint requires a valid session.
router.use(authenticate);

router.get("/", requirePermissions("customers:view"), listCustomers);
router.post("/", requirePermissions("customers:create"), validateCustomer, createCustomer);
router.get("/:id", requirePermissions("customers:view"), validateIdParam, getCustomer);
router.put(
  "/:id",
  requirePermissions("customers:update"),
  validateIdParam,
  validateCustomer,
  updateCustomer
);
router.delete(
  "/:id",
  requirePermissions("customers:delete"),
  validateIdParam,
  deleteCustomer
);

export default router;
