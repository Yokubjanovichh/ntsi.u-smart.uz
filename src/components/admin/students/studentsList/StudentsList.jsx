import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudents,
  deleteStudent,
} from "../../../../redux/slices/students/studentsSlice";
import {
  fetchStudentsLastDetections,
  fetchTodayStudentsLastDetections,
} from "../../../../redux/slices/detections/detectionsSlice";
import { MAINURL } from "../../../../redux/api/axios";
import ConfirmationDialog from "../../../common/ConfirmationDialog";
import { connectWebSocket } from "../../../../redux/websocket";
import { fetchRooms } from "../../../../redux/slices/timetable/timetablesSlice";
import { enqueueSnackbar as EnSn } from "notistack";
import notIcon from "../../../../../src/assets/svg/not.svg";
import buildingIcon from "../../../../../src/assets/svg/building.svg";
import styles from "./StudentsList.module.css";

const StudentsList = () => {
  const dispatch = useDispatch();
  const { students, status, error } = useSelector((state) => state.students);
  const {
    detections,
    status: detectStatus,
    error: detectError,
  } = useSelector((state) => state.detections);
  const { rooms } = useSelector((state) => state.timetable);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [socket, setSocket] = useState(null);
  const [detectedUsers, setDetectedUsers] = useState(new Set());
  const [cameraToRoomMap, setCameraToRoomMap] = useState(new Map());
  const [userToCameraMap, setUserToCameraMap] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const translations = useSelector((state) => state.language.translations);
  const [animatedRoomNames, setAnimatedRoomNames] = useState({});
  const cameraToRoomMapRef = useRef(new Map());
  const now = new Date();

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchRooms());
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(fetchStudentsLastDetections());
  // }, []);

  useEffect(() => {
    dispatch(fetchTodayStudentsLastDetections());
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

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (detections && detections.length > 0) {
      detections.forEach((data) => {
        setDetectedUsers((prev) => new Set(prev.add(data.user)));

        setUserToCameraMap((prevMap) => {
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

  useEffect(() => {
    if (token) {
      const ws = connectWebSocket(token);
      setSocket(ws);

      ws.on("connect", () => {
        console.log("WebSocket connected");
      });

      ws.on("detect", (data) => {
        const detectionIndex = detections.findIndex(
          (detection) => detection.user === data.user
        );

        detections[detectionIndex].time = new Date();

        setDetectedUsers((prev) => new Set(prev.add(data.user)));

        setUserToCameraMap((prevMap) => {
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
      cameraToRoomMap.get(cameraId) ||
      translations.adminUnkownRoom?.detail ||
      "Unknown room";

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
      if (status === "succeeded") {
        handleCloseDialog();
        EnSn(translations.studentDeleted, { variant: "success" });
        setSubmitAttempted(false);
      } else if (status === "failed") {
        EnSn(error || "Someting went wrong", { variant: "error" });
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
              const cameraId = userToCameraMap[student.id] || student.camera_id;
              const roomName =
                animatedRoomNames[student.id] ||
                cameraToRoomMap.get(cameraId) ||
                translations.adminUnkownRoom;
              const isDetected = detectedUsers.has(student.id);

              const detection = detections.find(
                (detection) => detection.user === student.id
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
                  <td className={styles.role}>
                    <span>{animatedRoomNames["room1"] || roomName}</span>
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
