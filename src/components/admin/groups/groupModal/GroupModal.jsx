import { MAINURL } from "../../../../redux/api/axios";
import { useSelector } from "react-redux";
import styles from "./GroupModal.module.css";

const GroupModal = ({ currentGroup }) => {
  const translations = useSelector((state) => state.language.translations);
  const { status, error } = useSelector((state) => state.groups);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <div className={styles.groupModal}>
      <h1>
        {translations.adminGroupNumber}: {currentGroup.name}
      </h1>
      <h5>
        {translations.adminTutorName}:{" "}
        {currentGroup?.tutor?.first_name || "No tutor assigned"}{" "}
        {currentGroup?.tutor?.last_name}
      </h5>
      <br />
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <td className={styles.fullname}>
              <span>{translations.adminLastNameNameMiddleName}</span>
            </td>
            <td className={styles.jshir}>
              <span>{translations.adminjshir}</span>
            </td>
            <td className={styles.phone}>
              <span>{translations.adminPhoneNumber}</span>
            </td>
            <td className={styles.status}>
              <span>{translations.adminStatus}</span>
            </td>
            <td className={styles.image}>
              <span>{translations.adminImage}</span>
            </td>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {currentGroup.students &&
            currentGroup.students.map((student, index) => {
              return (
                <tr className={styles.tr} key={index}>
                  <td className={styles.fullname}>
                    <span>{`${student.last_name} ${
                      student?.first_name || "No tutor assigned"
                    }${
                      student.middle_name && student.middle_name !== "null"
                        ? ` ${student.middle_name}`
                        : ""
                    }`}</span>
                  </td>
                  <td className={styles.jshir}>
                    <span>12345678910</span>
                  </td>
                  <td className={styles.phone}>
                    <a href={`tel:${student.phone_number}`}>
                      {student.phone_number}
                    </a>
                  </td>
                  <td className={styles.status}>
                    <button
                      className={styles[student.active ? "active" : "blocked"]}
                    >
                      {student.active ? "Active" : "Blocked"}
                    </button>
                  </td>
                  <td className={styles.image}>
                    <div>
                      <img
                        src={`${MAINURL}${student.image.file_path}`}
                        alt={`${
                          student?.first_name || "No tutor assigned"
                        }'s image`}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default GroupModal;
