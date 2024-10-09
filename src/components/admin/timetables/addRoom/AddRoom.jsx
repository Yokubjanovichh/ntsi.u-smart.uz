import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "../../../common/Input";
import {
  createRoom,
  fetchRooms,
  deleteRoom, // Added deleteRoom action
} from "../../../../redux/slices/timetable/timetablesSlice";
import { enqueueSnackbar as EnSn } from "notistack";
import styles from "./AddRoom.module.css";

const AddRoom = () => {
  const dispatch = useDispatch();
  const { rooms = [], error, status } = useSelector((state) => state.timetable); // Added rooms in the state
  const [roomNumber, setRoomNumber] = useState("");
  const [cameraIp, setCameraIp] = useState("");
  const [cameraPassword, setCameraPassword] = useState("");
  const [cameraIps, setCameraIps] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const translations = useSelector((state) => state.language.translations);

  // Fetch rooms on component mount
  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const handleAddCameraIp = () => {
    if (roomNumber.trim() === "") {
      EnSn(translations.roomNameRequired, { variant: "error" });
      return;
    }

    if (cameraIp.length === 0) {
      EnSn(translations.atLeastOneCameraRequired, { variant: "error" });
      return;
    }

    if (cameraPassword.trim() === "") {
      EnSn(translations.cameraPassword, { variant: "error" });
      return;
    }

    const cameraData = { ip: cameraIp, password: cameraPassword };
    if (editingIndex !== null) {
      const updatedCameraIps = [...cameraIps];
      updatedCameraIps[editingIndex] = cameraData;
      setCameraIps(updatedCameraIps);
      setEditingIndex(null);
    } else {
      setCameraIps([...cameraIps, cameraData]);
    }

    // Clear IP and password inputs, but not roomNumber
    setCameraIp("");
    setCameraPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (roomNumber.trim() === "") {
      EnSn(translations.roomNameRequired, { variant: "error" });
      return;
    }

    if (cameraIps.length === 0) {
      EnSn(translations.atLeastOneCameraRequired, { variant: "error" });
      return;
    }

    const roomData = {
      name: roomNumber,
      cameras: cameraIps.map((camera) => ({
        ip: camera.ip,
        password: camera.password,
      })),
    };

    setSubmitAttempted(true);
    dispatch(createRoom(roomData));

    // Reset inputs after submission
    setRoomNumber("");
    setCameraIps([]);
  };

  // Handle deleting a room
  const handleDeleteRoom = (id) => {
    dispatch(deleteRoom(id));
  };

  useEffect(() => {
    if (submitAttempted) {
      if (status === "succeeded") {
        EnSn(translations.roomCreated, { variant: "success" });
        setSubmitAttempted(false);
      } else if (status === "failed") {
        EnSn(error.detail, { variant: "error" });
        setSubmitAttempted(false);
      }
    }
  }, [status, error, translations, submitAttempted]);

  const handleEditCameraIp = (index) => {
    setCameraIp(cameraIps[index].ip);
    setCameraPassword(cameraIps[index].password);
    setEditingIndex(index);
  };

  const handleDeleteCameraIp = (index) => {
    const updatedCameraIps = cameraIps.filter((_, i) => i !== index);
    setCameraIps(updatedCameraIps);
  };

  return (
    <form className={styles.addRoomWrapper} onSubmit={handleSubmit}>
      <div className={styles.addRoomInputs}>
        <TextInput
          text={translations.adminRoomName}
          value={roomNumber}
          setValue={setRoomNumber}
          width={292}
        />
        <TextInput
          text={translations.adminCameraIp}
          value={cameraIp}
          setValue={setCameraIp}
          width={292}
        />
        <TextInput
          text={translations.adminCameraPassword}
          value={cameraPassword}
          setValue={setCameraPassword}
          width={292}
        />
        <button type="button" onClick={handleAddCameraIp}>
          {editingIndex !== null ? "Update IP" : translations.adminAddCamera}
        </button>
      </div>

      <div className={styles.cameraIps}>
        {cameraIps.map((camera, index) => (
          <div key={index} className={styles.cameraItem}>
            <p>
              {camera.ip} ({translations.adminPassword}: {camera.password})
            </p>{" "}
            <div className={styles.cameraIpItem}>
              <button type="button" onClick={() => handleEditCameraIp(index)}>
                {translations.adminEdit}
              </button>
              <button type="button" onClick={() => handleDeleteCameraIp(index)}>
                {translations.adminDelete}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* List of existing rooms */}
      <div className={styles.existingRooms}>
        <h3 className={styles.title}>{translations.existingRooms}</h3>
        {status === "loading" && (
          <p className={styles.loading}>Loading rooms...</p>
        )}
        {status === "failed" && (
          <p className={styles.error}>Error: {error ? error.detail : error}</p>
        )}
        {status === "succeeded" && rooms.length > 0 && (
          <div className={styles.roomsContainer}>
            <ul className={styles.rooms}>
              {rooms.map((room) => (
                <li key={room.id} className={styles.room}>
                  <span>{room.name}</span>
                  <button onClick={() => handleDeleteRoom(room.id)}>
                    {translations.adminDelete}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={styles.addRoomBtns}>
        <button
          type="reset"
          onClick={() => {
            setRoomNumber("");
            setCameraIp("");
            setCameraPassword("");
            setCameraIps([]);
            setEditingIndex(null);
          }}
        >
          {translations.adminClean}
        </button>
        <button type="submit">{translations.adminCreateRoom}</button>
      </div>
    </form>
  );
};

export default AddRoom;
