import { useState, useEffect } from "react";
import ByStudentModal from "./ByStudentModal";
import { useSelector } from "react-redux";
import Modal from "../../../modal/Modal";
import { FaXmark } from "react-icons/fa6";
import { CheckIcon } from "../../Icons";
import styles from "./ByStudents.module.css";

import {
  connectWebSocket,
  disconnectWebSocket,
} from "../../../../redux/websocket";

const ByStudents = () => {
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSearchClick = (e) => {
    e.preventDefault();
    console.log(name);
    setName("");
  };

  const dataStudents = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  ];

  const [isConnected, setIsConnected] = useState(false);
  const translations = useSelector((state) => state.language.translations);

  return (
    <>
      {showModal && (
        <Modal>
          <ByStudentModal />
          <button onClick={() => setShowModal(false)}>
            <FaXmark />
          </button>
        </Modal>
      )}

      <form className={styles.searchForm} onSubmit={handleSearchClick}>
        <input
          type="text"
          placeholder={translations.adminSearchNJP}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button>{translations.adminSearch}</button>
      </form>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <td className={styles.fullname}>
              <span>{translations.adminLastNameNameMiddleName}</span>
            </td>
            <td className={styles.jshir}>
              <span>{translations.adminjshir}</span>
            </td>
            <td className={styles.role}>
              <span>{translations.adminGroup}</span>
            </td>
            <td className={styles.phone}>
              <span>{translations.adminPhoneNumber}</span>
            </td>
            <td className={styles.status}>
              <span>{translations.adminStatus}</span>
            </td>
            <td className={styles.status}>
              <span>{translations.adminAttendance}</span>
            </td>
            <td className={styles.image}>
              <span>{translations.adminImage}</span>
            </td>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {dataStudents &&
            dataStudents.map((d, index) => {
              return (
                <tr className={styles.tr} key={index}>
                  <td className={styles.fullname}>
                    <span>Jahongir Yusupov Solijon o‘g‘li </span>
                  </td>
                  <td className={styles.jshir}>
                    <span>12345678910</span>
                  </td>
                  <td className={styles.role}>
                    <span>42ATT877</span>
                  </td>
                  <td className={styles.phone}>
                    <a href="tel:998906948717">+998906948717</a>
                  </td>
                  <td className={styles.status}>
                    <button className={styles["active"]}>Active</button>
                  </td>
                  <td className={styles.check}>
                    <button onClick={() => setShowModal(true)}>
                      <CheckIcon />
                      <span>{translations.adminCheck}</span>
                    </button>
                  </td>
                  <td className={styles.image}>
                    <div>
                      <img
                        src="/public/assets/manager.png"
                        alt="manager image"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export default ByStudents;
