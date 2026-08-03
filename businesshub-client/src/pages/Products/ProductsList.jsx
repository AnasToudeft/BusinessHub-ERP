import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext.jsx";
import { getErrorMessage } from "../../services/api.js";
import * as productService from "../../services/product.service.js";
import PageContainer from "../../components/PageContainer/PageContainer.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage.jsx";
import Button from "../../components/Button/Button.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog.jsx";
import styles from "./ProductsList.module.css";

function formatMoney(value) {
  return Number(value ?? 0).toFixed(2);
}

function ProductsList() {
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
      const data = await productService.listProducts({ page, q: search });
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
      await productService.deleteProduct(toDelete.id);
      setToDelete(null);
      if (items.length === 1 && page > 1) setPage((p) => p - 1);
      else load();
    } catch (err) {
      setError(getErrorMessage(err));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const canCreate = hasPermission("products:create");
  const canUpdate = hasPermission("products:update");
  const canDelete = hasPermission("products:delete");

  return (
    <PageContainer
      title="Products"
      subtitle="Manage your product catalog."
      actions={
        canCreate && (
          <Button onClick={() => navigate("/products/new")}>New product</Button>
        )
      }
    >
      <form className={styles.toolbar} onSubmit={handleSearch}>
        <input
          className={styles.search}
          type="search"
          placeholder="Search by SKU, name or category…"
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
        <Loading label="Loading products…" />
      ) : items.length === 0 ? (
        <p className={styles.empty}>No products found.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th className={styles.right}>Price</th>
                <th>Status</th>
                {(canUpdate || canDelete) && <th aria-label="Actions" />}
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td className={styles.mono}>{p.sku}</td>
                  <td>{p.name}</td>
                  <td>{p.category || "—"}</td>
                  <td className={styles.right}>{formatMoney(p.price)}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        p.isActive ? styles.active : styles.inactive
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  {(canUpdate || canDelete) && (
                    <td className={styles.rowActions}>
                      {canUpdate && (
                        <button
                          type="button"
                          className={styles.link}
                          onClick={() => navigate(`/products/${p.id}/edit`)}
                        >
                          Edit
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          className={`${styles.link} ${styles.danger}`}
                          onClick={() => setToDelete(p)}
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
        title="Delete product"
        message={
          toDelete ? `Delete "${toDelete.name}"? This cannot be undone.` : ""
        }
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </PageContainer>
  );
}

export default ProductsList;
