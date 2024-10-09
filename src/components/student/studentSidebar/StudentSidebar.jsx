import { NavLink, useLocation } from 'react-router-dom';
import styles from './StudentSidebar.module.css';
import { useSelector } from 'react-redux';
import { ProfileIcon, TimeTableIcon } from '../../admin/Icons';

const AdminSidebar = ({ menu }) => {
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
            to='mytimetable'
            className={isActive('/mytimetable') ? styles.active : undefined}
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
