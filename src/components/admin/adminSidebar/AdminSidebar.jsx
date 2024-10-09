import { NavLink, useLocation } from 'react-router-dom';
import styles from './AdminSidebar.module.css';
import { useSelector } from 'react-redux';
import {
  ManagersIcon,
  ProfileIcon,
  TeachersIcon,
  StudentsIcon,
  GroupsIcon,
  DepartmentsIcon,
  TimeTableIcon,
  AttendanceIcon,
  CameraIcon,
} from '../Icons';

const AdminSidebar = ({ menu }) => {
  const location = useLocation();
  const translations = useSelector((state) => state.language.translations);

  // Function to check if the route is active
  const isActive = (route) => {
    return location.pathname.includes(route);
  };

  return (
    <nav className={`${styles.nav} ${menu && styles.active}`}>
      <ul className={styles.navbar}>
        <li>
          <NavLink
            to='managers/managerslist'
            className={isActive('/managers') ? styles.active : undefined}
          >
            <span className={styles.icon}>
              <ManagersIcon />
            </span>
            <span className={styles.linksName}>
              {translations.adminManagers}
            </span>
          </NavLink>
          <span className={styles.tooltip}>{translations.adminManagers}</span>
        </li>
        <li>
          <NavLink
            to='teachers/teacherslist'
            className={isActive('/teachers') ? styles.active : undefined}
          >
            <span className={styles.icon}>
              <TeachersIcon />
            </span>
            <span className={styles.linksName}>
              {translations.adminTeachers}
            </span>
          </NavLink>
          <span className={styles.tooltip}>{translations.adminTeachers}</span>
        </li>
        <li>
          <NavLink
            to='students/studentslist'
            className={isActive('/students') ? styles.active : undefined}
          >
            <span className={styles.icon}>
              <StudentsIcon />
            </span>
            <span className={styles.linksName}>
              {translations.adminStudents}
            </span>
          </NavLink>
          <span className={styles.tooltip}>{translations.adminStudents}</span>
        </li>
        <li>
          <NavLink
            to='groups/groupslist'
            className={isActive('/groups') ? styles.active : undefined}
          >
            <span className={styles.icon}>
              <GroupsIcon />
            </span>
            <span className={styles.linksName}>{translations.adminGroups}</span>
          </NavLink>
          <span className={styles.tooltip}>{translations.adminGroups}</span>
        </li>
        <li>
          <NavLink
            to='departments/departmentslist'
            className={isActive('/departments') ? styles.active : undefined}
          >
            <span className={styles.icon}>
              <DepartmentsIcon />
            </span>
            <span className={styles.linksName}>
              {translations.adminDepartments}
            </span>
          </NavLink>
          <span className={styles.tooltip}>
            {translations.adminDepartments}
          </span>
        </li>
        <li>
          <NavLink
            to='timetables/timetable'
            className={isActive('/timetables') ? styles.active : undefined}
          >
            <span className={styles.icon}>
              <TimeTableIcon />
            </span>
            <span className={styles.linksName}>
              {translations.adminTimeTable}
            </span>
          </NavLink>
          <span className={styles.tooltip}>{translations.adminTimeTable}</span>
        </li>
        <li>
          <NavLink
            to='attendance/bystudents'
            className={isActive('/attendance') ? styles.active : undefined}
          >
            <span className={styles.icon}>
              <AttendanceIcon />
            </span>
            <span className={styles.linksName}>
              {translations.adminAttendance}
            </span>
          </NavLink>
          <span className={styles.tooltip}>{translations.adminAttendance}</span>
        </li>
        <li>
          <NavLink
            to='stream'
            className={isActive('/stream') ? styles.active : undefined}
          >
            <span className={styles.icon}>
              <CameraIcon />
            </span>
            <span className={styles.linksName}>Stream</span>
          </NavLink>
          <span className={styles.tooltip}>Stream</span>
        </li>

        <li className={styles.myprofile}>
          <NavLink
            to='myprofile'
            className={isActive('/myprofile') ? styles.active : undefined}
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
    </nav>
  );
};

export default AdminSidebar;
