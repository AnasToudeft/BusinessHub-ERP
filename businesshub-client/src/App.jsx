// Application routes. All pages render inside MainLayout (sidebar + top bar).
// Sections beyond the Dashboard use a shared Placeholder until their milestones.

import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Placeholder from "./pages/Placeholder.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="/customers" element={<Placeholder title="Customers" />} />
        <Route path="/products" element={<Placeholder title="Products" />} />
        <Route path="/inventory" element={<Placeholder title="Inventory" />} />
        <Route path="/invoices" element={<Placeholder title="Invoices" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
