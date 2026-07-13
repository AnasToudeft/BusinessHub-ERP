// Maps a raw Customers row to the API shape (camelCase).

export function toPublicCustomer(row) {
  return {
    id: row.Id,
    name: row.Name,
    email: row.Email ?? null,
    phone: row.Phone ?? null,
    company: row.Company ?? null,
    addressLine: row.AddressLine ?? null,
    city: row.City ?? null,
    country: row.Country ?? null,
    notes: row.Notes ?? null,
    isActive: Boolean(row.IsActive),
    createdAt: row.CreatedAt,
    updatedAt: row.UpdatedAt,
  };
}
