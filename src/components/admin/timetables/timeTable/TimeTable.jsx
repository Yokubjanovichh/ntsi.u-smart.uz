import { useEffect, useState, Fragment } from "react";
import { SearchInput, SelectOptions } from "../../../common/Input";
import TimeTableLesson from "./TimeTableLesson/TimeTableLesson";
import { useDispatch, useSelector } from "react-redux";
import ModalTimeTable from "../modalTimeTable/ModalTimeTable";
import { fetchGroupWithQuery } from "../../../../redux/slices/groups/groupsSlice";
import { fetchTimeTable } from "../../../../redux/slices/timetable/timetablesSlice";
import { FaCalendarDays } from "react-icons/fa6";
import styles from "./TimeTable.module.css";

const TimeTable = () => {
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [schedule, setSchedule] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [date, setDate] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [startDay, setStartDay] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay()
  );
  const [daysInMonth, setDaysInMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()
  );

  // State for validation
  const [showGroupIdError, setShowGroupIdError] = useState(false);
  const [showDateError, setShowDateError] = useState(false);
  const translations = useSelector((state) => state.language.translations);

  const groupData = useSelector((state) => state.groups.groups) || [];
  const timeTable = useSelector((state) => state.timetable.timetable) || {};
  const [timeTableInYear, setTimeTableInYear] = useState({});
  const [timeTableInMonth, setTimeTableInMonth] = useState({});
  const [lessonsDays, setLessonsDays] = useState([]);

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const startDayOfWeek =
    startDay === 1
      ? null
      : Array.from({ length: startDay - 1 }, (_, i) => i + 1);

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const currentMonth = monthNames[month - 1];
  const currentYear = year;

  useEffect(() => {
    dispatch(fetchGroupWithQuery(""));
  }, [dispatch]);

  const handleDateChange = (event) => {
    setDate(event.target.value);
    setShowDateError(false);
  };

  const handleFocus = (e) => {
    e.target.type = "month";
  };

  const handleBlur = (e) => {
    e.target.type = "text";
  };

  const validateSearchInput = () => {
    const isGroupIdValid = groupName.trim().length > 0;
    const isDateValid = date.trim().length > 0;

    setShowGroupIdError(!isGroupIdValid);
    setShowDateError(!isDateValid);

    return isGroupIdValid && isDateValid;
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (validateSearchInput()) {
      let chooseYear = +date.slice(0, 4);
      let chooseMonth = +date.slice(5, 7);
      setYear(chooseYear);
      setMonth(chooseMonth);

      setDaysInMonth(() => {
        return new Date(chooseYear, chooseMonth, 0).getDate();
      });
      const finalQuery = {
        query: groupName,
        year: chooseYear,
        month: chooseMonth,
      };

      dispatch(fetchTimeTable(finalQuery));
    }
  };

  useEffect(() => {
    let dayIndex = new Date(year, month - 1, 1).getDay();
    dayIndex === 0 && setStartDay(7);
    dayIndex > 0 && setStartDay(dayIndex);
  }, [year, month]);

  // timeTabel in month

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

  return (
    <div className={styles.timeTableWrapper}>
      <div className={styles.timeTableFilter}>
        <form className={styles.filterDate}>
          <div className={styles.formGroup}>
            <SearchInput
              text={translations.adminGroup}
              value={groupName}
              setValue={setGroupName}
              values={groupData}
              errorText="Please choose a group"
              showError={showGroupIdError}
              setShowError={setShowGroupIdError}
            />
          </div>

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
            {showDateError && (
              <span className={styles.errorText}>
                Please choose a valid date
              </span>
            )}
          </div>

          <button
            type="button"
            className={styles.searchBtn}
            onClick={handleSearch}
          >
            {translations.adminSearch}
          </button>
        </form>
      </div>
      <h1 className={styles.timeTableMonthAndYear}>
        {`${currentMonth}, ${currentYear}`}
      </h1>

      {/* months lessons plan start */}
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
                    {Object.values(timeTableInMonth[`${day}`])
                      ?.flat()
                      ?.map((pair, index) => {
                        return (
                          <Fragment key={index}>
                            <TimeTableLesson
                              key={index}
                              pair={pair}
                              openModal={openModal}
                            />
                          </Fragment>
                        );
                      })}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
      <ModalTimeTable isOpen={isModalOpen} onClose={closeModal}>
        <h2>This is a Modal</h2>
        <p>You can add any content here.</p>
      </ModalTimeTable>
    </div>
  );
};

export default TimeTable;
