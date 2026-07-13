// Authentication business logic: registration, login, and profile retrieval.

import ApiError from "../utils/ApiError.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { toPublicUser } from "../models/user.model.js";
import * as userRepository from "../repositories/user.repository.js";

const DEFAULT_ROLE = "Employee";

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

// Builds the JWT payload + issues a token. Roles/permissions are embedded so
// authorization can happen without a DB round-trip on every request.
function issueToken(user, roles, permissions) {
  return signToken({
    sub: user.Id,
    email: user.Email,
    roles,
    permissions,
  });
}

export async function register({ email, password, firstName, lastName }) {
  const normalizedEmail = normalizeEmail(email);

  const existing = await userRepository.findByEmail(normalizedEmail);
  if (existing) {
    throw ApiError.conflict("An account with this email already exists.");
  }

  const passwordHash = await hashPassword(password);
  const user = await userRepository.createUser({
    email: normalizedEmail,
    passwordHash,
    firstName,
    lastName,
  });

  // Every new account starts with the default (least-privilege) role.
  await userRepository.assignRoleByName(user.Id, DEFAULT_ROLE);

  const [roles, permissions] = await Promise.all([
    userRepository.getRoleNames(user.Id),
    userRepository.getPermissionCodes(user.Id),
  ]);

  const token = issueToken(user, roles, permissions);
  return { user: toPublicUser(user), roles, permissions, token };
}

export async function login(email, password) {
  const normalizedEmail = normalizeEmail(email);

  const user = await userRepository.findByEmail(normalizedEmail);
  // Same generic error whether the user is missing or the password is wrong,
  // so we don't leak which emails are registered.
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  if (!user.IsActive) {
    throw ApiError.forbidden("This account is disabled.");
  }

  const passwordMatches = await comparePassword(password, user.PasswordHash);
  if (!passwordMatches) {
    throw ApiError.unauthorized("Invalid email or password.");
  }

  const [roles, permissions] = await Promise.all([
    userRepository.getRoleNames(user.Id),
    userRepository.getPermissionCodes(user.Id),
  ]);

  const token = issueToken(user, roles, permissions);
  return { user: toPublicUser(user), roles, permissions, token };
}

export async function getProfile(userId) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw ApiError.notFound("User not found.");
  }

  const [roles, permissions] = await Promise.all([
    userRepository.getRoleNames(user.Id),
    userRepository.getPermissionCodes(user.Id),
  ]);

  return { user: toPublicUser(user), roles, permissions };
}
