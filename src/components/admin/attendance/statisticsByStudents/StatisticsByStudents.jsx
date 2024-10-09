import { useState } from "react";
import styles from "./StatisticsByStudents.module.css";
import { CheckIcon } from "../../Icons";
import Modal from "../../../modal/Modal";
import { FaXmark } from "react-icons/fa6";
import StatisticsByStudentModal from "./StatisticsByStudentModal";

const StatisticsByStudents = () => {
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

  return (
    <>
      {showModal && (
        <Modal>
          <StatisticsByStudentModal closeModal={() => setShowModal(false)} />
          <button onClick={() => setShowModal(false)}>
            <FaXmark />
          </button>
        </Modal>
      )}

      <form className={styles.searchForm} onSubmit={handleSearchClick}>
        <input
          type="text"
          placeholder="Search by name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button>Search</button>
      </form>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <td className={styles.fullname}>
              <span>Familya/Ism/Otasini ismi</span>
            </td>
            <td className={styles.jshir}>
              <span>JSHIR</span>
            </td>
            <td className={styles.role}>
              <span>Group</span>
            </td>
            <td className={styles.phone}>
              <span>Phone number</span>
            </td>
            <td className={styles.status}>
              <span>Status</span>
            </td>
            <td className={styles.status}>
              <span>Attendance</span>
            </td>
            <td className={styles.image}>
              <span>Images</span>
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
                      <span>check</span>
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

export default StatisticsByStudents;
