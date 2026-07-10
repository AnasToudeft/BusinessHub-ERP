// Reusable error panel with an optional retry action.

import styles from "./ErrorMessage.module.css";

function ErrorMessage({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}) {
  return (
    <div className={styles.wrapper} role="alert">
      <span className={styles.icon} aria-hidden="true">
        ⚠️
      </span>
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        <p className={styles.message}>{message}</p>
      </div>
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
