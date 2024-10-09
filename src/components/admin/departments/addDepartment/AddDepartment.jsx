import React, { useState, useEffect, useCallback } from "react";
import { SelectOptions } from "../../../common/inputDepartment";
import { TextInput } from "../../../common/Input";
import { useDispatch, useSelector } from "react-redux";
import { addDepartment } from "../../../../redux/slices/departments/departmentsSlice";
import { fetchManagers } from "../../../../redux/slices/managers/managersSlice";
import { enqueueSnackbar as EnSn } from "notistack";
import styles from "./AddDepartment.module.css";

const AddDepartment = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchManagers());
  }, [dispatch]);

  const { managers } = useSelector(
    (state) => state.managers || { managers: [] }
  );
  const translations = useSelector((state) => state.language.translations);
  const { status, error } = useSelector((state) => state.departments);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentStatus, setDepartmentStatus] = useState(null);
  const [manager, setManager] = useState(null);

  const [showDepartmentNameError, setShowDepartmentNameError] = useState(false);
  const [showManagerError, setShowManagerError] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const departmentStatusData = ["active", "blocked"];

  const validateForm = useCallback(() => {
    const isDepartmentNameValid = departmentName.trim().length > 0;
    const isManagerValid = manager !== null;

    setShowDepartmentNameError(!isDepartmentNameValid);
    setShowManagerError(!isManagerValid);

    return isDepartmentNameValid && isManagerValid;
  }, [departmentName, manager]);

  const handleReset = () => {
    setDepartmentName("");
    setDepartmentStatus(null);
    setManager(null); // Resetting the manager field to null
    setShowDepartmentNameError(false);
    setShowManagerError(false);
  };

  const handleClickReset = (e) => {
    e.preventDefault();
    handleReset();
  };

  const handleAddDepartment = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const newDepartment = {
        name: departmentName,
        active: departmentStatus === "active",
        managerId: manager?.id,
      };
      setSubmitAttempted(true);
      dispatch(addDepartment(newDepartment));
    }
  };

  useEffect(() => {
    if (submitAttempted) {
      if (status === "succeeded") {
        EnSn(translations.departmentCreated, { variant: "success" });
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
              text="Department name"
              value={departmentName}
              setValue={setDepartmentName}
              errorText="Department name is required"
              showError={showDepartmentNameError}
              setShowError={setShowDepartmentNameError}
              minLength={2}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <SelectOptions
            text={"Manager"}
            values={managers}
            value={manager || ""}
            setValue={(selectedManager) => {
              setManager(selectedManager);
              setShowManagerError(false);
            }}
            displayKey="first_name"
            displaySecondaryKey="last_name"
            errorText="Please select a manager"
            showError={showManagerError}
          />
        </div>
      </div>

      <div className={styles.buttons}>
        <button className={styles.delete} onClick={handleClickReset}>
          Reset
        </button>
        <button className={styles.save} onClick={handleAddDepartment}>
          Save
        </button>
      </div>
    </form>
  );
};

export default AddDepartment;
