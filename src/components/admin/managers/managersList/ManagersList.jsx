import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar as EnSn } from "notistack";

import { MAINURL } from "../../../../redux/api/axios";
import { connectWebSocket } from "../../../../redux/websocket";
import {
  fetchManagers,
  deleteManager,
} from "../../../../redux/slices/managers/managersSlice";
import {
  fetchManagersLastDetections,
  fetchTodayManagersLastDetections,
} from "../../../../redux/slices/detections/detectionsSlice";
import { fetchCameras } from "../../../../redux/slices/cameras/camerasSlice";

import ConfirmationDialog from "../../../common/ConfirmationDialog";

import notIcon from "../../../../../src/assets/svg/not.svg";
import buildingIcon from "../../../../../src/assets/svg/building.svg";
import defaultImage from "../../../../assets/img/profile.png";

import styles from "./ManagersList.module.css";

const ManagersList = () => {
  const dispatch = useDispatch();
  const translations = useSelector((state) => state.language.translations);

  const useManagersData = () => {
    const dispatch = useDispatch();
    const managers = useSelector((state) => state.managers.managers);
    const status = useSelector((state) => state.managers.status);
    const error = useSelector((state) => state.managers.error);

    useEffect(() => {
      dispatch(fetchManagers());
    }, [dispatch]);

    return { managers, status, error };
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
      dispatch(fetchTodayManagersLastDetections());
    }, [dispatch]);

    return { detections, status, error };
  };

  const {
    managers,
    status: managersStatus,
    error: managersError,
  } = useManagersData();
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
  const [selectedManagerId, setSelectedManagerId] = useState(null);
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
      const updatedDetectedUsers = new Map(detectedUsers);
      detections.forEach((data) => {
        updatedDetectedUsers.set(data.user, {
          room: camerasMap.get(data.camera) || translations.adminUnkownRoom,
          time: new Date(data.time),
        });
      });
      setDetectedUsers(updatedDetectedUsers);
    }
  }, [detections, cameras, detectedUsers]);

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
    setSubmitAttempted(true); // Modal yopilmaydi, submit urinilishi amalga oshiriladi
    dispatch(deleteManager(selectedManagerId));
  }
};

useEffect(() => {
  if (submitAttempted) {
    if (managersStatus === "succeeded") {
      handleCloseDialog(); // Delete muvaffaqiyatli bo'lganda modalni yopish
      EnSn(translations.managerDeleted, { variant: "success" });
      setSubmitAttempted(false);
    } else if (managersStatus === "failed") {
      EnSn(managersError || "Something went wrong", { variant: "error" });
      setSubmitAttempted(false);
    }
  }
}, [managersStatus, managersError, translations, submitAttempted]);


  if (
    managersStatus === "loading" ||
    detectStatus === "loading" ||
    camerasStatus === "loading"
  ) {
    return <p>Loading...</p>;
  }

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
              const detection = detectedUsers.has(manager.id)
                ? detectedUsers.get(manager.id)
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
                  <td className={styles.role}>
                    <span>{detection.room}</span>
                  </td>
                  <td className={styles.role}>
                    <span>{formattedTime}</span>
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
