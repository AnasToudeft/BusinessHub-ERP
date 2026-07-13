// Top navigation bar: mobile menu toggle, app title, theme switch, and the
// current-user menu with sign-out.

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext.jsx";
import ThemeToggle from "../ThemeToggle/ThemeToggle.jsx";
import styles from "./Topbar.module.css";

function displayName(user) {
  if (!user) return "";
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return full || user.email;
}

function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

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
        {user && (
          <div className={styles.user}>
            <span className={styles.userName} title={user.email}>
              {displayName(user)}
            </span>
            <button
              type="button"
              className={styles.logout}
              onClick={handleLogout}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Topbar;
