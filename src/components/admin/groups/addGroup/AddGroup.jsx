import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroup } from "../../../../redux/slices/groups/groupsSlice";
import { fetchManagers } from "../../../../redux/slices/managers/managersSlice";
import { TextInput, SelectOptions } from "../../../common/Input";
import { fetchDepartments } from "../../../../redux/slices/departments/departmentsSlice";
import { enqueueSnackbar as EnSn } from "notistack";
import styles from "./AddGroup.module.css";

const AddGroup = () => {
  const dispatch = useDispatch();
  const [groupNumber, setGroupNumber] = useState("");
  const [groupStatus, setGroupStatus] = useState(null);
  const [groupType, setGroupType] = useState(null);
  const [department, setDepartment] = useState(null);
  const [tutor, setTutor] = useState(null);
  const [managersId, setManagersId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const translations = useSelector((state) => state.language.translations);

  const { managers } = useSelector((state) => state.managers);

  const [showGroupNumberError, setShowGroupNumberError] = useState(false);
  const [showGroupTypeError, setShowGroupTypeError] = useState(false);
  const [showDepartmentError, setShowDepartmentError] = useState(false);
  const [showTutorError, setShowTutorError] = useState(false);

  useEffect(() => {
    dispatch(fetchManagers());
  }, [dispatch]);

  const { groups } = useSelector((state) => state.groups);
  const { status, error } = useSelector((state) => state.groups);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const { departments } = useSelector((state) => state.departments);

  const groupTypesData = [
    { day: translations.adminDay, id: "day" },
    { day: translations.adminNight, id: "night" },
    { day: translations.adminPartTime, id: "part" },
  ];
  // const departmentsData = [
  //   { name: "IT department", id: "department-id-1" },
  //   { name: "English", id: "department-id-2" },
  //   { name: "English 11", id: "department-id-3" },
  //   { name: "Physics 10", id: "department-id-4" },
  // ];
  // const tutorsData = [
  //   { name: "Azimjon Jalilov", id: "tutor-id-1" },
  //   { name: "Sanjar Xudayarov", id: "tutor-id-2" },
  //   { name: "Jahongir Yusupov", id: "tutor-id-3" },
  // ];

  const validateForm = useCallback(() => {
    const isGroupNumberValid = groupNumber.length >= 1;
    const isGroupTypeValid = groupType !== null;
    const isDepartmentValid = departmentId !== "";
    const isTutorValid = managersId !== "";

    setShowGroupNumberError(!isGroupNumberValid);
    setShowGroupTypeError(!isGroupTypeValid);
    setShowDepartmentError(!isDepartmentValid);
    setShowTutorError(!isTutorValid);

    return (
      isGroupNumberValid &&
      isGroupTypeValid &&
      isDepartmentValid &&
      isTutorValid
    );
  }, [groupNumber, groupType, departmentId, managersId]);

  const handleReset = () => {
    setGroupNumber("");
    setGroupStatus(null);
    setGroupType(null);
    setDepartment(null);
    setTutor("");
    setDepartmentId("");
    setManagersId("");
    setShowGroupNumberError("");
    setShowGroupTypeError("");
    setShowDepartmentError("");
    setShowTutorError("");
  };

  const handleClickReset = (e) => {
    e.preventDefault();
    handleReset();
  };

  const handleAddGroup = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const newGroup = {
        name: groupNumber,
        type: groupType,
        department_id: departmentId,
        tutor_id: managersId,
      };

      setSubmitAttempted(true);
      dispatch(createGroup(newGroup));
    }
  };

  useEffect(() => {
    if (submitAttempted) {
      if (status === "succeeded") {
        EnSn(translations.groupCreated, { variant: "success" });
        handleReset();
        setSubmitAttempted(false);
      } else if (status === "failed") {
        EnSn(error, { variant: "error" });
        setSubmitAttempted(false);
      }
    }
  }, [status, error, translations, submitAttempted]);

  return (
    <form className={styles.form}>
      <div className={styles.formContainer}>
        <div className={styles.inputs}>
          <div className={styles.formGroup}>
            <TextInput
              text={translations.adminGroupNumber}
              value={groupNumber}
              setValue={setGroupNumber}
              errorText="Group number is required"
              showError={showGroupNumberError}
              setShowError={setShowGroupNumberError}
              minLength={2}
            />
          </div>

          <div className={styles.formGroup}>
            <SelectOptions
              text={translations.adminGroupType}
              values={groupTypesData.map((groups) => ({
                name: groups.day,
                id: groups.id,
              }))}
              value={groupType || ""}
              setValue={(value) => {
                setGroupType(value);
                if (value) setShowGroupTypeError(false);
              }}
              errorText="Please select a group type"
              showError={showGroupTypeError}
            />
          </div>

          <div className={styles.formGroup}>
            <SelectOptions
              text={translations.adminDepartment}
              values={departments.map((department) => ({
                name: `${department.name}`,
                id: department.id,
              }))}
              value={departmentId || ""}
              setValue={(value) => {
                setDepartmentId(value);
                if (value) setShowDepartmentError(false);
              }}
              errorText="Please select a department"
              showError={showDepartmentError}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <SelectOptions
            text={translations.adminTutor}
            values={managers.map((manager) => ({
              name: `${manager.first_name} ${manager.last_name}`,
              id: manager.id,
            }))}
            value={managersId || ""}
            setValue={(value) => {
              setManagersId(value);
              if (value) setShowTutorError(false);
            }}
            errorText="Please select a tutor"
            showError={showTutorError}
          />
        </div>
      </div>

      <div className={styles.buttons}>
        <button
          type="reset"
          className={styles.delete}
          onClick={handleClickReset}
        >
          {translations.adminClean}
        </button>
        <button
          type="submit"
          className={styles.save}
          onClick={handleAddGroup}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Saving..." : translations.adminSave}
        </button>
      </div>

      {error && <div className={styles.error}>Error: {error}</div>}
    </form>
  );
};

export default AddGroup;
