import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getErrorMessage, getErrorDetails } from "../../services/api.js";
import * as customerService from "../../services/customer.service.js";
import PageContainer from "../../components/PageContainer/PageContainer.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage.jsx";
import FormField from "../../components/FormField/FormField.jsx";
import Button from "../../components/Button/Button.jsx";
import styles from "./CustomerForm.module.css";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  company: "",
  addressLine: "",
  city: "",
  country: "",
  notes: "",
  isActive: true,
};

// Keep only defined fields, converting "" to omitted so optional fields stay null.
function toPayload(form) {
  const payload = { name: form.name.trim(), isActive: form.isActive };
  for (const key of ["email", "phone", "company", "addressLine", "city", "country", "notes"]) {
    const value = form[key]?.trim();
    if (value) payload[key] = value;
  }
  return payload;
}

function CustomerForm() {
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
    customerService
      .getCustomer(id)
      .then((customer) => {
        if (!active) return;
        setForm({
          name: customer.name ?? "",
          email: customer.email ?? "",
          phone: customer.phone ?? "",
          company: customer.company ?? "",
          addressLine: customer.addressLine ?? "",
          city: customer.city ?? "",
          country: customer.country ?? "",
          notes: customer.notes ?? "",
          isActive: customer.isActive,
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
    setFieldErrors({});
    setSubmitting(true);
    try {
      const payload = toPayload(form);
      if (isEdit) await customerService.updateCustomer(id, payload);
      else await customerService.createCustomer(payload);
      navigate("/customers");
    } catch (err) {
      const details = getErrorDetails(err);
      if (details) setFieldErrors(details);
      else setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading label="Loading customer…" />;

  return (
    <PageContainer
      title={isEdit ? "Edit customer" : "New customer"}
      subtitle={isEdit ? "Update this customer's details." : "Add a new customer."}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {error && (
          <div className={styles.errorSlot}>
            <ErrorMessage message={error} />
          </div>
        )}

        <FormField
          id="name"
          label="Name *"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          error={fieldErrors.name}
          required
        />

        <div className={styles.grid}>
          <FormField
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            error={fieldErrors.email}
          />
          <FormField
            id="phone"
            label="Phone"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            error={fieldErrors.phone}
          />
          <FormField
            id="company"
            label="Company"
            value={form.company}
            onChange={(e) => setField("company", e.target.value)}
            error={fieldErrors.company}
          />
          <FormField
            id="city"
            label="City"
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
            error={fieldErrors.city}
          />
          <FormField
            id="addressLine"
            label="Address"
            value={form.addressLine}
            onChange={(e) => setField("addressLine", e.target.value)}
            error={fieldErrors.addressLine}
          />
          <FormField
            id="country"
            label="Country"
            value={form.country}
            onChange={(e) => setField("country", e.target.value)}
            error={fieldErrors.country}
          />
        </div>

        <FormField
          id="notes"
          label="Notes"
          textarea
          value={form.notes}
          onChange={(e) => setField("notes", e.target.value)}
          error={fieldErrors.notes}
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
            onClick={() => navigate("/customers")}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {isEdit ? "Save changes" : "Create customer"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}

export default CustomerForm;
