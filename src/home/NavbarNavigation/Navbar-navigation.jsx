import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-scroll";
import styles from "./navbarNavigation.module.css";

export default function NavbarNavigation({ setMobile }) {
  const translations = useSelector((state) => state.language.translations);

  return (
    <nav
      className={styles.nav}
      onClick={() => {
        setMobile(false);
      }}
    >
      <ul>
        <li>
          <Link
            activeClass={styles.active || "active"}
            to="login"
            spy={true}
            offset={-200}
            smooth={true}
            duration={500}
          >
            {translations.mainLogIn}
          </Link>
        </li>
        <li>
          <Link
            activeClass={styles.active || "active"}
            to="about"
            spy={true}
            offset={-130}
            smooth={true}
            duration={500}
          >
            {translations.mainAboutUs}
          </Link>
        </li>
        <li>
          <Link
            activeClass={styles.active || "active"}
            to="how-it-works"
            offset={-130}
            spy={true}
            smooth={true}
            duration={500}
          >
            {translations.mainHowItWorks}
          </Link>
        </li>
        <li>
          <Link
            activeClass={styles.active || "active"}
            to="contact"
            offset={-130}
            spy={true}
            smooth={true}
            duration={500}
          >
            {translations.mainContactUs}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
