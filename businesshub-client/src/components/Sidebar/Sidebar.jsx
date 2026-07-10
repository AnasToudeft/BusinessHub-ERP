// Primary navigation sidebar. Fixed on desktop; slides in as a drawer on mobile
// (controlled by `isOpen`, dismissed via `onNavigate` when a link is followed).

import { NavLink } from "react-router-dom";

import { navItems } from "./navItems.js";
import styles from "./Sidebar.module.css";

function Sidebar({ isOpen, onNavigate }) {
  return (
    <>
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>BH</span>
          <span className={styles.brandName}>BusinessHub</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <span className={styles.icon} aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>ERP Platform · v0.1</div>
      </aside>

      {isOpen && <div className={styles.backdrop} onClick={onNavigate} />}
    </>
  );
}

export default Sidebar;
