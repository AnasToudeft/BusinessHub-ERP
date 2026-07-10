// Single source of truth for the primary navigation.
// Routes referenced here are wired in App.jsx. Sections beyond the Dashboard
// currently render a shared placeholder page until their milestones land.

export const navItems = [
  { label: "Dashboard", path: "/", icon: "📊", end: true },
  { label: "Customers", path: "/customers", icon: "👥" },
  { label: "Products", path: "/products", icon: "📦" },
  { label: "Inventory", path: "/inventory", icon: "🗃️" },
  { label: "Invoices", path: "/invoices", icon: "🧾" },
];
