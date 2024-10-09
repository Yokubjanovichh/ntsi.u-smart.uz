import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './TeachersLayout.module.css';
import { LuRefreshCw } from 'react-icons/lu';
import { FiSearch } from 'react-icons/fi';
import { searchTeachers } from '../../../redux/slices/teachers/teachersSlice';

const TeachersLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const translations = useSelector((state) => state.language.translations);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    dispatch(searchTeachers(query)); // Trigger search on every change
  };

  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        <ul className={styles.navbar}>
          <li>
            <NavLink
              to='teacherslist'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {translations.adminTeacherList}
            </NavLink>
          </li>
          <li>
            <NavLink
              to='addteacher'
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {translations.adminAddTeacher}
            </NavLink>
          </li>
        </ul>

        {location.pathname.includes('/teacherslist') && (
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

export default TeachersLayout;
