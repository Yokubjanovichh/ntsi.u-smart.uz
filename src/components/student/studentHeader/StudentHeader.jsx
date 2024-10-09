import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaUser } from 'react-icons/fa6';
import { logout } from '../../../redux/slices/auth/authSlice';
import styles from './StudentHeader.module.css';
import { switchLanguage } from '../../../redux/slices/language/languageSlice';
import { FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa';

const AdminHeader = ({ menu, setMenu }) => {
  const translations = useSelector((state) => state.language.translations);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleLanguageChange = (event) => {
    dispatch(switchLanguage(event.target.value));
  };

  return (
    <header className={styles.header}>
      <button className={styles.btn} onClick={() => setMenu(!menu)}>
        {!menu && <FaAngleDoubleRight />}
        {menu && <FaAngleDoubleLeft />}
      </button>
      <Link to='/dashboard/admin/managers/managerslist' className={styles.logo}>
        <img src='/assets/logo.png' alt='Smart-U' />
      </Link>
      <select
        name='language'
        id='language'
        className={styles.languages}
        value={currentLanguage}
        onChange={handleLanguageChange}
      >
        <option value='uz'>O'zbek</option>
        <option value='en'>English</option>
        <option value='ru'>Русский</option>
      </select>
      <div onClick={handleLogout} className={styles.user}>
        <span>{translations.adminLogOut}</span>
        <FaUser className={styles.icon} />
      </div>
    </header>
  );
};

export default AdminHeader;
