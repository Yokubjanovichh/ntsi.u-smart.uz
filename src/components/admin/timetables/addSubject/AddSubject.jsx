import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "../../../common/Input";
import {
  searchSubjects,
  createSubject,
  deleteSubject,
} from "../../../../redux/slices/timetable/timetablesSlice";
import { enqueueSnackbar as EnSn } from "notistack";
import styles from "./AddSubject.module.css";

const AddSubject = () => {
  const [subject, setSubject] = useState("");
  const dispatch = useDispatch();
  const subjects = useSelector((state) => state.timetable.subjects);
  const { error, status } = useSelector((state) => state.timetable);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitAttemptedDelete, setSubmitAttemptedDelete] = useState(false);
  const translations = useSelector((state) => state.language.translations);
  useEffect(() => {
    dispatch(searchSubjects(subject));
  }, [subject]);

  const handleInputChange = (newSubject) => {
    setSubject(newSubject);
  };

  const handleCreateSubject = (event) => {
    event.preventDefault();
    if (subject.trim()) {
      setSubmitAttempted(true);
      dispatch(createSubject({ name: subject }));
    }
  };

  useEffect(() => {
    if (submitAttempted) {
      if (status === "succeeded") {
        EnSn(translations.subjectCreated, { variant: "success" });
        setSubject("");
        setSubmitAttempted(false);
      } else if (status === "failed") {
        EnSn(error, { variant: "error" });
        setSubmitAttempted(false);
      }
    }
  }, [status, error, translations, submitAttempted]);

  const handleDeleteSubject = (subjectId) => {
    setSubmitAttemptedDelete(true);
    dispatch(deleteSubject(subjectId));
  };

  useEffect(() => {
    if (submitAttemptedDelete) {
      if (status === "succeeded") {
        EnSn(translations.subjectDeleted, { variant: "success" });
        setSubject("");
        setSubmitAttempted(false);
      } else if (status === "failed") {
        EnSn(error, { variant: "error" });
        setSubmitAttempted(false);
      }
    }
  }, [status, error, translations, submitAttempted]);

  return (
    <form className={styles.addSubjectWrapper} onSubmit={handleCreateSubject}>
      <div className={styles.addSubjectSearch}>
        <TextInput
          text={translations.adminSubjectName}
          value={subject}
          setValue={handleInputChange}
          width={292}
        />
        <button type="submit">{translations.adminCreate}</button>
      </div>
      {subjects && (
        <div className={styles.similarSubjects}>
          <h3 className={styles.title}>{translations.adminSimilarSubjects}:</h3>
          <ul className={styles.subjects}>
            {subjects.map((sub, index) => (
              <li key={index} className={styles.subject}>
                <span>{sub.name}</span>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteSubject(sub.id)}
                >
                  {translations.adminDelete}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default AddSubject;
