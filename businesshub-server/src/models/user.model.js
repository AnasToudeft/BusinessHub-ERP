// Maps a raw Users row to the public shape returned by the API.
// PasswordHash is deliberately never included.

export function toPublicUser(row) {
  return {
    id: row.Id,
    email: row.Email,
    firstName: row.FirstName ?? null,
    lastName: row.LastName ?? null,
    isActive: Boolean(row.IsActive),
  };
}
