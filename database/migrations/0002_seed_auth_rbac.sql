-- =========================================================
-- 0002_seed_auth_rbac.sql
-- Default roles, permissions and role->permission mappings.
-- This is reference data required by the system (not sample data),
-- so it ships as a migration. Idempotent; single batch (no GO).
-- =========================================================

-- ----- Roles -----
INSERT INTO dbo.Roles (Name, Description)
SELECT v.Name, v.Description
FROM (VALUES
    ('Admin',    'Full system access, including user and role management'),
    ('Manager',  'Create and update business data; no deletes or administration'),
    ('Employee', 'Read-only access to business data')
) AS v(Name, Description)
WHERE NOT EXISTS (SELECT 1 FROM dbo.Roles r WHERE r.Name = v.Name);

-- ----- Permissions (code format: "resource:action") -----
INSERT INTO dbo.Permissions (Code, Description)
SELECT v.Code, v.Description
FROM (VALUES
    ('users:view',      'View users'),
    ('users:create',    'Create users'),
    ('users:update',    'Update users'),
    ('users:delete',    'Delete users'),
    ('roles:view',      'View roles'),
    ('roles:manage',    'Manage roles and permissions'),
    ('customers:view',  'View customers'),
    ('customers:create','Create customers'),
    ('customers:update','Update customers'),
    ('customers:delete','Delete customers'),
    ('products:view',   'View products'),
    ('products:create', 'Create products'),
    ('products:update', 'Update products'),
    ('products:delete', 'Delete products'),
    ('inventory:view',  'View inventory'),
    ('inventory:update','Adjust inventory levels'),
    ('invoices:view',   'View invoices'),
    ('invoices:create', 'Create invoices'),
    ('invoices:update', 'Update invoices'),
    ('invoices:delete', 'Delete invoices'),
    ('reports:view',    'View reports')
) AS v(Code, Description)
WHERE NOT EXISTS (SELECT 1 FROM dbo.Permissions p WHERE p.Code = v.Code);

-- ----- Admin: every permission -----
INSERT INTO dbo.RolePermissions (RoleId, PermissionId)
SELECT r.Id, p.Id
FROM dbo.Roles r
CROSS JOIN dbo.Permissions p
WHERE r.Name = 'Admin'
  AND NOT EXISTS (
      SELECT 1 FROM dbo.RolePermissions rp
      WHERE rp.RoleId = r.Id AND rp.PermissionId = p.Id
  );

-- ----- Manager: view/create/update on business data (no users/roles, no deletes) -----
INSERT INTO dbo.RolePermissions (RoleId, PermissionId)
SELECT r.Id, p.Id
FROM dbo.Roles r
CROSS JOIN dbo.Permissions p
WHERE r.Name = 'Manager'
  AND p.Code NOT LIKE 'users:%'
  AND p.Code NOT LIKE 'roles:%'
  AND (p.Code LIKE '%:view' OR p.Code LIKE '%:create' OR p.Code LIKE '%:update')
  AND NOT EXISTS (
      SELECT 1 FROM dbo.RolePermissions rp
      WHERE rp.RoleId = r.Id AND rp.PermissionId = p.Id
  );

-- ----- Employee: view-only on business data -----
INSERT INTO dbo.RolePermissions (RoleId, PermissionId)
SELECT r.Id, p.Id
FROM dbo.Roles r
CROSS JOIN dbo.Permissions p
WHERE r.Name = 'Employee'
  AND p.Code NOT LIKE 'users:%'
  AND p.Code NOT LIKE 'roles:%'
  AND p.Code LIKE '%:view'
  AND NOT EXISTS (
      SELECT 1 FROM dbo.RolePermissions rp
      WHERE rp.RoleId = r.Id AND rp.PermissionId = p.Id
  );
