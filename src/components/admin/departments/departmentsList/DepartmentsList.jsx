import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDepartments,
  deleteDepartment,
} from "../../../../redux/slices/departments/departmentsSlice";
import ConfirmationDialog from "../../../common/ConfirmationDialog";
import Modal from "../../../modal/Modal";
import DepartmentModal from "../departmentModal/DepartmentModal";
import { enqueueSnackbar as EnSn } from "notistack";
import { FaXmark } from "react-icons/fa6";
import styles from "./DepartmentsList.module.css";

const DepartmentsList = () => {
  const dispatch = useDispatch();

  const { departments, status, error } = useSelector(
    (state) => state.departments || {}
  );

  const [showModal, setShowModal] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [propDept, setpropDept] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const translations = useSelector((state) => state.language.translations);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const departmentsList = Array.isArray(departments) ? departments : [];

  const handleDeleteClick = (departmentId) => {
    setSelectedDepartmentId(departmentId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDepartmentId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedDepartmentId) {
      setSubmitAttempted(true);
      dispatch(deleteDepartment(selectedDepartmentId));
    }
  };

  useEffect(() => {
    if (submitAttempted) {
      if (status === "succeeded") {
        handleCloseDialog();
        EnSn(translations.departmentCreated, { variant: "success" });
        setSubmitAttempted(false);
      } else if (status === "failed") {
        EnSn(error, { variant: "error" });
        setSubmitAttempted(false);
      }
    }
  }, [status, error, translations, submitAttempted]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // if (error) {
  //   return <p>Error loading departments: {error}</p>;
  // }

  return (
    <>
      {showModal && (
        <Modal>
          <DepartmentModal propDept={propDept} />
          <button onClick={() => setShowModal(false)}>
            <FaXmark />
          </button>
        </Modal>
      )}

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <td>
              <span>{translations.adminDepartmentName}</span>
            </td>
            <td>
              <span>{translations.adminManager}</span>
            </td>
            <td>
              <span>{translations.adminManagerNumber}</span>
            </td>
            <td>
              <span>{translations.adminGroups}</span>
            </td>
            <td className={styles.action}>
              <span>{translations.adminAction}</span>
            </td>
          </tr>
        </thead>

        <tbody className={styles.tbody}>
          {departmentsList.map((department, index) => {
            const manager = department.manager || {};

            return (
              <tr className={styles.tr} key={index}>
                <td>
                  <span>{department.name}</span>
                </td>
                <td>
                  <span>
                    {manager.first_name
                      ? `${manager.first_name} ${manager.last_name}`
                      : "No manager assigned"}
                  </span>
                </td>
                <td>
                  <a href={`tel:${manager.phone_number}`}>
                    {manager.phone_number || "No phone number"}
                  </a>
                </td>
                <td className={styles.seeAll}>
                  <button
                    onClick={() => {
                      setpropDept(department);
                      setShowModal(true);
                    }}
                  >
                    {translations.adminSeeAll}
                  </button>
                </td>
                <td className={styles.action}>
                  {/* <button className={styles.update}>Update</button> */}
                  <button
                    className={styles.delete}
                    onClick={() => handleDeleteClick(department.id)}
                  >
                    {translations.adminDelete}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Confirmation Dialog for Deletion */}
      {openDialog && (
        <ConfirmationDialog
          open={openDialog}
          handleClose={handleCloseDialog}
          handleConfirm={handleConfirmDelete}
          departmentName={
            departmentsList.find((d) => d.id === selectedDepartmentId)?.name
          }
        />
      )}
    </>
  );
};

export default DepartmentsList;
