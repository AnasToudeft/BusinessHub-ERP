// Labelled input (or textarea) with an optional inline error message.

import styles from "./FormField.module.css";

function FormField({ id, label, type = "text", error, textarea = false, ...rest }) {
  const controlClass = `${styles.input} ${textarea ? styles.textarea : ""} ${
    error ? styles.inputError : ""
  }`;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          className={controlClass}
          aria-invalid={error ? "true" : undefined}
          rows={3}
          {...rest}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={controlClass}
          aria-invalid={error ? "true" : undefined}
          {...rest}
        />
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default FormField;
