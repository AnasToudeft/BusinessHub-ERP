import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";
import AuthCard from "../components/AuthCard/AuthCard.jsx";
import FormField from "../components/FormField/FormField.jsx";
import Button from "../components/Button/Button.jsx";
import ErrorMessage from "../components/ErrorMessage/ErrorMessage.jsx";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create account"
      subtitle="Start managing your business operations."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div style={{ marginBottom: "1rem" }}>
            <ErrorMessage title="Registration failed" message={error} />
          </div>
        )}

        <FormField
          id="firstName"
          label="First name"
          value={form.firstName}
          onChange={update("firstName")}
          placeholder="Ann"
          autoComplete="given-name"
        />
        <FormField
          id="lastName"
          label="Last name"
          value={form.lastName}
          onChange={update("lastName")}
          placeholder="Lee"
          autoComplete="family-name"
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={update("email")}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          value={form.password}
          onChange={update("password")}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
        />

        <Button type="submit" block loading={submitting}>
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}

export default Register;
