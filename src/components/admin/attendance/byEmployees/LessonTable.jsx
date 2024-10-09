import { useState } from "react";
// import { FiEdit } from "react-icons/fi";
import { FaCheck, FaXmark, FaInfo, FaBusinessTime } from "react-icons/fa6";
import styles from "./ByStudentTimeTable.module.css";

import { InfoIcon } from "../../Icons";

const LessonTable = () => {
  const [status, setStatus] = useState("came");
  const enterAndLeaveData = [1, 2, 3, 4, 5];
  return (
    <div className={styles.workhour}>
      {/* <div className={styles.edit}>
        <FiEdit className={styles.icon} />
      </div> */}
      <div className={styles[status]}>
        <div className={styles.undefinedIcon}>
          <InfoIcon />
        </div>
        <ul>
          {enterAndLeaveData &&
            enterAndLeaveData.map((e, i) => {
              return (
                <li>
                  <p className={styles.enterTime} key={i}>
                    {status == "came"
                      ? "Enter: 08:00"
                      : status == "notcame"
                      ? "?"
                      : ""}
                  </p>
                  <p className={styles.exitTime}>
                    {status == "came"
                      ? "Exit: 10:30"
                      : status == "notcame"
                      ? "?"
                      : ""}
                  </p>
                </li>
              );
            })}
        </ul>
        <p className={styles.firstEnter}>
          <span></span> First Enter:{" "}
          {status == "came" ? "08:00" : status == "notcame" ? "?" : ""}
        </p>
        <p className={styles.lastExit}>
          <span></span> Last Exit:{" "}
          {status == "came" ? "08:00" : status == "notcame" ? "?" : ""}
        </p>
      </div>

      <div className={`${styles.result} ${styles[`${status}Result`]}`}>
        <div className={styles.after} style={{width: `${100/3}%`}}></div>
        {status == "came" && (
          <p>
            <FaBusinessTime className={styles.icon} />{" "}
            <span>
              Total hours: <br /> 6 hours, 23 mins
            </span>{" "}
            <FaCheck className={styles.icon} />
          </p>
        )}
        {status == "notcame" && (
          <p>
            <FaBusinessTime className={styles.icon} />{" "}
            <span>
              Total hours: <br /> 0 hours, 0 mins
            </span>{" "}
            <FaXmark className={styles.icon} />
          </p>
        )}
        {status == "undefined" && (
          <p>
            <FaBusinessTime className={styles.icon} />{" "}
            <span>
              Total hours: <br /> 0 hours, 0 mins
            </span>{" "}
            <FaInfo className={styles.icon} />
          </p>
        )}
      </div>
    </div>
  );
};

export default LessonTable;
