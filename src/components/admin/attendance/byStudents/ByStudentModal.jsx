import { useState, useEffect } from 'react';
import ByStudentModalHeader from './ByStudentsModalHeader';
import ByStudentTimeTable from './ByStudentTimeTable';
import { FaCalendarDays } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import styles from './ByStudentModal.module.css';

const ByStudentModal = () => {
  const [date, setDate] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [startDay, setStartDay] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay()
  );
  const translations = useSelector((state) => state.language.translations);
  const [daysInMonth, setDaysInMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()
  );

  const monthData = [
    translations.January,
    translations.February,
    translations.March,
    translations.April,
    translations.May,
    translations.June,
    translations.July,
    translations.August,
    translations.September,
    translations.October,
    translations.November,
    translations.December,
  ];

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleFocus = (e) => {
    e.target.type = 'month';
  };

  const handleBlur = (e) => {
    e.target.type = 'text';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (date) {
      let chooseYear = +date.slice(0, 4);
      let chooseMonth = +date.slice(5, 7);
      setYear(chooseYear);
      setMonth(chooseMonth);

      setDaysInMonth(() => {
        return new Date(chooseYear, chooseMonth, 0).getDate();
      });
    } else {
      alert('Please choose a month and year.');
    }
  };

  useEffect(() => {
    let dayIndex = new Date(year, month - 1, 1).getDay();
    dayIndex == 0 && setStartDay(7);
    dayIndex > 0 && setStartDay(dayIndex);
  }, [year, month]);

  return (
    <div className={styles.modal}>
      <ByStudentModalHeader />

      {/* search by date start */}
      <div className={styles.searchdiv}>
        <h1>
          {monthData[month - 1]}, {year}
        </h1>
        <form>
          <div className={styles.formGroup}>
            <input
              type='text'
              value={date}
              onChange={handleDateChange}
              className={date ? styles.valid : ''}
              placeholder=''
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <span className={styles.text}>
              {translations.adminChooseMonthYear}
            </span>
            <span className={styles.dateicon}>
              <FaCalendarDays />
            </span>
          </div>
          <button className={styles.searchBtn} onClick={handleSearch}>
            {translations.adminSearch}
          </button>
        </form>
      </div>
      {/* search by date end */}

      <ByStudentTimeTable
        daysInMonth={daysInMonth}
        startDay={startDay}
        monthData={monthData}
        month={month}
      />
    </div>
  );
};

export default ByStudentModal;
