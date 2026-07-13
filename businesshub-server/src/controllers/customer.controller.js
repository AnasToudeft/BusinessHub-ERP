// Customer controllers: thin HTTP layer over the customer service.

import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import * as customerService from "../services/customer.service.js";

// GET /api/customers?page=&pageSize=&q=
export const listCustomers = asyncHandler(async (req, res) => {
  const page = req.query.page ? Number(req.query.page) : undefined;
  const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined;
  const result = await customerService.listCustomers({
    page,
    pageSize,
    search: req.query.q,
  });
  sendSuccess(res, { message: "Customers retrieved.", data: result });
});

// GET /api/customers/:id
export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.getCustomer(req.customerId);
  sendSuccess(res, { message: "Customer retrieved.", data: customer });
});

// POST /api/customers
export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.createCustomer(req.body);
  sendSuccess(res, {
    statusCode: 201,
    message: "Customer created.",
    data: customer,
  });
});

// PUT /api/customers/:id
export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.updateCustomer(req.customerId, req.body);
  sendSuccess(res, { message: "Customer updated.", data: customer });
});

// DELETE /api/customers/:id
export const deleteCustomer = asyncHandler(async (req, res) => {
  await customerService.deleteCustomer(req.customerId);
  sendSuccess(res, { message: "Customer deleted." });
});
