import { NavLink, Outlet, Navigate } from "react-router-dom";
import styles from "./TimeTablesLayout.module.css";
import { useSelector } from "react-redux";

const TimeTablesLayout = () => {
  const translations = useSelector((state) => state.language.translations);
  return (
    <div className={styles.timeTablesLayoutWrapper}>
      <nav>
        <ul>
          <li>
            <NavLink
              to="timetable"
              className={({ isActive }) =>
                isActive ? styles.activeLink : undefined
              }
            >
              {translations.adminTimeTable}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="addtimetable"
              className={({ isActive }) =>
                isActive ? styles.activeLink : undefined
              }
            >
              {translations.adminAddTimeTable}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="addsubject"
              className={({ isActive }) =>
                isActive ? styles.activeLink : undefined
              }
            >
              {translations.adminAddSubject}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="addroom"
              className={({ isActive }) =>
                isActive ? styles.activeLink : undefined
              }
            >
              {translations.adminAddRoom}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="cameras"
              className={({ isActive }) =>
                isActive ? styles.activeLink : undefined
              }
            >
              {translations.adminCameras}
            </NavLink>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
};

export default TimeTablesLayout;
