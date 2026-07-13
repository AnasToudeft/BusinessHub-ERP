// Application routes.
//  - Public-only: /login, /register (redirect away if already signed in).
//  - Protected: everything else, rendered inside MainLayout (sidebar + top bar).

import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/routing/ProtectedRoute.jsx";
import PublicOnlyRoute from "./components/routing/PublicOnlyRoute.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/customers" element={<Placeholder title="Customers" />} />
          <Route path="/products" element={<Placeholder title="Products" />} />
          <Route path="/inventory" element={<Placeholder title="Inventory" />} />
          <Route path="/invoices" element={<Placeholder title="Invoices" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
