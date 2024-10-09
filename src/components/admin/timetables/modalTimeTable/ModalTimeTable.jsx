import React, { useRef, useState } from "react";
import { DateInput, SelectOptions } from "../../../common/Input";
import styles from "./ModalTimeTable.module.css";
import { AiOutlineCloseCircle } from "react-icons/ai";

export default function ModalTimeTable({ isOpen, onClose, children }) {
  const [date, setDate] = useState("");
  const [group, setGroup] = useState("");
  const [teacher, setTeacher] = useState("");
  const [subject, setSubject] = useState("");
  const [slots, setSlots] = useState("");
  const [roomNum, setRoomNum] = useState("");

  const modalRef = useRef();

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOutsideClick}>
      <div className={styles.modalContent} ref={modalRef}>
        <button className={styles.modalClose} onClick={onClose}>
          <AiOutlineCloseCircle className={styles.closeIcon} />
        </button>
        <div className={styles.modalWrapper}>
          <h1>Edit this slot</h1>
          <div className={styles.modalInputs}>
            <div className={styles.modalInputTypes}>
              <DateInput
                text={"Lesson date"}
                value={date}
                setValue={setDate}
                width={350}
                height={50}
                bgColor={"#0000000D"}
              />
              <SelectOptions
                text={"Group"}
                values={[1, 2, 3, 4, 5]}
                value={group}
                setValue={setGroup}
                width={350}
                height={50}
                bgColor={"#0000000D"}
              />
              <SelectOptions
                text={"Teacher"}
                values={[
                  "Teacher1",
                  "Teacher2",
                  "Teacher3",
                  "Teacher4",
                  "Teacher5",
                ]}
                value={teacher}
                setValue={setTeacher}
                width={350}
                height={50}
                bgColor={"#0000000D"}
              />
              <SelectOptions
                text={"Subject"}
                values={["Subject1", "Subject2", "Subject3"]}
                value={subject}
                setValue={setSubject}
                width={350}
                height={50}
                bgColor={"#0000000D"}
              />
              <SelectOptions
                text={"Slots"}
                values={["Slots1", "Slots2", "Slots3", "Slots4", "Slots5"]}
                value={slots}
                setValue={setSlots}
                width={350}
                height={50}
                bgColor={"#0000000D"}
              />
            </div>
            <SelectOptions
              text={"Room number"}
              values={[1234, 2345, 3456, 4567, 5678]}
              value={roomNum}
              setValue={setRoomNum}
              width={360}
              height={50}
              bgColor={"#0000000D"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
