// Data access for customers. All queries are parameterized.

import { getPool, sql } from "../database/pool.js";

const COLUMNS = `Id, Name, Email, Phone, Company, AddressLine, City, Country,
                 Notes, IsActive, CreatedAt, UpdatedAt`;

function applyCustomerInputs(request, data) {
  return request
    .input("name", sql.NVarChar(200), data.name)
    .input("email", sql.NVarChar(255), data.email ?? null)
    .input("phone", sql.NVarChar(50), data.phone ?? null)
    .input("company", sql.NVarChar(200), data.company ?? null)
    .input("addressLine", sql.NVarChar(255), data.addressLine ?? null)
    .input("city", sql.NVarChar(100), data.city ?? null)
    .input("country", sql.NVarChar(100), data.country ?? null)
    .input("notes", sql.NVarChar(1000), data.notes ?? null)
    .input("isActive", sql.Bit, data.isActive ?? true);
}

// Returns { items, total }. `search` (optional) matches name/email/company.
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
      "WHERE Name LIKE @search OR Email LIKE @search OR Company LIKE @search";
  }

  const result = await request.query(
    `SELECT ${COLUMNS}
     FROM dbo.Customers
     ${where}
     ORDER BY Name
     OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;

     SELECT COUNT(*) AS total FROM dbo.Customers ${where};`
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
    .query(`SELECT ${COLUMNS} FROM dbo.Customers WHERE Id = @id`);
  return result.recordset[0] || null;
}

export async function findByEmail(email) {
  const result = await getPool()
    .request()
    .input("email", sql.NVarChar(255), email)
    .query("SELECT TOP 1 Id FROM dbo.Customers WHERE Email = @email");
  return result.recordset[0] || null;
}

export async function create(data) {
  const request = applyCustomerInputs(getPool().request(), data);
  const result = await request.query(
    `INSERT INTO dbo.Customers
       (Name, Email, Phone, Company, AddressLine, City, Country, Notes, IsActive)
     OUTPUT ${COLUMNS.split(",")
       .map((c) => `INSERTED.${c.trim()}`)
       .join(", ")}
     VALUES
       (@name, @email, @phone, @company, @addressLine, @city, @country, @notes, @isActive)`
  );
  return result.recordset[0];
}

export async function update(id, data) {
  const request = applyCustomerInputs(getPool().request(), data).input(
    "id",
    sql.Int,
    id
  );
  const result = await request.query(
    `UPDATE dbo.Customers
     SET Name = @name, Email = @email, Phone = @phone, Company = @company,
         AddressLine = @addressLine, City = @city, Country = @country,
         Notes = @notes, IsActive = @isActive, UpdatedAt = SYSUTCDATETIME()
     OUTPUT ${COLUMNS.split(",")
       .map((c) => `INSERTED.${c.trim()}`)
       .join(", ")}
     WHERE Id = @id`
  );
  return result.recordset[0] || null;
}

// Returns the number of rows deleted (0 if the customer did not exist).
export async function remove(id) {
  const result = await getPool()
    .request()
    .input("id", sql.Int, id)
    .query("DELETE FROM dbo.Customers WHERE Id = @id");
  return result.rowsAffected[0];
}
