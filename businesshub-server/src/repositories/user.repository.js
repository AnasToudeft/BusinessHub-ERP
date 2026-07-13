// Data access for users and their role/permission assignments.
// All queries are parameterized (mssql request inputs) to prevent injection.

import { getPool, sql } from "../database/pool.js";

export async function findByEmail(email) {
  const result = await getPool()
    .request()
    .input("email", sql.NVarChar(255), email)
    .query(
      `SELECT TOP 1 Id, Email, PasswordHash, FirstName, LastName, IsActive
       FROM dbo.Users
       WHERE Email = @email`
    );
  return result.recordset[0] || null;
}

export async function findById(id) {
  const result = await getPool()
    .request()
    .input("id", sql.Int, id)
    .query(
      `SELECT TOP 1 Id, Email, PasswordHash, FirstName, LastName, IsActive
       FROM dbo.Users
       WHERE Id = @id`
    );
  return result.recordset[0] || null;
}

export async function createUser({ email, passwordHash, firstName, lastName }) {
  const result = await getPool()
    .request()
    .input("email", sql.NVarChar(255), email)
    .input("passwordHash", sql.NVarChar(255), passwordHash)
    .input("firstName", sql.NVarChar(100), firstName ?? null)
    .input("lastName", sql.NVarChar(100), lastName ?? null)
    .query(
      `INSERT INTO dbo.Users (Email, PasswordHash, FirstName, LastName)
       OUTPUT INSERTED.Id, INSERTED.Email, INSERTED.FirstName,
              INSERTED.LastName, INSERTED.IsActive
       VALUES (@email, @passwordHash, @firstName, @lastName)`
    );
  return result.recordset[0];
}

// Assigns a role (by name) to a user; no-op if already assigned or role missing.
export async function assignRoleByName(userId, roleName) {
  await getPool()
    .request()
    .input("userId", sql.Int, userId)
    .input("roleName", sql.NVarChar(50), roleName)
    .query(
      `INSERT INTO dbo.UserRoles (UserId, RoleId)
       SELECT @userId, r.Id
       FROM dbo.Roles r
       WHERE r.Name = @roleName
         AND NOT EXISTS (
             SELECT 1 FROM dbo.UserRoles ur
             WHERE ur.UserId = @userId AND ur.RoleId = r.Id
         )`
    );
}

export async function getRoleNames(userId) {
  const result = await getPool()
    .request()
    .input("userId", sql.Int, userId)
    .query(
      `SELECT r.Name
       FROM dbo.Roles r
       INNER JOIN dbo.UserRoles ur ON ur.RoleId = r.Id
       WHERE ur.UserId = @userId
       ORDER BY r.Name`
    );
  return result.recordset.map((row) => row.Name);
}

export async function getPermissionCodes(userId) {
  const result = await getPool()
    .request()
    .input("userId", sql.Int, userId)
    .query(
      `SELECT DISTINCT p.Code
       FROM dbo.Permissions p
       INNER JOIN dbo.RolePermissions rp ON rp.PermissionId = p.Id
       INNER JOIN dbo.UserRoles ur ON ur.RoleId = rp.RoleId
       WHERE ur.UserId = @userId
       ORDER BY p.Code`
    );
  return result.recordset.map((row) => row.Code);
}
