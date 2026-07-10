// Base application layout: fixed sidebar + top bar wrapping the routed page
// content. Manages the mobile sidebar's open/close state.

import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar.jsx";
import Topbar from "../components/Topbar/Topbar.jsx";
import styles from "./MainLayout.module.css";

function MainLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar
        isOpen={isSidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
      />

      <div className={styles.main}>
        <Topbar onMenuClick={() => setSidebarOpen((open) => !open)} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
