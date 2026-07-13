// Authorization middleware factories. Use after `authenticate`.
//
//   requirePermissions("customers:view")   // caller must have ALL listed codes
//   requireRoles("Admin", "Manager")        // caller must have ANY listed role
//
// Not yet applied to routes (no business modules exist), but ready for them.

import ApiError from "../utils/ApiError.js";

export function requirePermissions(...requiredCodes) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required."));
    }
    const granted = new Set(req.user.permissions || []);
    const hasAll = requiredCodes.every((code) => granted.has(code));
    if (!hasAll) {
      return next(ApiError.forbidden("Insufficient permissions."));
    }
    next();
  };
}

export function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required."));
    }
    const roles = new Set(req.user.roles || []);
    const hasAny = allowedRoles.some((role) => roles.has(role));
    if (!hasAny) {
      return next(ApiError.forbidden("Insufficient role."));
    }
    next();
  };
}
