import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import StudentHeader from "./studentHeader/StudentHeader";
import StudentSidebar from "./studentSidebar/StudentSidebar";
import styles from "./StudentLayout.module.css";

const StudentLayout = () => {
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
      <StudentHeader menu={menu} setMenu={setMenu} />
      <main className={styles.container}>
        <aside
          className={menu ? styles.active : ""}
          onClick={() => windowWidth < 768 && setMenu(false)}
        >
          <StudentSidebar menu={menu} />
        </aside>
        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
