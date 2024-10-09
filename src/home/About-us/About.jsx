import React from 'react';
import { Element } from 'react-scroll';
import { useSelector } from 'react-redux';
import aboutUsSvgIcon from '../../assets/svg/about-svg-icon.svg';
import styles from './About.module.css';

export default function AboutUs() {
  const translations = useSelector((state) => state.language.translations);
  return (
    <div className={`${styles.aboutUs} container`} id='about'>
      <h1>{translations.mainAboutUsBody}</h1>
      <p>
        Lorem Ipsum has been the industry's standard dummy text ever since the
        1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book. It has survived not only five centuries, but
        also the leap into electronic typesetting, remaining essentially
        unchanged. It was popularised in the 1960s with the release of Letraset
        sheets containing Lorem Ipsum passages, and more recently with desktop
        publishing software like Aldus PageMaker including versions of Lorem
        Ipsum.
      </p>
      <p>
        Lorem Ipsum has been the industry's standard dummy text ever since the
        1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book. It has survived not only five centuries, but
        also the leap into electronic typesetting, remaining essentially
        unchanged. It was
      </p>
      <div className={styles.img}>
        <img src={aboutUsSvgIcon} alt='aboutUsSvgIcon' />
      </div>
    </div>
  );
}
