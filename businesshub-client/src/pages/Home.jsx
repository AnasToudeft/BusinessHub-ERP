import styles from "./Home.module.css";

function Home() {
  return (
    <main className={styles.home}>
      <div className={styles.card}>
        <span className={styles.badge}>ERP Platform</span>
        <h1 className={styles.title}>BusinessHub ERP</h1>
        <p className={styles.subtitle}>
          A modern enterprise resource planning platform.
        </p>
        <p className={styles.note}>Project scaffolding — coming soon.</p>
      </div>
    </main>
  );
}

export default Home;
