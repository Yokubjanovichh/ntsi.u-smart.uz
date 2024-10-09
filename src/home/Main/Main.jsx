import React, { useEffect } from 'react';
import AboutUs from '../About-us/About';
import HowItWorks from '../HowItWorks/HowItWorks';
import Contact from '../Contact/Contact';
import styles from './Main.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../redux/slices/auth/authSlice';

export default function Main() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token');

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded' && token && user) {
      switch (user.type) {
        case 'teacher':
          navigate('/dashboard/teacher/myprofile');
          break;
        case 'student':
          navigate('/dashboard/student/myprofile');
          break;
        default:
          navigate('/dashboard/admin/myprofile');
          break;
      }
    } else if (status === 'failed' || error) {
      navigate('/');
    }
  }, [status, token, user, error, navigate]);

  return (
    <main className={`${styles.main} content`}>
      <AboutUs />
      <HowItWorks />
      <Contact />
    </main>
  );
}
