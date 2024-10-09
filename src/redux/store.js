import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth/authSlice";
import managersSlice from "./slices/managers/managersSlice";
import rolesSlice from "./slices/roles/rolesSlice";
import studentsSlice from "./slices/students/studentsSlice";
import teachersSlice from "./slices/teachers/teachersSlice";
import groupsSlice from "./slices/groups/groupsSlice";
import departmentsSlice from "./slices/departments/departmentsSlice";
import timetablesSlice from "./slices/timetable/timetablesSlice";
import camerasReducer from "./slices/cameras/camerasSlice";
import languageSlice from "./slices/language/languageSlice";
import detectionsSlice from "./slices/detections/detectionsSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    managers: managersSlice,
    roles: rolesSlice,
    students: studentsSlice,
    teachers: teachersSlice,
    groups: groupsSlice,
    departments: departmentsSlice,
    timetable: timetablesSlice,
    cameras: camerasReducer,
    language: languageSlice,
    detections: detectionsSlice,
  },
});
