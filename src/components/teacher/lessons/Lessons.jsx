import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSlotsByTeacher,
  fetchPairsByTeacher,
  fetchRooms,
} from "../../../redux/slices/timetable/timetablesSlice";
import { fetchPairLastDetections } from "../../../redux/slices/detections/detectionsSlice";
import { getMe } from "../../../redux/slices/auth/authSlice";
import { MAINURL } from "../../../redux/api/axios";
import { connectWebSocket } from "../../../redux/websocket";
import { DateInput, SelectOptions } from "../../common/Input";
import { FaCheck, FaXmark, FaBuildingCircleCheck } from "react-icons/fa6";
import styles from "./Lessons.module.css";

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const findClosestSlot = (data, chosenSlot) => {
  const now = new Date();
  const currentTime = now.toTimeString().split(" ")[0];

  if (chosenSlot) {
    const dataaa = data.filter((slot) => {
      return (
        slot.slot?.start_time === chosenSlot?.start_time &&
        slot.slot?.end_time === chosenSlot?.end_time
      );
    });
    return dataaa;
  } else {
    let closestSlot = null;
    let minDifference = Infinity;

    data.forEach((slot) => {
      const startTime = slot.slot?.start_time;
      const endTime = slot.slot?.end_time;

      if (currentTime >= startTime && currentTime <= endTime) {
        return [slot];
      }

      const startDiff = Math.abs(new Date(`1970-01-01T${startTime}Z`) - now);
      const endDiff = Math.abs(new Date(`1970-01-01T${endTime}Z`) - now);

      if (startDiff < minDifference || endDiff < minDifference) {
        minDifference = Math.min(startDiff, endDiff);
        closestSlot = slot;
      }
    });

    return closestSlot ? [closestSlot] : [];
  }
};

