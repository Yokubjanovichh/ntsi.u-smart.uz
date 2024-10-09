import React from "react";
import styles from "./NotFoundPage.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const translations = useSelector((state) => state.language.translations);
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{translations.pageNotFoundTitle}</h1>
      <p className={styles.description}>{translations.pageNotFoundDesc}</p>
      <p className={styles.suggestion}>{translations.pageNotFoundSuggestion}</p>
      <button className={styles.button} onClick={() => navigate("/")}>
        {translations.pageNotFoundBtn}
      </button>
    </div>
  );
};

export default NotFoundPage;
