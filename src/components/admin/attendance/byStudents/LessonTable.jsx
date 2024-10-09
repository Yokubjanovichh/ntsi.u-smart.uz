import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { FaCheck, FaXmark, FaInfo } from "react-icons/fa6";
import styles from "./ByStudentTimeTable.module.css";

const LessonTable = () => {
  const [status, setStatus] = useState("came"); // Initial status
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(!isEditing); // Toggle edit mode
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setIsEditing(false); // Exit edit mode after selection
  };

  return (
    <>
      <div className={styles.lesson}>
        <div className={styles.edit}>
          <FiEdit className={styles.icon} onClick={handleEditClick} />
        </div>
        <p className={styles.time}>08:30-09:50</p>
        <p className={styles.subject}>Huquqiy amaliyot dasturiy ta‘minot</p>
        <p className={styles.teacher}>Sanjar Hudoyorov</p>
        <p className={styles.room}>Xona: 124B1</p>
        <div className={styles.status}>
          <button
            className={`${
              status === "came"
                ? styles.came
                : status === "notcame"
                ? styles.notCame
                : styles.undefined
            }`}
          >
            {status == "came" && (
              <>
                <FaCheck className={styles.icon} /> <span>Came</span>
              </>
            )}
            {status == "notcame" && (
              <>
                <FaXmark className={styles.icon} /> <span>Not Came</span>
              </>
            )}
            {status == "undefined" && (
              <>
                <FaInfo className={styles.icon} /> <span>Undefined</span>
              </>
            )}
          </button>
        </div>
        {isEditing && (
          <div className={styles.statusOptions}>
            <button
              onClick={() => handleStatusChange("came")}
              className={styles.cameBtn}
            >
              Came
            </button>
            <button
              onClick={() => handleStatusChange("notcame")}
              className={styles.notCameBtn}
            >
              Not Came
            </button>
            <button
              onClick={() => handleStatusChange("undefined")}
              className={styles.undefinedBtn}
            >
              Undefined
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default LessonTable;
