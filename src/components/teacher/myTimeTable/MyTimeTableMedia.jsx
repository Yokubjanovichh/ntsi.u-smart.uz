import { useState, useEffect } from "react";
import styles from "./MyTimeTableMedia.module.css";

const MyTimeTableMedia = ({ monthDays, lessonsInMonth, lessonsDays }) => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [timetableForDay, setTimetableForDay] = useState([]);
  const weekdays = ["dush", "sesh", "chor", "pay", "jum", "shan", "yak"];

  useEffect(() => {
    if (lessonsDays.includes(selectedDay)) {
      const index = lessonsDays.indexOf(selectedDay);
      setTimetableForDay(lessonsInMonth[index]?.subjects);
    } else {
      setTimetableForDay([]);
    }
  }, [selectedDay, lessonsInMonth]);

  return (
    <div className={styles.container}>
      <div className={styles.week}>
        {weekdays.map((day, i) => {
          return <span key={i}>{day}</span>;
        })}
      </div>

      <div className={styles.days}>
        {monthDays.map((day, i) => {
          const activeClassName =
            day == selectedDay ||
            (day == selectedDay && lessonsDays.includes(`${day}`))
              ? styles.active
              : lessonsDays.includes(`${day}`)
              ? styles.haveLesson
              : undefined;
          return (
            <div
              key={i}
              className={activeClassName}
              onClick={() => setSelectedDay(day)}
            >
              <span>{day}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.lessons}>
        <h1>{selectedDay}-avgust dars jadvali.</h1>
        <div className={styles.lessonsContainer}>
          {timetableForDay.length == 0 && (
            <div className={styles.noLesson}>
              <h1>No Lesson Today</h1>
            </div>
          )}
          {timetableForDay &&
            timetableForDay.map((lesson, i) => {
              return (
                <div key={i} className={styles.lesson}>
                  <p className={styles.time}>
                    {lesson?.slot?.start_time} - {lesson?.slot?.end_time}
                  </p>
                  <p className={styles.subject}>{lesson?.subject?.name}</p>
                  {/* <p className={styles.teacher}>Sanjar backender</p> */}
                  <p className={styles.room}>Xona: {lesson?.room?.name}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default MyTimeTableMedia;
