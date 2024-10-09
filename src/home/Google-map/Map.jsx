import React from "react";
import styles from "./Map.module.css";

const GoogleMapComponent = () => {
  return (
    <div className={styles.mapWrapper}>
      <iframe
        src="https://yandex.uz/map-widget/v1/?ll=71.592811%2C41.010835&mode=search&oid=1861052871&ol=biz&z=19.93"
        className={styles.mapItem}
        width={100}
        height={100}
      ></iframe>
    </div>
  );
};

export default GoogleMapComponent;
