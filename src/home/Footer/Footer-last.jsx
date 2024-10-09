import React from "react";
import GoogleMapComponent from "../Google-map/Map";
import logo from "../../assets/svg/navbar-logo.svg";
import phone from "../../assets/svg/footer-phone.svg";
import facebook from "../../assets/svg/facebook-footer.svg";
import telegram from "../../assets/svg/footer-telegram.svg";
import youtube from "../../assets/svg/footer-youtube.svg";
import instagram from "../../assets/svg/intagram-footer.svg";
import location from "../../assets/svg/location-footer.svg";
import yandexLocation from "../../assets/svg/yandex-location.svg";
import googleLocation from "../../assets/svg/google-loaction.svg";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`${styles.footerWrapper} content container`}>
      <div className={styles.footer}>
        <div className={styles.footerLogo}>
          <img src={logo} alt="logo" />
          <div className={styles.phoneNumbers}>
            <div className={styles.footerLogoPhone}>
              <img src={phone} alt="phone" />
              <a href="+998952004304">95-200-43-04</a>
            </div>
            <div className={styles.footerLogoPhone}>
              <img src={phone} alt="phone" />
              <a href="+998954004304">95-400-43-04</a>
            </div>
            <div className={styles.footerLogoPhone}>
              <img src={phone} alt="phone" />
              <a href="+998552514304">55-251-43-04</a>
            </div>
          </div>
        </div>
        <div className={styles.socialAndLocation}>
          <div className={styles.social}>
            <a href="https://t.me/namtsiuz">
              <img src={telegram} alt="telegram" />
            </a>
            <a href="https://www.youtube.com/@NamTSI_uz">
              <img src={youtube} alt="youtube" />
            </a>
            <a href="#">
              <img src={facebook} alt="facebook" />
            </a>
            <a href="#">
              <img src={instagram} alt="instagram" />
            </a>
          </div>
          <div className={styles.location}>
            <div className={styles.locationIcon}>
              <img src={location} alt="location" />
            </div>
            <p>Namangan "Gulobod" MFY South Circular 17, Yoli str</p>
          </div>
          <div className={styles.maps}>
            <button>
              <a
                target="_blank"
                href="https://maps.app.goo.gl/JMiHRxMNDiBTcQEt5"
              >
                <img src={googleLocation} alt="googleLocation" />
              </a>
            </button>
            <button>
              <a target="_blank" href="https://yandex.uz/maps/-/CDwgJSiF">
                <img src={yandexLocation} alt="yandexLocation" />
              </a>
            </button>
          </div>
        </div>
        <div className={styles.brouserMap}>
          <GoogleMapComponent />
        </div>
      </div>
      <p>© Copyright 2024 | All Rights Reserved</p>
    </footer>
  );
}