const Lessons = () => {
  const dispatch = useDispatch();
  const [slot, setSlot] = useState(null);
  const {
    detections,
    status: detectStatus,
    error: detectError,
  } = useSelector((state) => state.detections);
  const [choosenDay, setChoosenDay] = useState(getTodayDate());
  const [slots, setSlots] = useState("");
  const [filteredPairs, setFilteredPairs] = useState([]);
  const [socket, setSocket] = useState(null);
  const roomData = useSelector((state) => state.timetable.rooms) || [];
  const [userToCameraMap, setUserToCameraMap] = useState({});
  const [cameraDetectionMap, setCameraDetectionMap] = useState({});
  const translations = useSelector((state) => state.language.translations);
  const [animatedRoomNames, setAnimatedRoomNames] = useState({});
  const [cameraToRoomMap, setCameraToRoomMap] = useState(new Map());
  const [pairID, setPairID] = useState();
  const cameraToRoomMapRef = useRef(new Map());
  const now = new Date();

  useEffect(() => {
    dispatch(fetchRooms(""));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPairLastDetections(filteredPairs[0]?.id));
  }, [filteredPairs[0]]);

  console.log("roomData", roomData);

  roomData.forEach((room) => {
    room.cameras.forEach((camera) => {
      cameraToRoomMap[camera.id] = room.name;
    });
  });

  const slotsData =
    useSelector((state) => state.timetable.slotsByTeacher) || [];
  const pairsData =
    useSelector((state) => state.timetable.pairsByTeacher) || [];
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    dispatch(getMe());
  }

  useEffect(() => {
    dispatch(fetchSlotsByTeacher());
    dispatch(fetchPairsByTeacher(choosenDay));
  }, [dispatch, choosenDay]);

  useEffect(() => {
    setFilteredPairs(findClosestSlot(pairsData, slot));
  }, [pairsData, slot]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (detections && detections.length > 0) {
      detections.forEach((data) => {
        setCameraDetectionMap((prevMap) => ({
          ...prevMap,
          [data.camera]: true,
        }));

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
    if (user) {
      const ws = connectWebSocket(token);
      setSocket(ws);

      ws.on("connect", () => {
        console.log("WebSocket connected");
      });

      ws.on("detect", (data) => {
        setCameraDetectionMap((prevMap) => ({
          ...prevMap,
          [data.camera]: true,
        }));

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
  }, [user]);

  useEffect(() => {
    if (roomData.length > 0) {
      const newCameraToRoomMap = new Map();
      roomData.forEach((room) => {
        room.cameras.forEach((camera) => {
          newCameraToRoomMap.set(camera.id, room.name);
        });
      });
      cameraToRoomMapRef.current = newCameraToRoomMap;
    }
  }, [roomData]);

  const animateRoomName = (userId, cameraId) => {
    const cameraToRoomMap = cameraToRoomMapRef.current;

    if (!cameraToRoomMap || !cameraToRoomMap.has(cameraId)) {
      console.warn("cameraToRoomMap aniqlanmadi yoki cameraId topilmadi");
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

  const handleSubmitClick = (e) => {
    e.preventDefault();
    dispatch(fetchPairsByTeacher(choosenDay));
  };

  const lessonInfo = filteredPairs.length > 0 ? filteredPairs[0] : null;
  const slotInfo = lessonInfo ? lessonInfo.slot : {};
  const roomInfo = lessonInfo ? lessonInfo.room : {};
  const subjectInfo = lessonInfo ? lessonInfo.subject : {};
  const groupInfo = lessonInfo ? lessonInfo.groups[0] : {};
  let teacherName = "N/A";

  if (detectStatus === "loading") {
    return <p>Loading...</p>;
  }

  // if (detectError) {
  //   return <p>Error loading students: {detectError.detail[0].msg}</p>;
  // }

  if (user) {
    teacherName = `${user.first_name} ${user.last_name}`;
  }

  return (
    <section className={styles.lessonsContainer}>
      <form onSubmit={handleSubmitClick}>
        <div className={styles.slot}>
          <SelectOptions
            text={translations.teacherTodaySlot}
            values={slotsData.map((slot) => ({
              name: `${slot?.start_time} - ${slot?.end_time}`,
              id: slot.id,
            }))}
            value={slot}
            setValue={(value) => {
              setSlot(slotsData.find((s) => s.id === value));
              setSlots(value);
            }}
          />
        </div>

        <div className={styles.day}>
          <DateInput
            text={translations.teacherChooseDay}
            value={choosenDay}
            setValue={setChoosenDay}
          />
        </div>
        <button>{translations.teacherSubmit}</button>
      </form>
      <div className={styles.lessonInfo}>
        {lessonInfo ? (
          <>
            <ul>
              <li>
                {translations.teacherDate}: {choosenDay}
              </li>
              <li>
                {translations.teacherLessonTime}: {slotInfo?.start_time} -{" "}
                {slotInfo?.end_time}
              </li>
              <li>
                {translations.teacherRoom}: {roomInfo.name || "N/A"}
              </li>
            </ul>
            <ul>
              <li>
                {translations.teacherGroup}: {groupInfo?.name || "N/A"}
              </li>
              <li>
                {translations.teacherTeacher}: {teacherName}
              </li>
              <li>
                {translations.teacherSubject}: {subjectInfo?.name || "N/A"}
              </li>
            </ul>
          </>
        ) : (
          <div className={styles.noLessonMessage}>
            <p>{translations.teacherNoLessonThisDay}</p>
          </div>
        )}
      </div>

      {/* students table start */}
      <div className={styles.studentsTable}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr className={styles.tr}>
              <td className={styles.fullname}>
                <span>{translations.adminLastNameNameMiddleName}</span>
              </td>
              <td className={styles.role}>
                <span>{translations.teacherGroup}</span>
              </td>
              <td className={styles.phone}>
                <span>{translations.teacherPhoneNumber}</span>
              </td>
              <td className={styles.image}>
                <span>{translations.teacherImage}</span>
              </td>
              <td>
                <span>{translations.teacherAttendance}</span>
              </td>
              {/* <td className={styles.jshir}>
                <span>{translations.status}</span>
              </td> */}
              <td>
                <span>{translations.teacherLocation}</span>
              </td>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {groupInfo?.students && groupInfo.students.length > 0 ? (
              groupInfo.students.map((student) => {
                const cameraId =
                  userToCameraMap[student.id] || student.camera_id;
                const roomName =
                  animatedRoomNames[student.id] ||
                  cameraToRoomMap.get(cameraId) ||
                  translations.adminUnkownRoom;
                const cameraInRoom =
                  roomInfo.cameras &&
                  roomInfo.cameras.some((camera) => camera.id === cameraId);

                const isDetected = cameraId && cameraDetectionMap[cameraId];

                // const detection = detections.find(
                //   (detection) => detection.user === student.id
                // );
                // const detectionInterval = detection
                //   ? now - new Date(detection.time)
                //   : null;
                // let formattedTime = "Not detected";
                // if (detectionInterval !== null) {
                //   const totalMinutes = Math.floor(
                //     detectionInterval / (1000 * 60)
                //   );
                //   const minutes = totalMinutes % 60;
                //   const hours = Math.floor(totalMinutes / 60);
                //   if (totalMinutes > 15) {
                //     formattedTime = `${hours
                //       .toString()
                //       .padStart(2, "0")}:${minutes
                //       .toString()
                //       .padStart(2, "0")} oldin`;
                //   } else {
                //     formattedTime = "online";
                //   }
                // }
                return (
                  <tr className={styles.tr} key={student.id}>
                    <td className={styles.fullname}>
                      <span>{`${student.first_name} ${student.last_name}`}</span>
                    </td>
                    <td className={styles.role}>
                      <span>{groupInfo.name}</span>
                    </td>
                    <td className={styles.phone}>
                      <a href={`tel:${student.phone_number}`}>
                        {student.phone_number}
                      </a>
                    </td>
                    <td className={styles.image}>
                      <div>
                        <img
                          src={`${MAINURL}${student.image?.file_path}`}
                          alt="Student"
                        />
                      </div>
                    </td>
                    <td className={styles.attendance}>
                      <span
                        className={`${styles.icon} ${
                          !cameraId
                            ? styles["fa-xmark-icon"]
                            : cameraInRoom && isDetected
                            ? styles["fa-check-icon"]
                            : styles["fa-building-circle-check-icon"]
                        }`}
                      >
                        {!cameraId ? (
                          <FaXmark />
                        ) : cameraInRoom && isDetected ? (
                          <FaCheck />
                        ) : (
                          <FaBuildingCircleCheck />
                        )}
                      </span>
                      {/* <button
                        className={styles.info}
                        onClick={() => {
                          setEachStudent(student);
                          setShowModal(true);
                        }}
                      >
                        <IoInformationCircleOutline />
                      </button> */}
                    </td>
                    {/* <td>
                      <span
                        style={{
                          color: `${formattedTime === "online" ? "blue" : ""}`,
                        }}
                      >
                        {formattedTime}
                      </span>
                    </td> */}
                    <td className={styles.phone}>{roomName}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7">{translations.teacherNoStudent}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* students table end */}
    </section>
  );
};

export default Lessons;
