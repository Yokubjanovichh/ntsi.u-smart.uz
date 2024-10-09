import React, { Fragment } from 'react';
import styles from './ByStudentTimeTable.module.css';
import LessonTable from './LessonTable';
import { useSelector } from 'react-redux';

const byStudentTimeTable = ({ daysInMonth, startDay, monthData, month }) => {
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

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const startDayOfWeek =
    startDay == 1
      ? null
      : Array.from({ length: startDay - 1 }, (_, i) => i + 1);

  const pairsPerDay = [1, 2, 3, 4];

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
              <div className={styles.lessons}>
                {pairsPerDay &&
                  pairsPerDay.map((pair, index) => {
                    return (
                      <Fragment key={index}>
                        <LessonTable />
                      </Fragment>
                    );
                  })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default byStudentTimeTable;
