import React, { useState, useEffect, useCallback } from "react";
import { addManagers } from "../../../../redux/slices/managers/managersSlice";
import { fetchRoles } from "../../../../redux/slices/roles/rolesSlice";
import { useDispatch, useSelector } from "react-redux";
import { TextInput, DateInput, SelectOptions } from "../../../common/Input";
import { enqueueSnackbar as EnSn } from "notistack";
import { GiBroom } from "react-icons/gi";
import { ChooseImageIcon } from "../../Icons";
import styles from "./AddManager.module.css";

const AddManager = () => {
  const dispatch = useDispatch();

  // State variables
  const [jshir, setJshir] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
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
  const [showBirthDateError, setShowBirthDateError] = useState(false);
  const [showRoleError, setShowRoleError] = useState(false);
  const [showPhoneNumberError, setShowPhoneNumberError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showImageError, setShowImageError] = useState(false);

  // Fetch roles when component mounts
  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const { roles } = useSelector((state) => state.roles);
  const { status, error } = useSelector((state) => state.managers);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setShowImageError(false);
  };

  // Reset form fields
  const handleReset = useCallback(() => {
    // Reset all state values
    setJshir("");
    setFirstName("");
    setLastName("");
    setMiddleName("");
    setBirthDate("");
    setAddress("");
    setRole("");
    setPhoneNumber("");
    setPassword("");
    setImage(null);

    // Reset error states
    setShowJshirError(false);
    setShowFirstNameError(false);
    setShowLastNameError(false);
    setShowAddressError(false);
    setShowBirthDateError(false);
    setShowRoleError(false);
    setShowPhoneNumberError(false);
    setShowPasswordError(false);
    setShowImageError(false);
  }, []);

  // Validate the form
  const validateForm = useCallback(() => {
    const isJshirValid = jshir.length === 14;
    const isFirstNameValid = firstName.length >= 2;
    const isLastNameValid = lastName.length >= 2;
    const isAddressValid = address.length >= 2;
    const today = new Date();
    const selectedDate = new Date(birthDate);
    const isBirthDateValid = selectedDate <= today;
    const isRoleValid = role !== "";
    const isPhoneNumberValid = phoneNumber.length === 9;
    const isPasswordValid = password.length >= 6;
    const isImageValid = image !== null;

    setShowJshirError(!isJshirValid);
    setShowFirstNameError(!isFirstNameValid);
    setShowLastNameError(!isLastNameValid);
    setShowAddressError(!isAddressValid);
    setShowBirthDateError(!isBirthDateValid);
    setShowRoleError(!isRoleValid);
    setShowPhoneNumberError(!isPhoneNumberValid);
    setShowPasswordError(!isPasswordValid);
    setShowImageError(!isImageValid);

    return (
      isJshirValid &&
      isFirstNameValid &&
      isLastNameValid &&
      isAddressValid &&
      isBirthDateValid &&
      isRoleValid &&
      isPhoneNumberValid &&
      isPasswordValid &&
      isImageValid
    );
  }, [
    jshir,
    firstName,
    lastName,
    address,
    birthDate,
    role,
    phoneNumber,
    password,
    image,
  ]);

  const handleAddManager = useCallback(
    (e) => {
      e.preventDefault();

      if (validateForm()) {
        const newManager = {
          jshir,
          lastName,
          firstName,
          middleName,
          birthDate,
          address,
          role,
          phoneNumber,
          password,
          image,
        };
        setSubmitAttempted(true);
        dispatch(addManagers(newManager));
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
      role,
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
              text="Date Of Birth"
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
            <SelectOptions
              text={translations.adminSelectRole}
              values={roles}
              value={role}
              setValue={(value) => {
                setRole(value);
                if (value) setShowRoleError(false);
              }}
              errorText="Please select a role"
              showError={showRoleError}
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
              patternFormat="+998 ## ### ## ##"
              mask=" "
            />
          </div>

          <div className={styles.formGroup}>
            <TextInput
              text={translations.adminPassword}
              value={password}
              setValue={setPassword}
              errorText="Password must be at least 8 characters long"
              showError={showPasswordError}
              setShowError={setShowPasswordError}
              minLength={5}
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
          className={`${styles.clean} ${styles.button}`}
          onClick={handleReset}
        >
          <GiBroom className={styles.icon} />
          {translations.adminClean}
        </button>

        <button
          type="reset"
          className={`${styles.delete} ${styles.button}`}
          onClick={handleReset}
        >
          {translations.adminDelete}
        </button>
        <button
          type="button"
          className={`${styles.save} ${styles.button}`}
          onClick={handleAddManager}
        >
          {translations.adminSave}
        </button>
      </div>
    </form>
  );
};

export default AddManager;
