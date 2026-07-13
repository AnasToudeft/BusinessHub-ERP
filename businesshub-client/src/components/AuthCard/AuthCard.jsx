// Centered card used by the Login and Register pages.

import styles from "./AuthCard.module.css";

function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.mark}>BH</span>
          <span className={styles.brandName}>BusinessHub ERP</span>
        </div>

        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        {children}

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}

export default AuthCard;
