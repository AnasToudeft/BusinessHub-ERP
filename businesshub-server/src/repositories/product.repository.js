// Data access for products. All queries are parameterized.

import { getPool, sql } from "../database/pool.js";

const COLUMNS = `Id, Sku, Name, Description, Category, Unit, Price, Cost,
                 IsActive, CreatedAt, UpdatedAt`;

const INSERTED = COLUMNS.split(",")
  .map((c) => `INSERTED.${c.trim()}`)
  .join(", ");

function applyProductInputs(request, data) {
  return request
    .input("sku", sql.NVarChar(50), data.sku)
    .input("name", sql.NVarChar(200), data.name)
    .input("description", sql.NVarChar(1000), data.description ?? null)
    .input("category", sql.NVarChar(100), data.category ?? null)
    .input("unit", sql.NVarChar(20), data.unit ?? null)
    .input("price", sql.Decimal(18, 2), data.price ?? 0)
    .input("cost", sql.Decimal(18, 2), data.cost ?? null)
    .input("isActive", sql.Bit, data.isActive ?? true);
}

// Returns { items, total }. `search` (optional) matches sku/name/category.
export async function list({ page, pageSize, search }) {
  const offset = (page - 1) * pageSize;
  const request = getPool()
    .request()
    .input("offset", sql.Int, offset)
    .input("limit", sql.Int, pageSize);

  let where = "";
  if (search) {
    request.input("search", sql.NVarChar(200), `%${search}%`);
    where =
      "WHERE Sku LIKE @search OR Name LIKE @search OR Category LIKE @search";
  }

  const result = await request.query(
    `SELECT ${COLUMNS}
     FROM dbo.Products
     ${where}
     ORDER BY Name
     OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;

     SELECT COUNT(*) AS total FROM dbo.Products ${where};`
  );

  return {
    items: result.recordsets[0],
    total: result.recordsets[1][0].total,
  };
}

export async function findById(id) {
  const result = await getPool()
    .request()
    .input("id", sql.Int, id)
    .query(`SELECT ${COLUMNS} FROM dbo.Products WHERE Id = @id`);
  return result.recordset[0] || null;
}

export async function findBySku(sku) {
  const result = await getPool()
    .request()
    .input("sku", sql.NVarChar(50), sku)
    .query("SELECT TOP 1 Id FROM dbo.Products WHERE Sku = @sku");
  return result.recordset[0] || null;
}

export async function create(data) {
  const request = applyProductInputs(getPool().request(), data);
  const result = await request.query(
    `INSERT INTO dbo.Products
       (Sku, Name, Description, Category, Unit, Price, Cost, IsActive)
     OUTPUT ${INSERTED}
     VALUES
       (@sku, @name, @description, @category, @unit, @price, @cost, @isActive)`
  );
  return result.recordset[0];
}

export async function update(id, data) {
  const request = applyProductInputs(getPool().request(), data).input(
    "id",
    sql.Int,
    id
  );
  const result = await request.query(
    `UPDATE dbo.Products
     SET Sku = @sku, Name = @name, Description = @description,
         Category = @category, Unit = @unit, Price = @price, Cost = @cost,
         IsActive = @isActive, UpdatedAt = SYSUTCDATETIME()
     OUTPUT ${INSERTED}
     WHERE Id = @id`
  );
  return result.recordset[0] || null;
}

// Returns the number of rows deleted (0 if the product did not exist).
export async function remove(id) {
  const result = await getPool()
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM dbo.Products WHERE Id = @id");
  return result.rowsAffected[0];
}
