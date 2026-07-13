// Labelled input with an optional inline error message.

import styles from "./FormField.module.css";

function FormField({ id, label, type = "text", error, ...rest }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        aria-invalid={error ? "true" : undefined}
        {...rest}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default FormField;
