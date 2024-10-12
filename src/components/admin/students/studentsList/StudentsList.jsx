import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar as EnSn } from "notistack";

import { MAINURL } from "../../../../redux/api/axios";
import { connectWebSocket } from "../../../../redux/websocket";
import {
  fetchStudents,
  deleteStudent,
} from "../../../../redux/slices/students/studentsSlice";
import {
  fetchStudentsLastDetections,
  fetchTodayStudentsLastDetections,
} from "../../../../redux/slices/detections/detectionsSlice";
import { fetchCameras } from "../../../../redux/slices/cameras/camerasSlice";

import ConfirmationDialog from "../../../common/ConfirmationDialog";

import notIcon from "../../../../../src/assets/svg/not.svg";
import buildingIcon from "../../../../../src/assets/svg/building.svg";

import styles from "./StudentsList.module.css";

const StudentsList = () => {
  const dispatch = useDispatch();
  const translations = useSelector((state) => state.language.translations);

  const useStudentsData = () => {
    const dispatch = useDispatch();
    const students = useSelector((state) => state.students.students);
    const status = useSelector((state) => state.students.status);
    const error = useSelector((state) => state.students.error);

    useEffect(() => {
      dispatch(fetchStudents());
    }, [dispatch]);

    return { students, status, error };
  };
  const useCamerasData = () => {
    const dispatch = useDispatch();
    const cameras = useSelector((state) => state.cameras.cameras);
    const status = useSelector((state) => state.cameras.status);
    const error = useSelector((state) => state.cameras.error);

    useEffect(() => {
      dispatch(fetchCameras());
    }, [dispatch]);

    return { cameras, status, error };
  };
  const useDetectionsData = () => {
    const dispatch = useDispatch();
    const detections = useSelector((state) => state.detections.detections);
    const status = useSelector((state) => state.detections.status);
    const error = useSelector((state) => state.detections.error);

    useEffect(() => {
      dispatch(fetchTodayStudentsLastDetections());
    }, [dispatch]);

    return { detections, status, error };
  };

  const {
    students,
    status: studentsStatus,
    error: studentsError,
  } = useStudentsData();
  const {
    cameras,
    status: camerasStatus,
    error: camerasError,
  } = useCamerasData();
  const {
    detections,
    status: detectStatus,
    error: detectError,
  } = useDetectionsData();

  const [camerasMap, setCamerasMap] = useState(new Map());
  const [detectedUsers, setDetectedUsers] = useState(new Map());
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    const newCamerasMap = new Map(
      cameras.map((camera) => [camera.id, camera.room.name])
    );
    setCamerasMap(newCamerasMap);
  }, [cameras]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (detections && detections.length > 0) {
      detections.forEach((data) => {
        detectedUsers.set(data.user, {
          room: camerasMap.get(data.camera),
          time: new Date(data.time),
        });

        setDetectedUsers(detectedUsers);
      });
    }
  }, [detections, cameras]);
  useEffect(() => {
    if (token) {
      const io = connectWebSocket(token);
      io.on("connect", () => {
        console.log("WebSocket connected");
      });
      io.on("detect", (data) => {
        const updatedDetectedUsers = new Map(detectedUsers);
        updatedDetectedUsers.set(data.user, {
          room: camerasMap.get(data.camera),
          time: new Date(),
        });
        setDetectedUsers(updatedDetectedUsers);
      });

      return () => {
        io.disconnect();
      };
    }
  }, [token, camerasMap]);

  const handleDeleteClick = (studentId) => {
    setSelectedStudentId(studentId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudentId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedStudentId) {
      setSubmitAttempted(true);
      dispatch(deleteStudent(selectedStudentId));
    }
  };

  useEffect(() => {
    if (submitAttempted) {
      if (studentsStatus === "succeeded") {
        handleCloseDialog();
        EnSn(translations.studentDeleted, { variant: "success" });
        setSubmitAttempted(false);
      } else if (studentsStatus === "failed") {
        EnSn(studentsError || "Someting went wrong", { variant: "error" });
        setSubmitAttempted(false);
      }
    }
  }, [studentsStatus, studentsError, translations, submitAttempted]);

  if (
    camerasStatus === "loading" ||
    studentsStatus === "loading" ||
    detectStatus === "loading"
  ) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <td className={styles.fullname}>
              <span>{translations.adminLastNameNameMiddleName}</span>
            </td>
            <td className={styles.role}>
              <span>{translations.adminGroup}</span>
            </td>
            <td className={styles.phone}>
              <span>{translations.adminPhoneNumber}</span>
            </td>
            <td className={styles.image}>
              <span>{translations.adminImage}</span>
            </td>
            <td className={styles.status}>
              <span>{translations.adminAttendance}</span>
            </td>
            <td className={styles.jshir}>
              <span>{translations.status}</span>
            </td>
            <td className={styles.status}>
              <span>{translations.adminLocation}</span>
            </td>
            <td className={styles.action}>
              <span>{translations.adminAction}</span>
            </td>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {students.length > 0 ? (
            students.map((student, index) => {
              const detection = detectedUsers.has(student.id)
                ? detectedUsers.get(student.id)
                : { room: translations.adminUnkownRoom, time: null };
              const formattedTime =
                detection && detection.time
                  ? `${detection.time
                      .getHours()
                      .toString()
                      .padStart(2, "0")}:${detection.time
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}`
                  : translations.adminNotDetect;
              return (
                <tr className={styles.tr} key={index}>
                  <td className={styles.fullname}>
                    <span>{`${student.last_name} ${student.first_name}${
                      student.middle_name && student.middle_name !== "null"
                        ? ` ${student.middle_name}`
                        : ""
                    }`}</span>
                  </td>
                  <td className={styles.role}>
                    <span>{student.group?.name || "No group assigned"}</span>
                  </td>
                  <td className={styles.phone}>
                    <a href={`tel:${student.phone_number}`}>
                      {student.phone_number}
                    </a>
                  </td>
                  <td className={styles.image}>
                    <div>
                      {student.image ? (
                        <img
                          src={`${MAINURL}${student.image.file_path}`}
                          alt={`${student.first_name}'s image`}
                        />
                      ) : (
                        <span>{translations.adminNoImage}</span>
                      )}
                    </div>
                  </td>
                  <td className={styles.attendance}>
                    <span>
                      {detection.room !== translations.adminUnkownRoom ? (
                        <img
                          src={buildingIcon}
                          alt="Building Icon"
                          className={styles.buildingIcon}
                        />
                      ) : (
                        <img
                          src={notIcon}
                          alt="Not Icon"
                          className={styles.notIcon}
                        />
                      )}
                    </span>
                  </td>
                  <td>
                    <span>{formattedTime}</span>
                  </td>
                  <td className={styles.role}>
                    <span>{detection.room}</span>
                  </td>
                  <td className={styles.action}>
                    <button
                      className={styles.delete}
                      onClick={() => handleDeleteClick(student.id)}
                    >
                      {translations.adminDelete}
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8">No students found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {openDialog && (
        <ConfirmationDialog
          open={openDialog}
          handleClose={handleCloseDialog}
          handleConfirm={handleConfirmDelete}
          studentName={
            students.find((s) => s.id === selectedStudentId)?.first_name
          }
        />
      )}
    </>
  );
};

export default StudentsList;
