import React from "react";
import { useSelector } from "react-redux";
import { Element } from "react-scroll";
import howItWorksImgRobotWomen from "../../assets/img/howItWorksImg.webp";
import imgIcon from "../../assets/svg/about-svg-icon.svg";
import styles from "./HowItWorks.module.css";

export default function HowItWorks() {
  const translations = useSelector((state) => state.language.translations);
  return (
    <Element name="how-it-works">
      {" "}
      <div className={`${styles.howItWorks} container`} id="how-it-works">
        <h1>{translations.mainHowItWorksBody}</h1>
        <p>
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book. It has survived not only five centuries,
          but also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of
          Letraset sheets containing Lorem Ipsum passages, and more recently
          with desktop publishing software like Aldus PageMaker including
          versions of Lorem Ipsum.
        </p>
        <p>
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book. It has survived not only five centuries,
          but also the leap into electronic typesetting, remaining essentially
          unchanged. It was
        </p>
        <div className={styles.howItWorksImg}>
          <img src={imgIcon} alt="imgIcon" />
          <img
            src={howItWorksImgRobotWomen}
            alt="howItWorksImgRobotWomen"
            className={styles.howItWorksImgItem2}
          />
        </div>
      </div>
    </Element>
  );
}
