import React, { useEffect, useState } from "react";
import {
  DateInput,
  SelectOptions,
  SearchInput,
  SelectOptionsMulti,
} from "../../../common/Input";
import { useDispatch, useSelector } from "react-redux";
import {
  searchSubjects,
  createSlot,
  fetchSlots,
  fetchRooms,
  createPair,
} from "../../../../redux/slices/timetable/timetablesSlice";
import { searchTeachers } from "../../../../redux/slices/teachers/teachersSlice";
import { searchGroups } from "../../../../redux/slices/groups/groupsSlice";
import { enqueueSnackbar as EnSn } from "notistack";
import styles from "./AddTimeTable.module.css";

const AddTimeTable = () => {
  const [date, setDate] = useState("");
  const [groupId, setGroupId] = useState([]);
  const [slots, setSlots] = useState("");
  const [teacher, setTeacher] = useState("");
  const [tillWhatDay, setTillWhatDay] = useState("");
  const [subjectsId, setSubjectsId] = useState(0);
  const [createSlotsStartTime, setCreateSlotsStartTime] = useState("");
  const [createSlotsEndTime, setCreateSlotsEndTime] = useState("");
  const [roomId, setRoomId] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const { status, error } = useSelector((state) => state.timetable);
  const translations = useSelector((state) => state.language.translations);

  // Error state variables
  const [showDateError, setShowDateError] = useState(false);
  const [showRoomError, setShowRoomError] = useState(false);
  const [showGroupError, setShowGroupError] = useState(false);
  const [showSlotsError, setShowSlotsError] = useState(false);
  const [showTeacherError, setShowTeacherError] = useState(false);
  const [showSubjectsError, setShowSubjectsError] = useState(false);
  const [showTillWhatDayError, setShowTillWhatDayError] = useState(false);

  const dispatch = useDispatch();
  const fetchedSubjects =
    useSelector((state) => state.timetable.subjects) || [];
  const fetchedTeachers = useSelector((state) => state.teachers.teachers) || [];
  const fetchedGroups = useSelector((state) => state.groups.groups) || [];
  const roomData = useSelector((state) => state.timetable.rooms) || [];
  const slotsData = useSelector((state) => state.timetable.slots) || [];

  useEffect(() => {
    dispatch(searchSubjects(""));
    dispatch(searchTeachers(""));
    dispatch(searchGroups(""));
    dispatch(fetchSlots());
    dispatch(fetchRooms(""));
  }, [dispatch]);

  const subjects = fetchedSubjects || [];
  const teachers = fetchedTeachers || [];
  const groups = fetchedGroups || [];

  const validateForm = () => {
    const isDateValid = date !== "";
    const isRoomValid = roomId !== "";
    const isGroupValid = groupId.length > 0;
    const isSlotsValid = slots !== "";
    const isTeacherValid = teacher !== "";
    const isSubjectsValid = subjectsId !== 0;
    const isTillWhatDayValid = tillWhatDay !== "";

    setShowDateError(!isDateValid);
    setShowRoomError(!isRoomValid);
    setShowGroupError(!isGroupValid);
    setShowSlotsError(!isSlotsValid);
    setShowTeacherError(!isTeacherValid);
    setShowSubjectsError(!isSubjectsValid);
    setShowTillWhatDayError(!isTillWhatDayValid);

    return (
      isDateValid &&
      isRoomValid &&
      isGroupValid &&
      isSlotsValid &&
      isTeacherValid &&
      isSubjectsValid &&
      isTillWhatDayValid
    );
  };

  const handleCreateTimetable = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const pairData = {
        room_id: roomId,
        slot_id: slots,
        teacher_id: teacher,
        subject_id: subjectsId,
        groups: groupId,
        start_date: date,
        end_date: tillWhatDay,
      };

      setSubmitAttempted(true);
      dispatch(createPair(pairData));
    }
  };

  useEffect(() => {
    if (submitAttempted) {
      if (status === "succeeded") {
        EnSn(translations.timeTableCreated, { variant: "success" });
        handleReset();
        setSubmitAttempted(false);
      } else if (status === "failed") {
        EnSn(error, { variant: "error" });
        setSubmitAttempted(false);
      }
    }
  }, [status, error, translations, submitAttempted]);

  const handleCreateSlot = (e) => {
    e.preventDefault();

    if (createSlotsStartTime !== "" && createSlotsEndTime !== "") {
      const slotData = {
        start_time: createSlotsStartTime,
        end_time: createSlotsEndTime,
      };
      dispatch(createSlot(slotData))
        .then(() => {
          dispatch(fetchSlots());
          EnSn(translations.slotsCreated, { variant: "success" });
          handleClearSlot();
        })
        .catch((error) => {
          EnSn("xato", { variant: "error" });
        });
    } else {
      EnSn(translations.slotsEmpty, { variant: "error" });
    }
  };

  const handleClearSlot = () => {
    setCreateSlotsStartTime("");
    setCreateSlotsEndTime("");
  };

  const handleDeleteSlot = (slotId) => {
    dispatch(deleteSlot(slotId));
  };

  const handleReset = () => {
    // Reset all input values
    setDate("");
    setGroupId([]);
    setSlots("");
    setTeacher("");
    setTillWhatDay("");
    setSubjectsId(0);
    setCreateSlotsStartTime("");
    setCreateSlotsEndTime("");
    setRoomId(null);

    // Reset all error states
    setShowDateError(false);
    setShowRoomError(false);
    setShowGroupError(false);
    setShowSlotsError(false);
    setShowTeacherError(false);
    setShowSubjectsError(false);
    setShowTillWhatDayError(false);
  };

  return (
    <div className={styles.mainTimeTable}>
      <form
        className={styles.addTimeTableWrapper}
        onSubmit={handleCreateTimetable}
      >
        <div className={styles.addTimeTableLeft}>
          <DateInput
            text={translations.adminStartDate}
            value={date}
            setValue={(value) => {
              setDate(value);
              if (value) setShowDateError(false);
            }}
            width={360}
            height={68}
            showError={showDateError}
            errorText="Please enter a start date"
          />

          <SelectOptions
            text={translations.adminWriteRoomName}
            values={roomData.map((room) => ({
              name: room.name,
              id: room.id,
            }))}
            value={roomId}
            setValue={(value) => {
              setRoomId(value);
              if (value.length > 0) setShowRoomError(false);
            }}
            width={360}
            height={68}
            multiple
            showError={showRoomError}
            errorText="Please enter a group name"
          />

          <SelectOptionsMulti
            text={translations.adminMultiGroups}
            values={groups.map((group) => ({
              name: group.name,
              id: group.id,
            }))}
            value={groupId}
            setValue={(value) => {
              setGroupId(value);
              if (value.length > 0) setShowGroupError(false);
            }}
            width={360}
            height={68}
            multiple
            showError={showGroupError}
            errorText="Please select at least one group"
          />

          <SelectOptions
            text={translations.adminSlots}
            values={slotsData.map((slot) => ({
              name: `${slot.start_time} - ${slot.end_time}`,
              id: slot.id,
            }))}
            value={slots}
            setValue={(value) => {
              setSlots(value);
              if (value) setShowSlotsError(false);
            }}
            isDelete={true}
            isDeleteFunction={handleDeleteSlot}
            width={360}
            height={68}
            showError={showSlotsError}
            errorText="Please select a slot"
          />

          <SelectOptions
            text={translations.adminTeacher}
            values={teachers.map((teacher) => ({
              name: `${teacher.first_name} ${teacher.last_name}`,
              id: teacher.id,
            }))}
            value={teacher}
            setValue={(value) => {
              setTeacher(value);
              if (value) setShowTeacherError(false);
            }}
            width={360}
            height={68}
            showError={showTeacherError}
            errorText="Please select a teacher"
          />
        </div>
        <div className={styles.addTimeTableRight}>
          <DateInput
            text={translations.adminEndDate}
            value={tillWhatDay}
            setValue={(value) => {
              setTillWhatDay(value);
              if (value) setShowTillWhatDayError(false);
            }}
            width={360}
            height={68}
            showError={showTillWhatDayError}
            errorText="Please enter an end date"
          />

          <SelectOptions
            text={translations.adminSubjects}
            values={subjects.map((subject) => ({
              name: subject.name,
              id: subject.id,
            }))}
            value={subjectsId}
            setValue={(value) => {
              setSubjectsId(value);
              if (value) setShowSubjectsError(false);
            }}
            width={360}
            height={68}
            showError={showSubjectsError}
            errorText="Please select a subject"
          />
          <div className={styles.createSlots}>
            <div className={styles.createSlotsbtn}>
              <p>{translations.adminCreateSlots}</p>
              <div>
                <button type="reset" onClick={() => handleClearSlot()}>
                  {translations.adminClean}
                </button>
                <button onClick={handleCreateSlot}>
                  {translations.adminCreate}
                </button>
              </div>
            </div>
            <div className={styles.createSlotsTime}>
              <div className={styles.createSlotsStartTime}>
                <p>{translations.adminStartTime}</p>
                <input
                  type="time"
                  value={createSlotsStartTime}
                  onChange={(e) => setCreateSlotsStartTime(e.target.value)}
                />
                <div className={styles.createSlotsTimeDetails}>
                  <p>{translations.adminHour}</p>
                  <p>{translations.adminMin}</p>
                </div>
              </div>
              <div className={styles.createSlotsStartTime}>
                <p>{translations.adminEndTime}</p>
                <input
                  type="time"
                  value={createSlotsEndTime}
                  onChange={(e) => setCreateSlotsEndTime(e.target.value)}
                />
                <div className={styles.createSlotsTimeDetails}>
                  <p>{translations.adminHour}</p>
                  <p>{translations.adminMin}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.addTimeTableBtns}>
          <button type="reset" onClick={() => handleReset()}>
            {translations.adminClean}
          </button>
          <button type="submit">{translations.adminCreatePair}</button>
        </div>
      </form>
    </div>
  );
};

export default AddTimeTable;
