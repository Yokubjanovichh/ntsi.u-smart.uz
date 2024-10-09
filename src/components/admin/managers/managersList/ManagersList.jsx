import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchManagers,
  deleteManager,
} from "../../../../redux/slices/managers/managersSlice";
import { MAINURL } from "../../../../redux/api/axios";
import ConfirmationDialog from "../../../common/ConfirmationDialog";
import { fetchRooms } from "../../../../redux/slices/timetable/timetablesSlice";
import {
  fetchTodayManagersLastDetections,
  fetchManagersLastDetections,
} from "../../../../redux/slices/detections/detectionsSlice";
import { connectWebSocket } from "../../../../redux/websocket";
import { enqueueSnackbar as EnSn } from "notistack";
import notIcon from "../../../../../src/assets/svg/not.svg";
import buildingIcon from "../../../../../src/assets/svg/building.svg";
import defaultImage from "../../../../assets/img/profile.png";
import styles from "./ManagersList.module.css";

const ManagersList = () => {
  const dispatch = useDispatch();
  const { managers, status, error } = useSelector((state) => state.managers);
  const {
    detections,
    status: detecStatus,
    error: detecError,
  } = useSelector((state) => state.detections);
  const { rooms } = useSelector((state) => state.timetable);
  const [selectedManagerId, setSelectedManagerId] = useState(null);
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
    dispatch(fetchManagers());
    dispatch(fetchRooms());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTodayManagersLastDetections());
  }, []);

  // useEffect(() => {
  //   dispatch(fetchManagersLastDetections());
  // }, []);

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

  const handleDeleteClick = (managerId) => {
    setSelectedManagerId(managerId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedManagerId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedManagerId) {
      setSubmitAttempted(true);
      dispatch(deleteManager(selectedManagerId));
    }
  };

  useEffect(() => {
    if (submitAttempted) {
      if (status === "succeeded") {
        handleCloseDialog();
        EnSn(translations.managerDeleted, { variant: "success" });
        setSubmitAttempted(false);
      } else if (status === "failed") {
        EnSn(error, { variant: "error" });
        setSubmitAttempted(false);
      }
    }
  }, [status, error, translations, submitAttempted]);

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
      ws.on("error", (error) => {
        console.log(error);
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

  if (status === "loading" || detecStatus === "loading") {
    return <p>Loading...</p>;
  }

  // if (error || detecError) {
  //   return <p>Error loading managers: {error || detecError}</p>;
  // }

  return (
    <>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            <td className={styles.fullname}>
              <span>
                {translations.adminLastNameNameMiddleName ||
                  "No translation available"}
              </span>
            </td>
            <td className={styles.role}>
              <span>{translations.adminRole}</span>
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
            <td className={styles.status}>
              <span>{translations.adminLocation}</span>
            </td>
            <td className={styles.status}>
              <span>{translations.status}</span>
            </td>
            <td className={styles.action}>
              <span>{translations.adminAction}</span>
            </td>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {managers.length > 0 ? (
            managers?.map((manager, index) => {
              const cameraId = userToCameraMap[manager.id] || manager.camera_id;
              const roomName =
                animatedRoomNames[manager.id] ||
                cameraToRoomMap.get(cameraId) ||
                translations.adminUnkownRoom;

              const isDetected = detectedUsers.has(manager.id);

              const detection = detections.find(
                (detection) => detection.user === manager.id
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
                    <span>{`${manager.last_name} ${manager.first_name}${
                      manager.middle_name && manager.middle_name !== "null"
                        ? ` ${manager.middle_name}`
                        : ""
                    }`}</span>
                  </td>
                  <td className={styles.role}>
                    <span>{manager.role?.name || "N/A"}</span>
                  </td>
                  <td className={styles.phone}>
                    <a href={`tel:${manager.phone_number}`}>
                      {manager.phone_number}
                    </a>
                  </td>
                  <td className={styles.image}>
                    <div>
                      <img
                        src={
                          manager.image && manager.image.file_path
                            ? `${MAINURL}${manager.image.file_path}`
                            : defaultImage
                        }
                        alt={`${manager.first_name || "Manager"}'s image`}
                      />
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
                  <td className={styles.role}>
                    <span>{animatedRoomNames["room1"] || roomName}</span>
                  </td>
                  <td className={styles.role}>
                    <span
                      style={{
                        color: `${formattedTime === "online" ? "blue" : ""}`,
                      }}
                    >
                      {formattedTime}
                    </span>
                  </td>
                  <td className={styles.action}>
                    <button
                      className={styles.delete}
                      onClick={() => handleDeleteClick(manager.id)}
                    >
                      {translations.adminDelete}
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8">No managers found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {openDialog && (
        <ConfirmationDialog
          open={openDialog}
          handleClose={handleCloseDialog}
          handleConfirm={handleConfirmDelete}
          managerName={
            managers.find((m) => m.id === selectedManagerId)?.first_name
          }
        />
      )}
    </>
  );
};

export default ManagersList;
