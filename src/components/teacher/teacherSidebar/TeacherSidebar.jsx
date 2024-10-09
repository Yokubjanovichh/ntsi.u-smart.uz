import { NavLink, useLocation } from "react-router-dom";
import styles from "./TeacherSidebar.module.css";
import { useSelector } from "react-redux";
import { ProfileIcon, StudentsIcon, TimeTableIcon, LessonsIcon } from "../Icon";

const TeacherSidebar = ({ menu }) => {
  const location = useLocation();
  const translations = useSelector((state) => state.language.translations);

  const isActive = (route) => {
    return location.pathname.includes(route);
  };

  return (
    <nav className={`${styles.nav} ${menu && styles.active}`}>
      <ul className={styles.navbar}>
        <li>
          <NavLink
            to="lessons"
            className={isActive("/lessons") ? styles.active : undefined}
          >
            <span className={styles.icon}>
              <LessonsIcon />
            </span>
            <span className={styles.linksName}>
              {translations.teacherLessons}
            </span>
          </NavLink>
          <span className={styles.tooltip}> {translations.teacherLessons}</span>
        </li>
        {/* <li>
          <NavLink
            to="students"
            className={isActive("/students") ? styles.active : undefined}
          >
            <span className={styles.icon}>
              <StudentsIcon />
            </span>
            <span className={styles.linksName}>
              {translations.teacherStudents}
            </span>
          </NavLink>
          <span className={styles.tooltip}>{translations.teacherStudents}</span>
        </li> */}
        <li>
          <NavLink
            to="mytimetable"
            className={isActive("/mytimetable") ? styles.active : undefined}
          >
            <span className={styles.icon}>
              <TimeTableIcon />
            </span>
            <span className={styles.linksName}>
              {translations.teacherTimeTable}
            </span>
          </NavLink>
          <span className={styles.tooltip}>
            {translations.teacherTimeTable}
          </span>
        </li>
        <li className={styles.myprofile}>
          <NavLink
            to="myprofile"
            className={isActive("/myprofile") ? styles.active : undefined}
          >
            <span className={styles.icon}>
              <ProfileIcon />
            </span>
            <span className={styles.linksName}>
              {translations.adminMyProfile}
            </span>
          </NavLink>
          <span className={styles.tooltip}>{translations.adminMyProfile}</span>
        </li>
      </ul>
      <hr />
    </nav>
  );
};

export default TeacherSidebar;
