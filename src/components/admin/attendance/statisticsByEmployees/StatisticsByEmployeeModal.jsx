import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { SelectOptions, DateInput } from "../../../common/Input";
import styles from "./StatisticsByEmployeeModal.module.css";
import userPhoto from "../../../../assets/img/Mask group.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const StatisticsByStudentModal = ({ closeModal }) => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [byTeacher, setByTeacher] = useState("");
  const [bySubject, setBySubject] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [labels, setLabels] = useState([]);

  const dataArray = [
    60, 80, 33, 76, 50, 60, 80, 33, 76, 50, 60, 80, 33, 76, 50, 60, 80, 33, 76,
    50, 60, 80, 33, 76, 50, 60, 80, 33, 76, 50, 60, 80, 33, 76, 50, 60, 80, 33,
    76, 50, 60, 80, 33, 76, 50, 60, 80, 33, 76, 50, 60, 80, 33, 76, 50, 60, 80,
    33, 76, 50, 100, 0,
  ];

  const generateDateLabels = (startDate, endDate) => {
    const dateArray = [];
    let currentDate = new Date(startDate);
    const stopDate = new Date(endDate);

    while (currentDate <= stopDate) {
      dateArray.push(new Date(currentDate).toLocaleDateString("en-GB"));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  };

  const handleApplyChange = () => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const newLabels = generateDateLabels(startDate, endDate);
    const newFilteredData = dataArray.slice(0, newLabels.length);

    setLabels(newLabels);
    setFilteredData(newFilteredData);
  };

  const data = {
    labels: labels,
    datasets: [
      {
        data: filteredData,
        fill: true,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
      },
    },
  };

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalHeader}>
        <img src={userPhoto} alt="userPhoto" />
        <div className={styles.studentPersonalInfo}>
          <div className={styles.studentFullName}>
            Jahongir Yusupov Solijon o‘g‘li
          </div>
          <p className={styles.attandance}>Attendance</p>
          <div className={styles.studentFilters}>
            <div className={styles.formGroup}>
              <DateInput
                text={"Start date"}
                value={start}
                setValue={setStart}
                width={170}
                height={50}
                bgColor={"#0000000D"}
              />
            </div>
            <div className={styles.formGroup}>
              <DateInput
                text={"End date"}
                value={end}
                setValue={setEnd}
                width={170}
                height={50}
                bgColor={"#0000000D"}
              />
            </div>
            <div className={styles.formGroup}>
              <SelectOptions
                text={"By Teacher"}
                values={[]}
                value={byTeacher}
                setValue={setByTeacher}
                width={196}
                height={50}
                bgColor={"#0000000D"}
              />
            </div>
            <div className={styles.formGroup}>
              <SelectOptions
                text={"By Subject"}
                values={[]}
                value={bySubject}
                setValue={setBySubject}
                width={196}
                height={50}
                bgColor={"#0000000D"}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.studentProgress}>
        <Line data={data} options={options} width={700} height={200} />
        <div className={styles.term}>
          <p>Start: {start}</p>
          <p>Finish: {end}</p>
        </div>
      </div>
      <div className={styles.btns}>
        <button onClick={closeModal}>Cancel</button>
        <button onClick={handleApplyChange}>Apply change</button>
      </div>
    </div>
  );
};

export default StatisticsByStudentModal;
