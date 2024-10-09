import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import TeacherHeader from "./teacherHeader/TeacherHeader";
import TeacherSidebar from "./teacherSidebar/TeacherSidebar";
import styles from "./TeacherLayout.module.css";

const TeacherLayout = () => {
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
      <TeacherHeader menu={menu} setMenu={setMenu} />
      <main className={styles.container}>
        <aside
          className={menu ? styles.active : ""}
          onClick={() => windowWidth < 768 && setMenu(false)}
        >
          <TeacherSidebar menu={menu} />
        </aside>
        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TeacherLayout;
