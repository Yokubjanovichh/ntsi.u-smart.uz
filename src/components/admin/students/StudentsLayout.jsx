import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchStudents } from "../../../redux/slices/students/studentsSlice";

import { LuRefreshCw } from "react-icons/lu";
import { FiSearch } from "react-icons/fi";
import styles from "./StudentsLayout.module.css";

const StudentsLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const translations = useSelector((state) => state.language.translations);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    dispatch(searchStudents(query));
  };

  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        <ul className={styles.navbar}>
          <li>
            <NavLink
              to="studentslist"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {translations.adminStudentList}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="addstudent"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {translations.adminAddStudent}
            </NavLink>
          </li>
        </ul>

        {location.pathname.includes("/studentslist") && (
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
                  type="text"
                  className={styles.searchInput}
                  placeholder="Name, JSHIR, Phone number, Group"
                  value={searchQuery}
                  onChange={handleSearchChange}
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

export default StudentsLayout;
