import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar as EnSn } from "notistack";

import { MAINURL } from "../../../../redux/api/axios";
import { connectWebSocket } from "../../../../redux/websocket";
import {
  fetchTeachers,
  deleteTeacher,
} from "../../../../redux/slices/teachers/teachersSlice";
import {
  fetchTeachersLastDetections,
  fetchTodayTeachersLastDetections,
} from "../../../../redux/slices/detections/detectionsSlice";
import { fetchCameras } from "../../../../redux/slices/cameras/camerasSlice";

import ConfirmationDialog from "../../../common/ConfirmationDialog";

import notIcon from "../../../../../src/assets/svg/not.svg";
import buildingIcon from "../../../../../src/assets/svg/building.svg";

import styles from "./TeachersList.module.css";

const TeachersList = () => {
  const dispatch = useDispatch();
  const translations = useSelector((state) => state.language.translations);

  const useTeachersData = () => {
    const dispatch = useDispatch();
    const teachers = useSelector((state) => state.teachers.teachers);
    const status = useSelector((state) => state.teachers.status);
    const error = useSelector((state) => state.teachers.error);

    useEffect(() => {
      dispatch(fetchTeachers());
    }, [dispatch]);

    return { teachers, status, error };
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
      dispatch(fetchTodayTeachersLastDetections());
    }, [dispatch]);

    return { detections, status, error };
  };

  const {
    teachers,
    status: teachersStatus,
    error: teachersError,
  } = useTeachersData();
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
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
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
        const updatedDetectedUsers = new Map(detectedUsers);
        updatedDetectedUsers.set(data.user, {
          room: camerasMap.get(data.camera),
          time: new Date(),
        });
        setDetectedUsers(updatedDetectedUsers);
      });
    }
  }, [detections]);

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

  const handleDeleteClick = (teacherId) => {
    setSelectedTeacherId(teacherId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTeacherId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedTeacherId) {
      setSubmitAttempted(true);
      dispatch(deleteTeacher(selectedTeacherId));
      handleCloseDialog();
    }
  };

  useEffect(() => {
    if (submitAttempted) {
      if (teachersStatus === "succeeded") {
        handleCloseDialog();
        EnSn(translations.teacherDeleted, { variant: "success" });
        setSubmitAttempted(false);
      } else if (teachersStatus === "failed") {
        EnSn(error, { variant: "error" });
        setSubmitAttempted(false);
      }
    }
  }, [teachersStatus, teachersError, translations, submitAttempted]);

  if (
    camerasStatus !== "succeeded" ||
    teachersStatus !== "succeeded" ||
    detectStatus !== "succeeded"
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
              <span>{translations.adminSpecialization}</span>
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
            <td className={styles.location}>
              <span>{translations.adminLocation}</span>
            </td>
            <td className={styles.action}>
              <span>{translations.adminAction}</span>
            </td>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {teachers.length > 0 ? (
            teachers.map((teacher, index) => {
              const detection = detectedUsers.has(teacher.id)
                ? detectedUsers.get(teacher.id)
                : { room: translations.adminUnkownRoom, time: null };
              console.log(detection);
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
                    <span>{`${teacher.last_name} ${teacher.first_name}${
                      teacher.middle_name && teacher.middle_name !== "null"
                        ? ` ${teacher.middle_name}`
                        : ""
                    }`}</span>
                  </td>
                  <td className={styles.role}>
                    <span>{teacher.specialization || "N/A"}</span>
                  </td>
                  <td className={styles.phone}>
                    <a href={`tel:${teacher.phone_number}`}>
                      {teacher.phone_number}
                    </a>
                  </td>
                  <td className={styles.image}>
                    <div>
                      {teacher.image ? (
                        <img
                          src={`${MAINURL}${teacher.image.file_path}`}
                          alt={`${teacher.first_name}'s image`}
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
                  <td>
                    <span>{detection.room}</span>
                  </td>
                  <td className={styles.action}>
                    <button
                      className={styles.delete}
                      onClick={() => handleDeleteClick(teacher.id)}
                    >
                      {translations.adminDelete}
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8">No teachers found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {openDialog && (
        <ConfirmationDialog
          open={openDialog}
          handleClose={handleCloseDialog}
          handleConfirm={handleConfirmDelete}
          roleName="teacher"
        />
      )}
    </>
  );
};

export default TeachersList;
