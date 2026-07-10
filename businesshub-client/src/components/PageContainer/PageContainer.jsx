// Reusable page wrapper: constrains width and renders an optional header
// (title + subtitle + actions) above the page content.

import styles from "./PageContainer.module.css";

function PageContainer({ title, subtitle, actions, children }) {
  const hasHeader = title || subtitle || actions;

  return (
    <div className={styles.container}>
      {hasHeader && (
        <header className={styles.header}>
          <div>
            {title && <h1 className={styles.title}>{title}</h1>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}

      {children}
    </div>
  );
}

export default PageContainer;
