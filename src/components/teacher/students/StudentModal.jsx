import styles from "./StudentModal.module.css";
import userImg from "../../../assets/img/profile.png";

const StudentModal = () => {
  return (
    <div className={styles.container}>
      <h1>Jahongir Yusupov Solijon o'g'li's info</h1>
      <div className={styles.content}>
        <div className={styles.info}>
          <p>
            Phone number: <span>+998990019437</span>
          </p>
          <p>
            Location: <span>Room number or Camera location</span>
          </p>
        </div>
        <div className={styles.img}>
          <img src={userImg} alt="Jahongir Yusupov's image" />
        </div>
      </div>
      <div className={styles.time}>
        <div>
          <p>
            First enter: <span>13.02</span>
          </p>
        </div>
        <div>
          <p>
            Last exit: <span>pending</span>
          </p>
        </div>
        <div>
          <p>
            First enter to building: <span>13:02</span>
          </p>
        </div>
        <div>
          <p>
            Exit from building: <span>pending</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
