import React, { useEffect, useState, Fragment } from "react";
import styles from "./TimeTable.module.css";
import LessonTable from "./LessonTable";
import MyTimeTableMedia from "./MyTimeTableMedia";
import { useSelector } from "react-redux";

const TimeTable = ({
  daysInMonth,
  startDay,
  monthData,
  month,
  year,
  timeTable,
}) => {
  const [timeTableInMonth, setTimeTableInMonth] = useState([]);
  const [lessonsInMonth, setLessonsInMonth] = useState([]);
  const [lessonsDays, setLessonsDays] = useState([]);

  useEffect(() => {
    setTimeTableInMonth(
      timeTable.filter((d) => +d.date.date.slice(-5, -3) == month)
    );
  }, [timeTable, year, month]);

  useEffect(() => {
    const lessons = timeTableInMonth.reduce((acc, current) => {
      const { date } = current.date;
      const subject = current || {};

      // Find if the date already exists in the accumulator
      let lesson = acc.find((l) => l.date === date);

      if (!lesson) {
        // If the date does not exist, add a new entry
        lesson = { date: date, subjects: [] };
        acc.push(lesson);
      }

      // Add the subject to the subjects array if it exists
      if (subject) {
        lesson.subjects.push(subject);
      }

      return acc;
    }, []);

    setLessonsInMonth(lessons);
  }, [timeTableInMonth]);

  useEffect(() => {
    const lessonsDays =
      lessonsInMonth && lessonsInMonth.map((lesson) => +lesson.date.slice(-2));
    setLessonsDays(lessonsDays);
  }, [lessonsInMonth]);


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
  const translations = useSelector((state) => state.language.translations);
  const weekDays = [
    translations.Monday,
    translations.Tuesday,
    translations.Wednesday,
    translations.Thursday,
    translations.Friday,
    translations.Saturday,
    translations.Sunday,
  ];

  // Dynamically generate the days in the month based on daysInMonth prop
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const startDayOfWeek =
    startDay == 1
      ? null
      : Array.from({ length: startDay - 1 }, (_, i) => i + 1);

  console.log(lessonsDays);
  // months lessons plan start
  if (windowWidth > 768)
    return (
      <div className={styles.container}>
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
                  {day}- {monthData[month - 1]}
                </span>

                {!lessonsDays.includes(day) && (
                  <div className={styles.nolessons}>
                    <p>{translations.adminNoLesson}</p>
                  </div>
                )}

                {lessonsDays.includes(day) &&
                  lessonsInMonth[
                    lessonsDays.findIndex((d) => d == day)
                  ]?.subjects?.map((pair, index) => {
                    return (
                      <Fragment key={index}>
                        <LessonTable key={index} pair={pair} />
                      </Fragment>
                    );
                  })}
              </div>
            ))}
        </div>
      </div>
    );

  // months lessons plan end

  // months lessons plan media start
  if (windowWidth <= 768)
    return (
      <div className={styles.mediaContainer}>
        <MyTimeTableMedia
          monthDays={monthDays}
          lessonsInMonth={lessonsInMonth}
          lessonsDays={lessonsDays}
        />
      </div>
    );
  // months lessons plan media end
};

export default TimeTable;
