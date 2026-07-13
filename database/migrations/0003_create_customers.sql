-- =========================================================
-- 0003_create_customers.sql
-- Customer records for the Customers module.
-- Idempotent; single batch (no GO).
-- =========================================================

IF OBJECT_ID('dbo.Customers', 'U') IS NULL
CREATE TABLE dbo.Customers (
    Id          INT IDENTITY(1,1) CONSTRAINT PK_Customers PRIMARY KEY,
    Name        NVARCHAR(200)  NOT NULL,
    Email       NVARCHAR(255)  NULL,
    Phone       NVARCHAR(50)   NULL,
    Company     NVARCHAR(200)  NULL,
    AddressLine NVARCHAR(255)  NULL,
    City        NVARCHAR(100)  NULL,
    Country     NVARCHAR(100)  NULL,
    Notes       NVARCHAR(1000) NULL,
    IsActive    BIT            NOT NULL CONSTRAINT DF_Customers_IsActive  DEFAULT (1),
    CreatedAt   DATETIME2      NOT NULL CONSTRAINT DF_Customers_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt   DATETIME2      NOT NULL CONSTRAINT DF_Customers_UpdatedAt DEFAULT SYSUTCDATETIME()
);

-- Unique email when provided (filtered: allows many customers without an email).
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_Customers_Email')
    CREATE UNIQUE INDEX UX_Customers_Email
        ON dbo.Customers(Email)
        WHERE Email IS NOT NULL;

-- Supports name-ordered listing and search.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Customers_Name')
    CREATE INDEX IX_Customers_Name ON dbo.Customers(Name);
