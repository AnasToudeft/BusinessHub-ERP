-- =========================================================
-- 0004_create_products.sql
-- Product catalog for the Products module.
-- Idempotent; single batch (no GO).
-- =========================================================

IF OBJECT_ID('dbo.Products', 'U') IS NULL
CREATE TABLE dbo.Products (
    Id          INT IDENTITY(1,1) CONSTRAINT PK_Products PRIMARY KEY,
    Sku         NVARCHAR(50)   NOT NULL,
    Name        NVARCHAR(200)  NOT NULL,
    Description NVARCHAR(1000) NULL,
    Category    NVARCHAR(100)  NULL,
    Unit        NVARCHAR(20)   NULL,
    Price       DECIMAL(18, 2) NOT NULL CONSTRAINT DF_Products_Price    DEFAULT (0),
    Cost        DECIMAL(18, 2) NULL,
    IsActive    BIT            NOT NULL CONSTRAINT DF_Products_IsActive  DEFAULT (1),
    CreatedAt   DATETIME2      NOT NULL CONSTRAINT DF_Products_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt   DATETIME2      NOT NULL CONSTRAINT DF_Products_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Products_Sku UNIQUE (Sku)
);

-- Supports name-ordered listing and search.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Products_Name')
    CREATE INDEX IX_Products_Name ON dbo.Products(Name);
