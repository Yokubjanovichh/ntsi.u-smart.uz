import { useState } from 'react';
import styles from './AdminHistory.module.css';
import { DateInput } from '../../../common/Input';
import { useSelector } from 'react-redux';

const AdminHistory = () => {
  const translations = useSelector((state) => state.language.translations);
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const [historyData, setHistoryData] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
  ]);

  return <p>{translations.adminNoHistory}</p>;

  // return (
  //   <section className={styles.history}>
  //     <header className={styles.header}>
  //       <input
  //         type="text"
  //         placeholder="Search by name"
  //         id="search"
  //         className={styles.search}
  //         autoComplete="off"
  //       />
  //       <DateInput
  //         text="Calendar"
  //         value={currentDate}
  //         setValue={setCurrentDate}
  //       />
  //       <DateInput
  //         text="Start date"
  //         value={startDate}
  //         setValue={setStartDate}
  //       />
  //       <DateInput
  //         text="Finish date"
  //         value={finishDate}
  //         setValue={setFinishDate}
  //       />
  //       <button className={styles.searchBtn}>Search</button>
  //     </header>

  //     <div className={styles.container}>
  //       <table className={styles.table}>
  //         <thead className={styles.thead}>
  //           <tr>
  //             <td>ID</td>
  //             <td>Name</td>
  //             <td>By whom(withr role)</td>
  //             <td>Action type</td>
  //             <td>Date</td>
  //           </tr>
  //         </thead>
  //         <tbody className={styles.tbody}>
  //           {historyData &&
  //             historyData.map((_, i) => {
  //               return (
  //                 <tr key={i}>
  //                   <td>
  //                     <span>1234</span>
  //                   </td>
  //                   <td>
  //                     <span>Utkir Giyosov</span>
  //                   </td>
  //                   <td>
  //                     <span>Azimoj Jalilov / Helper PM</span>
  //                   </td>
  //                   <td>
  //                     <button className={styles.delete}>Delete</button>
  //                   </td>
  //                   <td>
  //                     <span>15/02/2024</span>
  //                   </td>
  //                 </tr>
  //               );
  //             })}
  //         </tbody>
  //       </table>
  //     </div>
  //   </section>
  // );
};

export default AdminHistory;
