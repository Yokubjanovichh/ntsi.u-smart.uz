import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGroups,
  deleteGroup,
} from "../../../../redux/slices/groups/groupsSlice";
import ConfirmationDialog from "../../../common/ConfirmationDialog";
import Modal from "../../../modal/Modal";
import GroupModal from "../groupModal/GroupModal";
import { enqueueSnackbar as EnSn } from "notistack";
import { FaXmark } from "react-icons/fa6";
import styles from "./GroupsList.module.css";

const GroupsList = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const translations = useSelector((state) => state.language.translations);

  const dispatch = useDispatch();
  const { groups, status, error } = useSelector((state) => state.groups);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleDeleteClick = (groupId) => {
    setSelectedGroupId(groupId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGroupId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedGroupId) {
      setSubmitAttempted(true);
      dispatch(deleteGroup(selectedGroupId));
    }
  };

  useEffect(() => {
    if (submitAttempted) {
      if (status === "succeeded") {
        handleCloseDialog();
        EnSn(translations.groupDeleted, { variant: "success" });
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

  if (error) {
    return <p>Error loading groups: {error}</p>;
  }

  return (
    <>
      {showModal && (
        <Modal>
          <GroupModal currentGroup={currentGroup} />
          <button onClick={() => setShowModal(false)}>
            <FaXmark />
          </button>
        </Modal>
      )}

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <td>
              <span>{translations.adminGroupNumber}</span>
            </td>
            <td>
              <span>{translations.adminTutor}</span>
            </td>
            <td>
              <span>{translations.adminTutorPhone}</span>
            </td>
            <td>
              <span>{translations.adminStudents}</span>
            </td>
            <td className={styles.action}>
              <span>{translations.adminAction}</span>
            </td>
          </tr>
        </thead>

        <tbody className={styles.tbody}>
          {groups &&
            groups.map((group, index) => {
              const tutor = group.tutor;

              return (
                <tr className={styles.tr} key={index}>
                  <td>
                    <span>{group.name}</span>
                  </td>
                  <td>
                    <span>
                      {tutor
                        ? `${tutor.first_name} ${tutor.last_name}`
                        : "No tutor assigned"}
                    </span>
                  </td>
                  <td>
                    {tutor ? (
                      <a href={`tel:${tutor.phone_number}`}>
                        {tutor.phone_number}
                      </a>
                    ) : (
                      <span>{translations.adminNoPhoneNumber}</span>
                    )}
                  </td>
                  <td className={styles.seeAll}>
                    <button
                      onClick={() => {
                        setCurrentGroup(group);
                        setShowModal(true);
                      }}
                    >
                      {translations.adminSeeAll}
                    </button>
                  </td>
                  <td className={styles.action}>
                    {/* <button className={styles.update}>update</button> */}
                    <button
                      className={styles.delete}
                      onClick={() => handleDeleteClick(group.id)}
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
          groupName={groups.find((g) => g.id === selectedGroupId)?.name}
        />
      )}
    </>
  );
};

export default GroupsList;
