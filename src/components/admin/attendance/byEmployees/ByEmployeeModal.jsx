import { useState, useEffect } from "react";
import ByEmployeeModalHeader from "./ByEmployeeModalHeader";
import ByEmployeeTimeTable from "./ByEmployeeTimeTable";
import { FaCalendarDays } from "react-icons/fa6";
import styles from "./ByEmployeeModal.module.css";

const ByEmployeeModal = () => {
  const [date, setDate] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [startDay, setStartDay] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay()
  );
  const [daysInMonth, setDaysInMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()
  );

  const monthData = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleFocus = (e) => {
    e.target.type = "month";
  };

  const handleBlur = (e) => {
    e.target.type = "text";
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
      alert("Please choose a month and year.");
    }
  };

  useEffect(() => {
    let dayIndex = new Date(year, month - 1, 1).getDay();
    dayIndex == 0 && setStartDay(7);
    dayIndex > 0 && setStartDay(dayIndex);
  }, [year, month]);

  return (
    <div className={styles.modal}>
      <ByEmployeeModalHeader />

      {/* search by date start */}
      <div className={styles.searchdiv}>
        <h1>
          {monthData[month - 1]}, {year}
        </h1>
        <form>
          <div className={styles.formGroup}>
            <input
              type="text"
              value={date}
              onChange={handleDateChange}
              className={date ? styles.valid : ""}
              placeholder=""
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <span className={styles.text}>*Choose month and year</span>
            <span className={styles.dateicon}>
              <FaCalendarDays />
            </span>
          </div>
          <button className={styles.searchBtn} onClick={handleSearch}>
            Search
          </button>
        </form>
      </div>
      {/* search by date end */}


      <ByEmployeeTimeTable
        daysInMonth={daysInMonth}
        startDay={startDay}
        monthData={monthData}
        month={month}
      />
    </div>
  );
};

export default ByEmployeeModal;
