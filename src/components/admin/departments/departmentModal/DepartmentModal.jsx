import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchGroups } from "../../../../redux/slices/groups/groupsSlice";
import styles from "./DepartmentModal.module.css";

const DepartmentModal = ({ propDept }) => {
  const dispatch = useDispatch();
  const { groups, status, error } = useSelector((state) => state.groups);
  const translations = useSelector((state) => state.language.translations);

  const [filteredAllGroups, setFilteredAllGroups] = useState([]);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  useEffect(() => {
    if (groups && propDept.name) {
      const filteredGroups = groups.filter(
        (group) => group.department.name === propDept.name
      );
      setFilteredAllGroups(filteredGroups);
    }
  }, [groups, propDept.name]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }
  return (
    <div className={styles.departmentModal}>
      <h1>{propDept.name}</h1>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <td className={styles.fullname}>
              <span>{translations.adminGroupNumber}</span>
            </td>
            <td className={styles.jshir}>
              <span>{translations.adminTutor}</span>
            </td>
            <td className={styles.phone}>
              <span>{translations.adminTutorPhone}</span>
            </td>
            <td className={styles.status}>
              <span>{translations.adminGroupType}</span>
            </td>
            <td className={styles.action}>
              <span>{translations.adminStudents}</span>
            </td>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {filteredAllGroups.map((group, index) => (
            <tr className={styles.tr} key={index}>
              <td className={styles.fullname}>
                <span>{group.name}</span>
              </td>
              <td className={styles.jshir}>
                <span>
                  {group.tutor.first_name} {group.tutor.last_name}{" "}
                  {group.tutor.middle_name !== "null"
                    ? group.tutor.middle_name
                    : ""}
                </span>
              </td>
              <td className={styles.phone}>
                <a href={`tel:${group.tutor.phone_number}`}>
                  {group.tutor.phone_number}
                </a>
              </td>
              <td className={styles.type}>
                <span>{group.type}</span>
              </td>
              <td className={styles.students}>
                <span>{group.students.length}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartmentModal;
