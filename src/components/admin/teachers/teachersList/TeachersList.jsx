import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTeachers,
  deleteTeacher,
} from "../../../../redux/slices/teachers/teachersSlice";
import {
  fetchTeachersLastDetections,
  fetchTodayTeachersLastDetections,
} from "../../../../redux/slices/detections/detectionsSlice";
import { MAINURL } from "../../../../redux/api/axios";
import ConfirmationDialog from "../../../common/ConfirmationDialog";
import { connectWebSocket } from "../../../../redux/websocket";
import { fetchRooms } from "../../../../redux/slices/timetable/timetablesSlice";
import { enqueueSnackbar as EnSn } from "notistack";
import notIcon from "../../../../../src/assets/svg/not.svg";
import buildingIcon from "../../../../../src/assets/svg/building.svg";
import styles from "./TeachersList.module.css";

const TeachersList = () => {
  const dispatch = useDispatch();
  const { teachers, status, error } = useSelector((state) => state.teachers);
  const {
    detections,
    status: detectStatus,
    error: detectError,
  } = useSelector((state) => state.detections);
  const { rooms } = useSelector((state) => state.timetable);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [detectedTeachers, setDetectedTeachers] = useState(new Set());
  const [cameraToRoomMap, setCameraToRoomMap] = useState(new Map());
  const [teacherToCameraMap, setTeacherToCameraMap] = useState({});
  const [animatedRoomNames, setAnimatedRoomNames] = useState({});
  const cameraToRoomMapRef = useRef(new Map());
  const now = new Date();

  const translations = useSelector((state) => state.language.translations);

  useEffect(() => {
    dispatch(fetchTeachers());
    dispatch(fetchRooms());
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(fetchTeachersLastDetections());
  // }, []);

  useEffect(() => {
    dispatch(fetchTodayTeachersLastDetections());
  }, []);

  useEffect(() => {
    const map = new Map();
    rooms.forEach((room) => {
      room.cameras.forEach((camera) => {
        if (camera.id && room.name) {
          map.set(camera.id, room.name);
        }
      });
    });
    cameraToRoomMapRef.current = map;
  }, [rooms]);

  useEffect(() => {
    if (detections && detections.length > 0) {
      detections.forEach((data) => {
        setDetectedTeachers((prev) => new Set(prev.add(data.user)));

        setTeacherToCameraMap((prevMap) => {
          const prevCameraId = prevMap[data.user];
          const newCameraId = data.camera;

          if (!prevCameraId || prevCameraId !== newCameraId) {
            animateRoomName(data.user, newCameraId);
          }

          return { ...prevMap, [data.user]: newCameraId };
        });
      });
    }
  }, [detections]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const ws = connectWebSocket(token);

      ws.on("connect", () => {
        console.log("WebSocket connected");
      });

      ws.on("detect", (data) => {
        const detectionIndex = detections.findIndex(
          (detection) => detection.user === data.user
        );

        detections[detectionIndex].time = new Date();

        setDetectedTeachers((prev) => new Set(prev.add(data.user)));

        setTeacherToCameraMap((prevMap) => {
          const prevCameraId = prevMap[data.user];
          const newCameraId = data.camera;

          if (!prevCameraId || prevCameraId !== newCameraId) {
            animateRoomName(data.user, newCameraId);
          }

          return { ...prevMap, [data.user]: newCameraId };
        });
      });

      return () => {
        ws.disconnect();
      };
    }
  }, [token]);

  const animateRoomName = (userId, cameraId) => {
    const cameraToRoomMap = cameraToRoomMapRef.current;

    if (!cameraToRoomMap || !cameraToRoomMap.has(cameraId)) {
      console.warn("cameraToRoomMap is undefined or cameraId not found");
      return;
    }

    const roomName =
      cameraToRoomMap.get(cameraId) || translations.adminUnkownRoom;

    const codeletters = "&#*+%?£@§$";
    let currentLength = 0;
    let revealLength = 0;

    const animateRandomText = () => {
      if (currentLength < roomName.length) {
        currentLength += 2;
        if (currentLength > roomName.length) {
          currentLength = roomName.length;
        }

        const randomText = generateRandomString(currentLength);
        setAnimatedRoomNames((prev) => ({ ...prev, [userId]: randomText }));
        setTimeout(animateRandomText, 100);
      } else {
        revealRoomName();
      }
    };

    const revealRoomName = () => {
      if (revealLength < roomName.length) {
        revealLength += 1;
        const partialText = roomName.substring(0, revealLength);
        const remainingRandomText = generateRandomString(
          roomName.length - revealLength
        );
        setAnimatedRoomNames((prev) => ({
          ...prev,
          [userId]: partialText + remainingRandomText,
        }));
        setTimeout(revealRoomName, 40);
      } else {
        setAnimatedRoomNames((prev) => ({ ...prev, [userId]: roomName }));
      }
    };

    const generateRandomString = (length) => {
      let randomText = "";
      for (let i = 0; i < length; i++) {
        randomText += codeletters.charAt(
          Math.floor(Math.random() * codeletters.length)
        );
      }
      return randomText;
    };

    animateRandomText();
  };

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
      if (status === "succeeded") {
        handleCloseDialog();
        EnSn(translations.teacherDeleted, { variant: "success" });
        setSubmitAttempted(false);
      } else if (status === "failed") {
        EnSn(error, { variant: "error" });
        setSubmitAttempted(false);
      }
    }
  }, [status, error, translations, submitAttempted]);

  if (status === "loading" || detectStatus === "loading") {
    return <p>Loading...</p>;
  }

  // if (error || detectError) {
  //   return <p>Error loading students: {error || detectError}</p>;
  // }

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
              const cameraId =
                teacherToCameraMap[teacher.id] || teacher.camera_id;
              const roomName =
                animatedRoomNames[teacher.id] ||
                cameraToRoomMap.get(cameraId) ||
                translations.adminUnkownRoom;
              const isDetected = detectedTeachers.has(teacher.id);

              const detection = detections.find(
                (detection) => detection.user === teacher.id
              );
              const detectionInterval = detection
                ? now - new Date(detection.time)
                : null;
              let formattedTime = "Not detected";
              if (detectionInterval !== null) {
                const totalMinutes = Math.floor(
                  detectionInterval / (1000 * 60)
                );
                const minutes = totalMinutes % 60;
                const hours = Math.floor(totalMinutes / 60);
                if (totalMinutes > 1) {
                  formattedTime = `${hours
                    .toString()
                    .padStart(2, "0")}:${minutes
                    .toString()
                    .padStart(2, "0")} oldin`;
                } else {
                  formattedTime = "online";
                }
              }

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
                      {isDetected ? (
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
                    <span
                      style={{
                        color: `${formattedTime === "online" ? "blue" : ""}`,
                      }}
                    >
                      {formattedTime}
                    </span>
                  </td>
                  <td>
                    <span>{roomName}</span>
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
