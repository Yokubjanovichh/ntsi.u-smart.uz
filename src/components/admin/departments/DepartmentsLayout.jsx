import { NavLink, Outlet, useLocation } from 'react-router-dom';
import styles from './DepartmentsLayout.module.css';
import { LuRefreshCw } from 'react-icons/lu';
import { FiSearch } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const DepartmentsLayout = () => {
  const location = useLocation();
  const translations = useSelector((state) => state.language.translations);

  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        <ul className={styles.navbar}>
          <li>
            <NavLink
              to='departmentslist'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {translations.adminDepartmentList}
            </NavLink>
          </li>
          <li>
            <NavLink
              to='adddepartment'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {translations.adminAddDepartment}
            </NavLink>
          </li>
        </ul>

        {location.pathname.includes('/departmentslist') && (
          <div className={styles.btns}>
            <button className={styles.refresh}>
              <LuRefreshCw className={styles.refreshIcon} />
            </button>
            <form className={styles.searchForm}>
              <div className={styles.searchDiv}>
                <input
                  type='text'
                  className={styles.searchInput}
                  placeholder={translations.adminSearchNJP}
                />
                <FiSearch className={styles.searchIcon} />
              </div>
              <button className={styles.searchBtn}>Search</button>
            </form>
          </div>
        )}
      </nav>

      <Outlet />
    </div>
  );
};

export default DepartmentsLayout;
