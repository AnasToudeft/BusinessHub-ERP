// Guards public-only pages (login/register): redirects already-authenticated
// users to the dashboard.

import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext.jsx";
import Loading from "../Loading/Loading.jsx";

function PublicOnlyRoute() {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <Loading label="Loading…" />
      </div>
    );
  }

  if (status === "authenticated") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
