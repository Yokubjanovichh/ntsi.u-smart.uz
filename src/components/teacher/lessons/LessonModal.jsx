import styles from './LessonModal.module.css';
import userImg from '../../../assets/img/profile.png';
import { MAINURL } from '../../../redux/api/axios';
const LessonModal = ({ eachStudent }) => {
  if (!eachStudent) return null; // Guard clause to handle the case when `eachStudent` is not provided

  const {
    first_name,
    last_name,
    phone_number,
    image,
    address, // If address is available
    // Add any other fields you want to display
  } = eachStudent;

  return (
    <div className={styles.container}>
      <h1>{`${first_name} ${last_name}`}'s Info</h1>
      <div className={styles.content}>
        <div className={styles.info}>
          <p>
            Phone number: <span>{phone_number}</span>
          </p>
          <p>
            Location: <span>{address || 'Room number or Camera location'}</span>
          </p>
        </div>
        <div className={styles.img}>
          <img
            src={image ? `${MAINURL}${image.file_path}` : userImg}
            alt={`${first_name} ${last_name}'s image`}
          />
        </div>
      </div>
      <div className={styles.time}>
        <div>
          <p>
            First enter: <span>13.02</span>{' '}
          </p>
        </div>
        <div>
          <p>
            Last exit: <span>pending</span>{' '}
          </p>
        </div>
        <div>
          <p>
            First enter to building: <span>13:02</span>{' '}
          </p>
        </div>
        <div>
          <p>
            Exit from building: <span>pending</span>{' '}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LessonModal;
