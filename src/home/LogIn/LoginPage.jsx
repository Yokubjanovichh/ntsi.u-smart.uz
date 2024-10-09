import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PatternFormat } from "react-number-format";
import { enqueueSnackbar as EnSn } from "notistack";
import { loginUser, getMe } from "../../redux/slices/auth/authSlice";
import { useNavigate } from "react-router-dom"; // useNavigate uchun import
import arrow from "../../assets/svg/arrow.svg";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate hook'ini chaqirish
  const { status, error, user } = useSelector((state) => state.auth); // userni qo'shish
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const translations = useSelector((state) => state.language.translations);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    dispatch(loginUser({ phoneNumber, password }));
  };

  useEffect(() => {
    if (submitAttempted) {
      if (status === "succeeded") {
        dispatch(getMe()).then(() => {
          // Ro'lga qarab yo'naltirish
          if (user && user.role) {
            if (user.role === "admin") {
              navigate("/dashboard/admin");
            } else if (user.role === "teacher") {
              navigate("/dashboard/teacher");
            } else if (user.role === "student") {
              navigate("/dashboard/student");
            }
          }
        });
        EnSn(translations.logged, { variant: "success" });
        setSubmitAttempted(false);
      } else if (status === "failed") {
        EnSn(error, { variant: "error" });
        setSubmitAttempted(false);
      }
    }
  }, [status, error, translations, submitAttempted, dispatch, navigate, user]); // userni qo'shish

  return (
    <div className={`${styles.loginPage}`} id="login">
      <h1>{translations.mainName}</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.note}>
          <p>{translations.mainWarning}</p>
        </div>
        <div className={styles.login}>
          <PatternFormat
            format="+998 ## ### ## ##"
            allowEmptyFormatting
            mask=" "
            name="loginPhone"
            value={phoneNumber}
            onValueChange={(values) => setPhoneNumber(values.value)}
            required
            placeholder="Enter phone number"
            className={styles.loginInputPhone}
            autoComplete="off"
          />

          <div className={styles.loginPasswordAndBtn}>
            <input
              type="password"
              placeholder={translations.mainEnterPassword}
              name="LoginPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
            />
            <button type="submit" disabled={status === "loading"}>
              <img src={arrow} alt="arrow" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
