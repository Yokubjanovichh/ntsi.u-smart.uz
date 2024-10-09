import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentsByTeacher } from "../../../redux/slices/students/studentsSlice";
import { TextInput, SelectOptions } from "../../common/Input";
import studentImg from "../../../assets/img/profile.png";
import styles from "./Students.module.css";

const Students = () => {
  const dispatch = useDispatch();
  const [textSearch, setTextSearch] = useState("");
  const [group, setGroup] = useState(null);
  const translations = useSelector((state) => state.language.translations);

  useEffect(() => {
    dispatch(fetchStudentsByTeacher());
  }, [dispatch]);

  // Correctly access status, error, and students from Redux state
  const { students, status, error } = useSelector((state) => state.students);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  console.log(students);

  const groupsData = [
    {
      name: "AB144",
      id: 1111,
    },
    {
      name: "BS455",
      id: 2222,
    },
    {
      name: "VD542",
      id: 3333,
    },
  ];

  const handleSubmitClick = (e) => {
    e.preventDefault();

    console.log({
      textSearch,
      group,
    });
  };

  return (
    <section className={styles.studentsContainer}>
      <form onSubmit={handleSubmitClick}>
        <div className={styles.byText}>
          <TextInput
            text="Name or JSHIR or Phone number"
            value={textSearch}
            setValue={setTextSearch}
          />
        </div>
        <button>Search</button>
        <div className={styles.group}>
          <SelectOptions
            text={"Choose group ( default all students)"}
            values={groupsData}
            value={group}
            setValue={setGroup}
          />
        </div>
      </form>

      {/* students table start */}
      <div className={styles.studentsTable}>
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
              <td className={styles.image}>
                <span>{translations.adminImage}</span>
              </td>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {students &&
              students.map((student, index) => (
                <tr className={styles.tr} key={index}>
                  <td className={styles.fullname}>
                    <span>Yuldashev Murodulla Yoqubjon o'g'li</span>
                  </td>
                  <td className={styles.jshir}>
                    <span>12345678910134</span>
                  </td>
                  <td className={styles.role}>
                    <span>42ATT877</span>
                  </td>
                  <td className={styles.phone}>
                    <a href="">+998200038717</a>
                  </td>
                  <td className={styles.image}>
                    <div>
                      <img src={studentImg} alt="Student" />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* students table end */}
    </section>
  );
};

export default Students;
