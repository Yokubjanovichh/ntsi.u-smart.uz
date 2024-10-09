import styles from './ByStudentModal.module.css';
import studentImg from '../../../../assets/img/image 2.png';
import { useSelector } from 'react-redux';

const byStudentsModalHeader = () => {
  const translations = useSelector((state) => state.language.translations);

  return (
    <header className={styles.header}>
      <div className={styles.info}>
        <div className={`${styles.fullname} ${styles['active']}`}>
          <h1>Jahongir Yusupov Solijon o‘g‘li</h1>
          <p>{translations.adminAttendance}</p>
        </div>

        <div className={styles.data}>
          <div>
            <p>{translations.adminGroupNumber}</p>
            <h3>B234</h3>
          </div>
          <div>
            <p>{translations.adminMonth}</p>
            <h3>12/2/18</h3>
          </div>
          <div>
            <p>{translations.adminAllSmester}</p>
            <h3>43/3/50</h3>
          </div>
        </div>
      </div>
      <div className={styles.img}>
        <img src={studentImg} alt='Jahongir Yusupov' title='Jahongir Yusupov' />
      </div>
    </header>
  );
};

export default byStudentsModalHeader;
