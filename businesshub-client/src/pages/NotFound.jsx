// 404 page for unmatched routes. Rendered inside the main layout so navigation
// stays available.

import { Link } from "react-router-dom";

import styles from "./NotFound.module.css";

function NotFound() {
  return (
    <div className={styles.wrapper}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.message}>
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className={styles.link}>
        Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;
