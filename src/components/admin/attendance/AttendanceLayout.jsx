import { NavLink, Outlet } from 'react-router-dom';
import styles from './AttendanceLayout.module.css';
import { useSelector } from 'react-redux';

const AttendanceLayout = () => {
  const translations = useSelector((state) => state.language.translations);
  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        <ul className={styles.navbar}>
          <li>
            <NavLink
              to='bystudents'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {translations.adminByStudents}
            </NavLink>
          </li>
          <li>
            <NavLink
              to='byemployees'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {translations.adminByEmployees}
            </NavLink>
          </li>
          <li>
            <NavLink
              to='statisticebystudents'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {translations.adminStatisticsByStudents}
            </NavLink>
          </li>
          <li>
            <NavLink
              to='statisticebyemployees'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {translations.adminStatisticsByEmployees}
            </NavLink>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
};

export default AttendanceLayout;
