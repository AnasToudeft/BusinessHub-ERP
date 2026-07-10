// Dashboard landing page. Foundation-only: shows the app shell with a welcome
// panel and static placeholder cards. Real KPIs arrive in a later milestone.

import PageContainer from "../components/PageContainer/PageContainer.jsx";
import styles from "./Dashboard.module.css";

const placeholders = [
  { label: "Customers", hint: "Coming soon" },
  { label: "Products", hint: "Coming soon" },
  { label: "Invoices", hint: "Coming soon" },
  { label: "Inventory", hint: "Coming soon" },
];

function Dashboard() {
  return (
    <PageContainer
      title="Dashboard"
      subtitle="Welcome to BusinessHub ERP — your operations at a glance."
    >
      <div className={styles.grid}>
        {placeholders.map((item) => (
          <div key={item.label} className={styles.card}>
            <span className={styles.cardLabel}>{item.label}</span>
            <span className={styles.cardHint}>{item.hint}</span>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}

export default Dashboard;
