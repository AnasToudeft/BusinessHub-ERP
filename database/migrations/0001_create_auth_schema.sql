-- =========================================================
-- 0001_create_auth_schema.sql
-- Authentication & authorization (RBAC) schema:
-- Users, Roles, Permissions and their many-to-many links.
-- Idempotent; single batch (no GO).
-- =========================================================

IF OBJECT_ID('dbo.Users', 'U') IS NULL
CREATE TABLE dbo.Users (
    Id           INT IDENTITY(1,1) CONSTRAINT PK_Users PRIMARY KEY,
    Email        NVARCHAR(255) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    FirstName    NVARCHAR(100) NULL,
    LastName     NVARCHAR(100) NULL,
    IsActive     BIT           NOT NULL CONSTRAINT DF_Users_IsActive  DEFAULT (1),
    CreatedAt    DATETIME2     NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt    DATETIME2     NOT NULL CONSTRAINT DF_Users_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Users_Email UNIQUE (Email)
);

IF OBJECT_ID('dbo.Roles', 'U') IS NULL
CREATE TABLE dbo.Roles (
    Id          INT IDENTITY(1,1) CONSTRAINT PK_Roles PRIMARY KEY,
    Name        NVARCHAR(50)  NOT NULL,
    Description NVARCHAR(255) NULL,
    CreatedAt   DATETIME2     NOT NULL CONSTRAINT DF_Roles_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt   DATETIME2     NOT NULL CONSTRAINT DF_Roles_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Roles_Name UNIQUE (Name)
);

IF OBJECT_ID('dbo.Permissions', 'U') IS NULL
CREATE TABLE dbo.Permissions (
    Id          INT IDENTITY(1,1) CONSTRAINT PK_Permissions PRIMARY KEY,
    Code        NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255) NULL,
    CreatedAt   DATETIME2     NOT NULL CONSTRAINT DF_Permissions_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Permissions_Code UNIQUE (Code)
);

IF OBJECT_ID('dbo.UserRoles', 'U') IS NULL
CREATE TABLE dbo.UserRoles (
    UserId INT NOT NULL,
    RoleId INT NOT NULL,
    CONSTRAINT PK_UserRoles PRIMARY KEY (UserId, RoleId),
    CONSTRAINT FK_UserRoles_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_UserRoles_Roles FOREIGN KEY (RoleId) REFERENCES dbo.Roles(Id) ON DELETE CASCADE
);

IF OBJECT_ID('dbo.RolePermissions', 'U') IS NULL
CREATE TABLE dbo.RolePermissions (
    RoleId       INT NOT NULL,
    PermissionId INT NOT NULL,
    CONSTRAINT PK_RolePermissions PRIMARY KEY (RoleId, PermissionId),
    CONSTRAINT FK_RolePermissions_Roles       FOREIGN KEY (RoleId)       REFERENCES dbo.Roles(Id)       ON DELETE CASCADE,
    CONSTRAINT FK_RolePermissions_Permissions FOREIGN KEY (PermissionId) REFERENCES dbo.Permissions(Id) ON DELETE CASCADE
);

-- Reverse-lookup indexes for the join tables (the composite PK covers the
-- leading column; these cover the second column).
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_UserRoles_RoleId')
    CREATE INDEX IX_UserRoles_RoleId ON dbo.UserRoles(RoleId);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_RolePermissions_PermissionId')
    CREATE INDEX IX_RolePermissions_PermissionId ON dbo.RolePermissions(PermissionId);
