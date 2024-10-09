import React, { useState, useEffect, useCallback } from "react";
import { addTeacher } from "../../../../redux/slices/teachers/teachersSlice";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar as EnSn } from "notistack";
import { TextInput, DateInput } from "../../../common/Input";
import { ChooseImageIcon } from "../../Icons";
import styles from "./AddTeacher.module.css";

const AddTeacher = () => {
  const dispatch = useDispatch();
  // const initialRoleState = {
  //   add: false,
  //   read: false,
  //   update: false,
  //   delete: false,
  // };

  // const [psychologyStudent, setPsychologyStudent] = useState(initialRoleState);
  // const [psychologyEmployee, setPsychologyEmployee] =
  //   useState(initialRoleState);

  // State variables
  const { error, status } = useSelector((state) => state.teachers);
  const [jshir, setJshir] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const translations = useSelector((state) => state.language.translations);

  // State variables for errors
  const [showJshirError, setShowJshirError] = useState(false);
  const [showFirstNameError, setShowFirstNameError] = useState(false);
  const [showLastNameError, setShowLastNameError] = useState(false);
  const [showAddressError, setShowAddressError] = useState(false);
  const [showSpecializationError, setShowSpecializationError] = useState(false);
  const [showBirthDateError, setShowBirthDateError] = useState(false);
  const [showPhoneNumberError, setShowPhoneNumberError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showImageError, setShowImageError] = useState(false);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setShowImageError(false);
  };

  // Reset form fields
  const handleReset = () => {
    setJshir("");
    setFirstName("");
    setLastName("");
    setMiddleName("");
    setBirthDate("");
    setAddress("");
    setSpecialization("");
    setPhoneNumber("");
    setPassword("");
    setImage(null);

    // Reset error states
    setShowJshirError(false);
    setShowFirstNameError(false);
    setShowLastNameError(false);
    setShowAddressError(false);
    setShowSpecializationError(false);
    setShowBirthDateError(false);
    setShowPhoneNumberError(false);
    setShowPasswordError(false);
    setShowImageError(false);
  };

  // Validate the form
  // Validate the form
  const validateForm = useCallback(() => {
    const isJshirValid = jshir.length === 14;
    const isFirstNameValid = firstName.length >= 2;
    const isLastNameValid = lastName.length >= 2;
    const isAddressValid = address.length >= 2;
    const isSpecialization = specialization.length >= 2;
    const today = new Date();
    const selectedDate = new Date(birthDate);
    const isBirthDateValid = selectedDate <= today;
    const isPhoneNumberValid = phoneNumber.length === 9;
    const isPasswordValid = password.length >= 6;
    const isImageValid = image !== null;

    setShowJshirError(!isJshirValid);
    setShowFirstNameError(!isFirstNameValid);
    setShowLastNameError(!isLastNameValid);
    setShowAddressError(!isAddressValid);
    setShowSpecializationError(!isSpecialization);
    setShowBirthDateError(!isBirthDateValid);
    setShowPhoneNumberError(!isPhoneNumberValid);
    setShowPasswordError(!isPasswordValid);
    setShowImageError(!isImageValid);

    return (
      isFirstNameValid &&
      isLastNameValid &&
      isAddressValid &&
      isSpecialization &&
      isBirthDateValid &&
      isPhoneNumberValid &&
      isPasswordValid &&
      isImageValid
    );
  }, [
    jshir,
    firstName,
    lastName,
    address,
    specialization,
    birthDate,
    phoneNumber,
    password,
    image,
  ]);

  const handleAddTeacher = useCallback(
    (e) => {
      e.preventDefault();

      if (validateForm()) {
        const newTeacher = {
          jshir,
          lastName,
          firstName,
          middleName,
          birthDate,
          address,
          specialization,
          phoneNumber,
          password,
          image,
        };
        setSubmitAttempted(true);
        dispatch(addTeacher(newTeacher));
      }
    },
    [
      validateForm,
      jshir,
      lastName,
      firstName,
      middleName,
      birthDate,
      address,
      specialization,
      phoneNumber,
      password,
      image,
      dispatch,
    ]
  );

  useEffect(() => {
    if (submitAttempted) {
      if (status === "succeeded") {
        EnSn(translations.managerCreated, { variant: "success" });
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
              text={translations.adminjshir}
              value={jshir}
              setValue={setJshir}
              errorText="JSHIR must be 14 characters long"
              showError={showJshirError}
              setShowError={setShowJshirError}
              type="number"
              maxLength={14}
              minLength={13}
            />
          </div>

          <div className={styles.formGroup}>
            <TextInput
              text={translations.adminFirstName}
              value={firstName}
              setValue={setFirstName}
              errorText="Please enter a first name"
              showError={showFirstNameError}
              setShowError={setShowFirstNameError}
              minLength={2}
            />
          </div>

          <div className={styles.formGroup}>
            <TextInput
              text={translations.adminLastName}
              value={lastName}
              setValue={setLastName}
              errorText="Please enter a last name"
              showError={showLastNameError}
              setShowError={setShowLastNameError}
              minLength={2}
            />
          </div>

          <div className={styles.formGroup}>
            <TextInput
              text={translations.adminMiddleName}
              value={middleName}
              setValue={setMiddleName}
            />
          </div>

          <div className={styles.formGroup}>
            <DateInput
              text={translations.adminDateOfBirth}
              value={birthDate}
              setValue={setBirthDate}
              errorText="Please enter right date of birth"
              showError={showBirthDateError}
              setShowError={setShowBirthDateError}
              type={"DateOfBirth"}
            />
          </div>

          <div className={styles.formGroup}>
            <TextInput
              text={translations.adminHomeAddress}
              value={address}
              setValue={setAddress}
              errorText="Please enter a home address"
              showError={showAddressError}
              setShowError={setShowAddressError}
              minLength={2}
            />
          </div>

          <div className={styles.formGroup}>
            <TextInput
              text={translations.adminSpecialization}
              value={specialization}
              setValue={setSpecialization}
              errorText="Please enter a specialization"
              showError={showSpecializationError}
              setShowError={setShowSpecializationError}
              minLength={2}
            />
          </div>

          <div className={styles.formGroup}>
            <TextInput
              text={translations.adminPhoneNumber}
              value={phoneNumber}
              setValue={setPhoneNumber}
              errorText="Please enter a valid phone number"
              showError={showPhoneNumberError}
              setShowError={setShowPhoneNumberError}
              maxLength={9}
              patternFormat="+998 (##) ### ## ##"
              mask="_"
            />
          </div>

          <div className={styles.formGroup}>
            <TextInput
              text={translations.adminPassword}
              value={password}
              setValue={setPassword}
              errorText="Password must be at least 6 characters long"
              showError={showPasswordError}
              setShowError={setShowPasswordError}
              minLength={6}
              type="password"
            />
          </div>
        </div>

        <div className={styles.image}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="image"
          />
          {image ? (
            <label htmlFor="image">
              <img src={URL.createObjectURL(image)} alt="Selected" />
            </label>
          ) : (
            <label htmlFor="image">
              <ChooseImageIcon />
              {showImageError && (
                <span className={styles.errorText}>Please upload an image</span>
              )}
            </label>
          )}
        </div>
      </div>

      <div className={styles.buttons}>
        <button
          type="reset"
          className={`${styles.delete} ${styles.button}`}
          onClick={handleReset}
        >
          {translations.adminDelete}
        </button>
        <button
          type="submit"
          className={`${styles.save} ${styles.button}`}
          onClick={handleAddTeacher}
        >
          {translations.adminSave}
        </button>
      </div>
    </form>
  );
};

export default AddTeacher;
