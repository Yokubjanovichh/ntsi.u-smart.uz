import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchGroups } from "../../../redux/slices/groups/groupsSlice";
import { LuRefreshCw } from "react-icons/lu";
import { FiSearch } from "react-icons/fi";
import styles from "./GroupsLayout.module.css";

const GroupsLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const translations = useSelector((state) => state.language.translations);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    dispatch(searchGroups(query)); // Trigger search on every change
  };

  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        <ul className={styles.navbar}>
          <li>
            <NavLink
              to="groupslist"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {translations.adminGroupList}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="addgroup"
              className={({ isActive }) =>
                isActive ? styles.active : undefined
              }
            >
              {translations.adminAddGroup}
            </NavLink>
          </li>
        </ul>

        {location.pathname.includes("/groupslist") && (
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

export default GroupsLayout;
