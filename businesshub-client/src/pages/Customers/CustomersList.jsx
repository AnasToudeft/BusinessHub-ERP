import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext.jsx";
import { getErrorMessage } from "../../services/api.js";
import * as customerService from "../../services/customer.service.js";
import PageContainer from "../../components/PageContainer/PageContainer.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage.jsx";
import Button from "../../components/Button/Button.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog.jsx";
import styles from "./CustomersList.module.css";

function CustomersList() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.listCustomers({ page, q: search });
      setItems(data.items);
      setPagination(data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await customerService.deleteCustomer(toDelete.id);
      setToDelete(null);
      // If we deleted the last row on a page beyond the first, step back.
      if (items.length === 1 && page > 1) setPage((p) => p - 1);
      else load();
    } catch (err) {
      setError(getErrorMessage(err));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const canCreate = hasPermission("customers:create");
  const canUpdate = hasPermission("customers:update");
  const canDelete = hasPermission("customers:delete");

  return (
    <PageContainer
      title="Customers"
      subtitle="Manage your customer records."
      actions={
        canCreate && (
          <Button onClick={() => navigate("/customers/new")}>New customer</Button>
        )
      }
    >
      <form className={styles.toolbar} onSubmit={handleSearch}>
        <input
          className={styles.search}
          type="search"
          placeholder="Search by name, email or company…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      {error && (
        <div className={styles.errorSlot}>
          <ErrorMessage message={error} onRetry={load} />
        </div>
      )}

      {loading ? (
        <Loading label="Loading customers…" />
      ) : items.length === 0 ? (
        <p className={styles.empty}>No customers found.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>City</th>
                <th>Status</th>
                {(canUpdate || canDelete) && <th aria-label="Actions" />}
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.email || "—"}</td>
                  <td>{c.company || "—"}</td>
                  <td>{c.city || "—"}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        c.isActive ? styles.active : styles.inactive
                      }`}
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  {(canUpdate || canDelete) && (
                    <td className={styles.rowActions}>
                      {canUpdate && (
                        <button
                          type="button"
                          className={styles.link}
                          onClick={() => navigate(`/customers/${c.id}/edit`)}
                        >
                          Edit
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          className={`${styles.link} ${styles.danger}`}
                          onClick={() => setToDelete(c)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onChange={setPage}
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete customer"
        message={
          toDelete
            ? `Delete "${toDelete.name}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </PageContainer>
  );
}

export default CustomersList;
