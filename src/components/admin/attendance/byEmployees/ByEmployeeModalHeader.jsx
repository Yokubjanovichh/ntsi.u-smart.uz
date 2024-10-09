import styles from "./ByEmployeeModal.module.css";
import studentImg from "../../../../assets/img/image 2.png";

const ByEmployeeModalHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.img}>
        <img src={studentImg} alt="Jahongir Yusupov" title="Jahongir Yusupov" />
      </div>
      <div className={styles.info}>
        <h1>Jahongir Yusupov  <br /> Solijon o‘g‘li’s</h1>
        <p>Attandance</p>
      </div>
    </header>
  );
};

export default ByEmployeeModalHeader;
