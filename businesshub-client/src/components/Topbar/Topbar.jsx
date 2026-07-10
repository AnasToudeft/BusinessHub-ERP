// Top navigation bar: mobile menu toggle, app title, and theme switch.

import ThemeToggle from "../ThemeToggle/ThemeToggle.jsx";
import styles from "./Topbar.module.css";

function Topbar({ onMenuClick }) {
  return (
    <header className={styles.topbar}>
      <button
        type="button"
        className={styles.menuButton}
        onClick={onMenuClick}
        aria-label="Toggle navigation"
      >
        ☰
      </button>

      <span className={styles.title}>BusinessHub ERP</span>

      <div className={styles.actions}>
        <ThemeToggle />
      </div>
    </header>
  );
}

export default Topbar;
