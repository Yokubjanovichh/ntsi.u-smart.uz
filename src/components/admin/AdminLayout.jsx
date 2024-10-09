import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./adminHeader/AdminHeader";
import AdminSidebar from "./adminSidebar/AdminSidebar";
import styles from "./AdminLayout.module.css";

const AdminLayout = () => {
  const [menu, setMenu] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <AdminHeader menu={menu} setMenu={setMenu} />
      <main className={styles.container}>
        <aside
          className={menu ? styles.active : ""}
          onClick={() => windowWidth < 768 && setMenu(false)}
        >
          <AdminSidebar menu={menu} />
        </aside>
        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
