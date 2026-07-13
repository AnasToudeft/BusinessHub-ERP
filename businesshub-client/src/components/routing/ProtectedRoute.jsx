// Guards authenticated areas. While the session is being restored it shows a
// loader; if unauthenticated it redirects to /login (remembering the target).

import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext.jsx";
import Loading from "../Loading/Loading.jsx";

function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <Loading label="Loading session…" />
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
