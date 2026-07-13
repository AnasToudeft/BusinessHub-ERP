// Reusable button. Variants: "primary" (default) | "secondary".
// `block` makes it full-width; `loading` disables it and shows a busy label.

import styles from "./Button.module.css";

function Button({
  children,
  type = "button",
  variant = "primary",
  block = false,
  loading = false,
  disabled = false,
  className = "",
  ...rest
}) {
  const classes = [
    styles.button,
    styles[variant],
    block ? styles.block : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}

export default Button;
