import React from "react";
import Navbar from "../home/Header-navbar/header-navbar";
import Header from "../home/Header/Header";
import Main from "../home/Main/Main";
import Footer from "../home/Footer/Footer-last";
import styles from "./HomePage.module.css";

export default function HomePage() {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <Header />
      <Main />
      <Footer />
    </div>
  );
}