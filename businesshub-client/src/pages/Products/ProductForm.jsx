import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getErrorMessage, getErrorDetails } from "../../services/api.js";
import * as productService from "../../services/product.service.js";
import PageContainer from "../../components/PageContainer/PageContainer.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage.jsx";
import FormField from "../../components/FormField/FormField.jsx";
import Button from "../../components/Button/Button.jsx";
import styles from "./ProductForm.module.css";

const EMPTY = {
  sku: "",
  name: "",
  description: "",
  category: "",
  unit: "",
  price: "",
  cost: "",
  isActive: true,
};

// Client-side checks; the backend re-validates authoritatively.
function validate(form) {
  const errors = {};
  if (!form.sku.trim()) errors.sku = "SKU is required.";
  if (!form.name.trim()) errors.name = "Name is required.";

  if (form.price.trim() === "") {
    errors.price = "Price is required.";
  } else if (Number.isNaN(Number(form.price)) || Number(form.price) < 0) {
    errors.price = "Price must be a number ≥ 0.";
  }

  if (form.cost.trim() !== "") {
    if (Number.isNaN(Number(form.cost)) || Number(form.cost) < 0) {
      errors.cost = "Cost must be a number ≥ 0.";
    }
  }
  return errors;
}

function toPayload(form) {
  const payload = {
    sku: form.sku.trim(),
    name: form.name.trim(),
    price: Number(form.price),
    isActive: form.isActive,
  };
  if (form.cost.trim() !== "") payload.cost = Number(form.cost);
  for (const key of ["description", "category", "unit"]) {
    const value = form[key]?.trim();
    if (value) payload[key] = value;
  }
  return payload;
}

function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    setLoading(true);
    productService
      .getProduct(id)
      .then((product) => {
        if (!active) return;
        setForm({
          sku: product.sku ?? "",
          name: product.name ?? "",
          description: product.description ?? "",
          category: product.category ?? "",
          unit: product.unit ?? "",
          price: product.price != null ? String(product.price) : "",
          cost: product.cost != null ? String(product.cost) : "",
          isActive: product.isActive,
        });
      })
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const setField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const clientErrors = validate(form);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      const payload = toPayload(form);
      if (isEdit) await productService.updateProduct(id, payload);
      else await productService.createProduct(payload);
      navigate("/products");
    } catch (err) {
      const details = getErrorDetails(err);
      if (details) setFieldErrors(details);
      else setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading label="Loading product…" />;

  return (
    <PageContainer
      title={isEdit ? "Edit product" : "New product"}
      subtitle={isEdit ? "Update this product's details." : "Add a new product."}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {error && (
          <div className={styles.errorSlot}>
            <ErrorMessage message={error} />
          </div>
        )}

        <div className={styles.grid}>
          <FormField
            id="sku"
            label="SKU *"
            value={form.sku}
            onChange={(e) => setField("sku", e.target.value)}
            error={fieldErrors.sku}
            required
          />
          <FormField
            id="name"
            label="Name *"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            error={fieldErrors.name}
            required
          />
          <FormField
            id="price"
            label="Price *"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setField("price", e.target.value)}
            error={fieldErrors.price}
            required
          />
          <FormField
            id="cost"
            label="Cost"
            type="number"
            step="0.01"
            min="0"
            value={form.cost}
            onChange={(e) => setField("cost", e.target.value)}
            error={fieldErrors.cost}
          />
          <FormField
            id="category"
            label="Category"
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
            error={fieldErrors.category}
          />
          <FormField
            id="unit"
            label="Unit"
            placeholder="pcs, kg…"
            value={form.unit}
            onChange={(e) => setField("unit", e.target.value)}
            error={fieldErrors.unit}
          />
        </div>

        <FormField
          id="description"
          label="Description"
          textarea
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          error={fieldErrors.description}
        />

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setField("isActive", e.target.checked)}
          />
          <span>Active</span>
        </label>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/products")}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {isEdit ? "Save changes" : "Create product"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}

export default ProductForm;
