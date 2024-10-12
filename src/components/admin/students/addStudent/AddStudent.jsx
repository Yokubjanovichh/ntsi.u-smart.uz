import React, { useState, useEffect, useCallback } from "react";
import styles from "./AddStudent.module.css";
import { addStudent } from "../../../../redux/slices/students/studentsSlice";
import { fetchGroups } from "../../../../redux/slices/groups/groupsSlice";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar as EnSn } from "notistack";
import { TextInput, DateInput, SelectOptions } from "../../../common/Input";
import { ChooseImageIcon } from "../../Icons";

const AddStudent = () => {
  const dispatch = useDispatch();

  // State variables
  const [jshir, setJshir] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [groupId, setGroupId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const { groups } = useSelector((state) => state.groups);
  const { status, error } = useSelector((state) => state.students);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const translations = useSelector((state) => state.language.translations);

  // State variables for errors
  const [showJshirError, setShowJshirError] = useState(false);
  const [showFirstNameError, setShowFirstNameError] = useState(false);
  const [showLastNameError, setShowLastNameError] = useState(false);
  const [showAddressError, setShowAddressError] = useState(false);
  const [showBirthDateError, setShowBirthDateError] = useState(false);
  const [showGroupIdError, setShowGroupIdError] = useState(false);
  const [showPhoneNumberError, setShowPhoneNumberError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [showImageError, setShowImageError] = useState(false);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setShowImageError(false);
  };

  const handleReset = () => {
    setJshir("");
    setFirstName("");
    setLastName("");
    setMiddleName("");
    setBirthDate("");
    setAddress("");
    setPhoneNumber("");
    setPassword("");
    setGroupId(null);
    setImage(null);

    // Reset error states
    setShowJshirError(false);
    setShowFirstNameError(false);
    setShowLastNameError(false);
    setShowAddressError(false);
    setShowBirthDateError(false);
    setShowGroupIdError(false);
    setShowPhoneNumberError(false);
    setShowPasswordError(false);
    setShowImageError(false);
  };

  // Validate the form
  const validateForm = useCallback(() => {
    const isJshirValid = jshir.length === 14;
    const isFirstNameValid = firstName.length >= 2;
    const isLastNameValid = lastName.length >= 2;
    const isAddressValid = address.length >= 2;
    const today = new Date();
    const selectedDate = new Date(birthDate);
    const isBirthDateValid = selectedDate <= today;
    const isGroupIdValid = groupId !== null && groupId !== "";
    const isPhoneNumberValid = phoneNumber.length === 9;
    const isPasswordValid = password.length >= 6;
    const isImageValid = image !== null;

    setShowJshirError(!isJshirValid);
    setShowFirstNameError(!isFirstNameValid);
    setShowLastNameError(!isLastNameValid);
    setShowAddressError(!isAddressValid);
    setShowBirthDateError(!isBirthDateValid);
    setShowGroupIdError(!isGroupIdValid);
    setShowPhoneNumberError(!isPhoneNumberValid);
    setShowPasswordError(!isPasswordValid);
    setShowImageError(!isImageValid);

    return (
      isJshirValid &&
      isFirstNameValid &&
      isLastNameValid &&
      isAddressValid &&
      isBirthDateValid &&
      isGroupIdValid &&
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
    groupId,
    phoneNumber,
    password,
    image,
  ]);

  // Handle form submission
  const handleAddStudent = useCallback(
    (e) => {
      e.preventDefault();

      if (validateForm()) {
        const newStudent = {
          jshir,
          lastName,
          firstName,
          middleName,
          birthDate,
          address,
          groupId,
          phoneNumber,
          password,
          image,
        };
        setSubmitAttempted(true);
        dispatch(addStudent(newStudent));
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
      groupId,
      phoneNumber,
      password,
      image,
      dispatch,
    ]
  );
  useEffect(() => {
    if (submitAttempted) {
      if (status === "succeeded") {
        EnSn(translations?.studentCreated || "Student successfully created", {
          variant: "success",
        });
        handleReset();
        setSubmitAttempted(false);
      } else if (status === "failed") {
        EnSn(error || "Something went wrong", { variant: "error" });
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
              text="JSHIR"
              value={jshir}
              setValue={setJshir}
              errorText="JSHIR must be 14 characters long"
              showError={showJshirError}
              setShowError={setShowJshirError}
              type="number"
              minLength={13}
              maxLength={14}
            />
          </div>

          <div className={styles.formGroup}>
            <TextInput
              text="First Name"
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
              text="Last Name"
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
              text="Middle Name"
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
              text="Home Address"
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
              text="Phone Number"
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
              text="Password"
              value={password}
              setValue={setPassword}
              errorText="Password must be at least 6 characters long"
              showError={showPasswordError}
              setShowError={setShowPasswordError}
              minLength={5}
              type="password"
            />
          </div>

          <div className={styles.formGroup}>
            <SelectOptions
              text="Select a group"
              values={groups.map((group) => ({
                name: group.name,
                id: group.id,
              }))}
              value={groupId}
              setValue={(value) => {
                setGroupId(value);
                if (value) setShowGroupIdError(false);
              }}
              errorText="Please select a group"
              showError={showGroupIdError}
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
          Delete
        </button>
        <button
          type="submit"
          className={`${styles.save} ${styles.button}`}
          onClick={handleAddStudent}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default AddStudent;
