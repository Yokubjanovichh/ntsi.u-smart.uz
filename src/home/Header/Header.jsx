import React from "react";
import LoginPage from "../LogIn/LoginPage";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={`${styles.header} content container`} id='login'>
      <LoginPage />
    </header>
  );
}
