import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ManagersLayout.module.css';
import { LuRefreshCw } from 'react-icons/lu';
import { FiSearch } from 'react-icons/fi';
import { searchManagers } from '../../../redux/slices/managers/managersSlice';

const ManagersLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const translations = useSelector((state) => state.language.translations);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    dispatch(searchManagers(query));
  };

  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        <ul className={styles.navbar}>
          <li>
            <NavLink
              to='managerslist'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {translations.adminManagerList}
            </NavLink>
          </li>
          <li>
            <NavLink
              to='addmanager'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {translations.adminAddManager}
            </NavLink>
          </li>
          <li>
            <NavLink
              to='createrole'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {translations.adminCreateRole}
            </NavLink>
          </li>
          <li>
            <NavLink
              to='adminhistory'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {translations.adminAdminHistory}
            </NavLink>
          </li>
        </ul>

        {location.pathname.includes('/managerslist') && (
          <div className={styles.btns}>
            <button className={styles.refresh}>
              <LuRefreshCw className={styles.refreshIcon} />
            </button>
            <form
              className={styles.searchForm}
              onSubmit={(e) => e.preventDefault()}
            >
              <div className={styles.searchDiv}>
                <input
                  type='text'
                  className={styles.searchInput}
                  placeholder={translations.adminSearchNJP}
                  value={searchQuery}
                  onChange={handleSearchChange} // Perform search on change
                />
                <FiSearch className={styles.searchIcon} />
              </div>
            </form>
          </div>
        )}
      </nav>

      <Outlet />
    </div>
  );
};

export default ManagersLayout;
