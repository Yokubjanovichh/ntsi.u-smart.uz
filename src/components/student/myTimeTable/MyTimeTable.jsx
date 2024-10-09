import { useEffect, useState, Fragment } from "react";
import { SelectSearch, SearchInput, DateInput } from "../../common/Input";
import TimeTableLesson from "./TimeTableLesson/TimeTableLesson";
import { useDispatch, useSelector } from "react-redux";
import { FaCalendarDays } from "react-icons/fa6";

import styles from "./MyTimeTable.module.css";
// import { fetchGroupWithQuery } from "../../../../redux/slices/groups/groupsSlice";
import { fetchPairsByStudent } from "../../../redux/slices/timetable/timetablesSlice";

// media component
import MyTimeTableMedia from "./myTimeTableMedia/MyTimeTableMedia";

const MyTimeTable = () => {
  // screen width code start
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // screen width code end

  const dispatch = useDispatch();
  // const [role, setRole] = useState("");
  const [groupId, setGroupId] = useState(false);
  const groupData = useSelector((state) => state.groups.groups) || [];
  const timeTable =
    useSelector((state) => state.timetable.pairsByStudent) || [];
  const [timeTableInYear, setTimeTableInYear] = useState({});
  const [timeTableInMonth, setTimeTableInMonth] = useState({});
  const [lessonsDays, setLessonsDays] = useState([]);

  const translations = useSelector((state) => state.language.translations);

  const [date, setDate] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [startDay, setStartDay] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay()
  );
  const [daysInMonth, setDaysInMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()
  );

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const startDayOfWeek =
    startDay === 1
      ? null
      : Array.from({ length: startDay - 1 }, (_, i) => i + 1);

  const [searchTeacher, setSearchTeacher] = useState("");
  const [searchSubject, setSearchSubject] = useState("");

  const monthNames = [
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

  const weekDays = [
    translations.Monday,
    translations.Tuesday,
    translations.Wednesday,
    translations.Thursday,
    translations.Friday,
    translations.Saturday,
    translations.Sunday,
  ];

  const currentMonth = monthNames[month - 1];
  const currentYear = year;

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

      const finalQuery = "";
      dispatch(fetchPairsByStudent(finalQuery));
    } else {
      alert("Please choose a month and year.");
    }
  };

  useEffect(() => {
    // Set year-related data
    if (timeTable[year]) {
      setTimeTableInYear(timeTable[year]);

      // Set month-related data based on the year
      if (timeTable[year][month]) {
        setTimeTableInMonth(timeTable[year][month]);

        // Set lesson days based on the month
        setLessonsDays(Object.keys(timeTable[year][month]));
      }
    }
  }, [timeTable, year, month]);

  useEffect(() => {
    let dayIndex = new Date(year, month - 1, 1).getDay();
    dayIndex === 0 && setStartDay(7);
    dayIndex > 0 && setStartDay(dayIndex);
  }, [year, month]);

  return (
    <div className={styles.timeTableWrapper}>
      <form className={styles.timeTableFilter}>
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
          <span className={styles.text}>
            {translations.adminChooseMonthYear}
          </span>
          <span className={styles.dateicon}>
            <FaCalendarDays />
          </span>
        </div>
        <button type="button" onClick={handleSearch}>
          {translations.adminSearch}
        </button>
      </form>
      <h1 className={styles.timeTableMonthAndYear}>
        {`${currentMonth}, ${currentYear}`}
      </h1>

      {/* months lessons plan start */}
      {windowWidth > 768 && (
        <div className={styles.monthLessonPlan}>
          <div className={styles.weekDays}>
            {weekDays.map((day, index) => (
              <div key={index} className={styles.weekday}>
                <p>{day}</p>
              </div>
            ))}
          </div>

          <div className={styles.week}>
            {startDayOfWeek &&
              startDayOfWeek.map((_, index) => (
                <div key={index} className={styles.notchoosenday}></div>
              ))}

            {monthDays &&
              monthDays.map((day, index) => (
                <div key={index} className={styles.day}>
                  <span className={styles.date}>
                    {day}- {monthNames[month - 1]}
                  </span>

                  {!lessonsDays.includes(`${day}`) && (
                    <div className={styles.nolessons}>
                      <p>{translations.adminNoLesson}</p>
                    </div>
                  )}

                  {lessonsDays.includes(`${day}`) && (
                    <div className={styles.lessons}>
                      {timeTableInMonth[`${day}`]?.map((pair, index) => {
                        return (
                          <Fragment key={index}>
                            <TimeTableLesson key={index} pair={pair} />
                          </Fragment>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
      {/* months lessons plan end */}

      {/* months lessons plan media start */}

      {windowWidth <= 768 && (
        <div className={styles.mediaContainer}>
          <MyTimeTableMedia
            monthDays={monthDays}
            timeTableInMonth={timeTableInMonth}
            lessonsDays={lessonsDays}
          />
        </div>
      )}

      {/* months lessons plan media end */}
    </div>
  );
};

export default MyTimeTable;
