import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { switchLanguage } from "../../redux/slices/language/languageSlice";
import NavbarNavigation from "../NavbarNavigation/Navbar-navigation";
import navbarLogo from "../../assets/svg/navbar-logo.svg";
import navbarUserIcon from "../../assets/svg/user-icon.svg";
import { FaBars } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [mobile, setMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  const dispatch = useDispatch();

  // Function to close the menu
  const closeMenu = () => {
    setMobile(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      closeMenu();
      const scrollTop = window.scrollY;
      if (scrollTop > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    dispatch(switchLanguage(newLang));
  };

  return (
    <div
      className={`${styles.wrapper} container ${
        isScrolled ? styles.smallPadding : ""
      }`}
    >
      <div className={styles.navbar}>
        <a href="#">
          <img src={navbarLogo} alt="navbar logo" />
        </a>
        <div className={styles.navigation}>
          <div className={styles.navbarNavigation}>
            <NavbarNavigation />
          </div>
          <div className={styles.locales}>
            <div className={styles.select}>
              <select
                value={currentLanguage.toLowerCase()}
                onChange={handleLanguageChange}
              >
                <option value="uz">O'zbek</option>
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>
            </div>
            <button className={styles.user}>
              <img src={navbarUserIcon} alt="user icon" />
            </button>
            <button
              className={styles.menuBtn}
              onClick={() => {
                setMobile(true);
              }}
            >
              <FaBars className={styles.menuIcon} />
            </button>
          </div>
        </div>
      </div>
      <div
        className={`${styles.navigationHide} ${mobile ? styles.active : ""}`}
      >
        <button
          className={styles.exitBtn}
          onClick={() => {
            setMobile(false);
          }}
        >
          <FaTimes className={styles.exitIcon} />
        </button>
        <NavbarNavigation setMobile={setMobile} />
      </div>
    </div>
  );
}
