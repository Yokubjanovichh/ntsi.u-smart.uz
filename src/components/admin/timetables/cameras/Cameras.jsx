import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCameras,
  updateCamera,
  deleteCamera,
} from "../../../../redux/slices/cameras/camerasSlice";
// import { TextInput } from "../../../common/Input";
import styles from "./Cameras.module.css";

const Cameras = () => {
  const dispatch = useDispatch();

  // Handle undefined state by providing default values
  const {
    cameras = [],
    error = null,
    status = "idle",
  } = useSelector((state) => state.cameras || {});

  useEffect(() => {
    dispatch(fetchCameras()); // Fetch cameras on component mount
  }, [dispatch]);

  // const handleUpdateCamera = (id) => {
  //   const updatedData = { cameraIp, cameraPassword, roomNumber };
  //   dispatch(updateCamera({ id, updatedData }));
  // };

  const handleDeleteCamera = (id) => {
    console.log(id);
    dispatch(deleteCamera(id));
  };

  return (
    <div className={styles.container}>
      {status === "loading" && (
        <p className={styles.loading}>Loading cameras...</p>
      )}
      {status === "failed" && (
        <p className={styles.error}>
          Error:{" "}
          {typeof error === "object" && error.detail ? error.detail : error}
        </p>
      )}
      {status === "succeeded" && (
        <ul className={styles.cameras}>
          {cameras.map((camera) => (
            <li key={camera.id} className={styles.camera}>
              <span>{camera.room.name}</span>
              <span>{camera.ip}</span>
              <button onClick={() => handleDeleteCamera(camera.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cameras;
