import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";
import AuthCard from "../components/AuthCard/AuthCard.jsx";
import FormField from "../components/FormField/FormField.jsx";
import Button from "../components/Button/Button.jsx";
import ErrorMessage from "../components/ErrorMessage/ErrorMessage.jsx";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "Invalid email or password."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Sign in"
      subtitle="Access your BusinessHub ERP workspace."
      footer={
        <>
          No account? <Link to="/register">Create one</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div style={{ marginBottom: "1rem" }}>
            <ErrorMessage title="Sign in failed" message={error} />
          </div>
        )}

        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />

        <Button type="submit" block loading={submitting}>
          Sign in
        </Button>
      </form>
    </AuthCard>
  );
}

export default Login;
