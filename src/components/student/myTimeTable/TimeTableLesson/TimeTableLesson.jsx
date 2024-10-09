import React from "react";
import styles from "./TimeTableLesson.module.css";

export default function TimeTableLesson({ pair }) {
  let status;

  switch (pair.studentStatus) {
    case "came":
      status = "#23AE00";
      break;
    case "not came":
      status = "#FF0000";
      break;
    case "undefined":
      status = "#00AAFF";
      break;
    default:
      status = "#00AAFF";
  }
  return (
    <div className={styles.timeTableWrapper}>
      <div className={styles.lessonDetails}>
        <div className={styles.lessonTime}>
          <p>08:30-09:50</p>
        </div>
        <p className={styles.lessonName}>Huquqiy amaliyot dasturiy ta‘minot</p>
        <p className={styles.teacherName}>Sanjar Hudoyorov</p>
        <div className={styles.roomNumberAndStatus}>
          <p className={styles.roomNumber}>Xona: 124B1</p>
          <p className={styles.studentStatus} style={{ background: status }}>
            Came
          </p>
        </div>
      </div>
    </div>
  );
}
