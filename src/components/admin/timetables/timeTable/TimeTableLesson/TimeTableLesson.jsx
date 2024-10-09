import React from "react";
import styles from "./TimeTableLesson.module.css";
import editIcon from "../../../../../assets/svg/edit-icon.svg";

export default function TimeTableLesson({ pair, openModal }) {
  return (
    <div className={styles.timeTableWrapper}>
      <div className={styles.lessonDetails}>
        <div className={styles.lessonTime}>
          <p>
            {pair?.slot?.start_time} - {pair?.slot?.end_time}
          </p>
          <button onClick={openModal}>
            <img src={editIcon} alt="editIcon" />
          </button>
        </div>
        <p className={styles.lessonName}>{pair?.subject?.name}</p>
        <p className={styles.teacherName}>
          {pair?.teacher?.first_name} {pair?.teacher?.last_name}
        </p>
        <p className={styles.roomNumber}>Xona: {pair?.room?.name}</p>
      </div>
    </div>
  );
}
