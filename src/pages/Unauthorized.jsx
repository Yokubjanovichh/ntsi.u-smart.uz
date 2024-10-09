import React from "react";
import styles from "./Unauthorized.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const translations = useSelector((state) => state.language.translations);
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{translations.unauthorizedTitle}</h1>
      <p className={styles.description}>{translations.unauthorizedDesc}</p>
      <button className={styles.button} onClick={() => navigate("/")}>
        {translations.unauthorizedBtn}
      </button>
    </div>
  );
};

export default Unauthorized;
