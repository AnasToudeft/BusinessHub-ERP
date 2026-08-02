// Maps a raw Products row to the API shape (camelCase).

export function toPublicProduct(row) {
  return {
    id: row.Id,
    sku: row.Sku,
    name: row.Name,
    description: row.Description ?? null,
    category: row.Category ?? null,
    unit: row.Unit ?? null,
    price: row.Price != null ? Number(row.Price) : 0,
    cost: row.Cost != null ? Number(row.Cost) : null,
    isActive: Boolean(row.IsActive),
    createdAt: row.CreatedAt,
    updatedAt: row.UpdatedAt,
  };
}
