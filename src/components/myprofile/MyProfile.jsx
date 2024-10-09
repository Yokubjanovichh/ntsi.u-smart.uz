import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../../redux/slices/auth/authSlice';
import styles from './MyProfile.module.css';
import { TextInput, DateInput } from '../common/Input';
import { ChooseImageIcon } from '../admin/Icons';
import { MAINURL } from '../../redux/api/axios';

const MyProfile = () => {
  const dispatch = useDispatch();
  const { user, status } = useSelector((state) => state.auth);
  const translations = useSelector((state) => state.language.translations);
  const [jshir, setJshir] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [startDay, setStartDay] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setJshir(user.pini || '');
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setMiddleName(user.middle_name || '');
      setBirthDate(user.birth_date || '');
      setAddress(user.address || '');
      setPhoneNumber(user.phone_number || '');
      setImage(
        user.image?.file_path ? `${MAINURL}${user.image.file_path}` : null
      );
    }
  }, [user]);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setJshir('');
    setFirstName('');
    setLastName('');
    setMiddleName('');
    setBirthDate('');
    setAddress('');
    setPhoneNumber('');
    setStartDay('');
    setEmail('');
    setImage(null);
  };

  const handleClickReset = (e) => {
    e.preventDefault();
    handleReset();
  };

  const handleUpdateInfo = (e) => {
    e.preventDefault();
    const newInfo = {
      jshir,
      lastName,
      firstName,
      middleName,
      birthDate,
      address,
      phoneNumber,
      startDay,
      email,
      image,
    };

    handleReset();
    console.log(newInfo);
  };

  return (
    <form className={styles.form}>
      <div className={styles.formContainer}>
        <div className={styles.inputs}>
          <TextInput
            text={translations.adminjshir}
            value={jshir}
            setValue={setJshir}
            errorText={'JSHIR must be at least 14 characters long'}
            showError={jshir.length < 14 && jshir.length > 0}
            type={'number'}
            maxLength={14}
          />

          <TextInput
            text={translations.adminFirstName}
            value={firstName}
            setValue={setFirstName}
          />

          <TextInput
            text={translations.adminLastName}
            value={lastName}
            setValue={setLastName}
          />

          <TextInput
            text={translations.adminMiddleName}
            value={middleName}
            setValue={setMiddleName}
            required='off'
          />

          <DateInput
            text={translations.adminDateOfBirth}
            value={birthDate}
            setValue={setBirthDate}
          />

          <TextInput
            text={translations.adminHomeAddress}
            value={address}
            setValue={setAddress}
          />

          <TextInput
            text={translations.adminPhoneNumber}
            value={phoneNumber}
            setValue={setPhoneNumber}
          />
        </div>

        <div className={styles.image}>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            id='image'
          />
          {image ? (
            <label htmlFor='image'>
              <img src={image} alt='Selected' />
            </label>
          ) : (
            <label htmlFor='image'>
              <ChooseImageIcon />
            </label>
          )}
        </div>
      </div>

      <div className={styles.buttons}>
        <button className={styles.reset} onClick={handleClickReset}>
          {translations.adminClean}
        </button>
        <button className={styles.update} onClick={handleUpdateInfo}>
          {translations.adminUpdate}
        </button>
      </div>
    </form>
  );
};

export default MyProfile;
