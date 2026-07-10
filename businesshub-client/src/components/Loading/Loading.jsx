// Reusable loading indicator: an accessible spinner with an optional label.

import styles from "./Loading.module.css";

function Loading({ label = "Loading..." }) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export default Loading;
