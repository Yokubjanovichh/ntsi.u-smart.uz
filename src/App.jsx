import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getMe } from "./redux/slices/auth/authSlice.js";

import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import NotFoundPage from "./pages/NotFoundPage";
import UnauthorizedPage from "./pages/Unauthorized";

import MyProfile from "./components/myprofile/MyProfile";

// Import Layouts
import AdminLayout from "./components/admin/AdminLayout";
import TeacherLayout from "./components/teacher/TeacherLayout";
import StudentLayout from "./components/student/StudentLayout";

// Import manager components in admin
import ManagersLayout from "./components/admin/managers/ManagersLayout";
import TeachersLayout from "./components/admin/teachers/TeachersLayout";
import StudentsLayout from "./components/admin/students/StudentsLayout";
import GroupsLayout from "./components/admin/groups/GroupsLayout";
import DepartmentsLayout from "./components/admin/departments/DepartmentsLayout";
import TimeTablesLayout from "./components/admin/timetables/TimeTablesLayout";
import AttendanceLayout from "./components/admin/attendance/AttendanceLayout";

import ManagersList from "./components/admin/managers/managersList/ManagersList";
import AddManager from "./components/admin/managers/addManager/AddManager";
import CreateRole from "./components/admin/managers/createRole/CreateRole";
import AdminHistory from "./components/admin/managers/adminHistory/AdminHistory";

import TeachersList from "./components/admin/teachers/teachersList/TeachersList";
import AddTeacher from "./components/admin/teachers/addTeacher/AddTeacher";

import StudentsList from "./components/admin/students/studentsList/StudentsList";
import AddStudent from "./components/admin/students/addStudent/AddStudent";

import GroupsList from "./components/admin/groups/groupsList/GroupsList";
import AddGroup from "./components/admin/groups/addGroup/AddGroup";

import DepartmentsList from "./components/admin/departments/departmentsList/DepartmentsList";
import AddDepartment from "./components/admin/departments/addDepartment/AddDepartment";

import TimeTable from "./components/admin/timetables/timeTable/TimeTable";
import AddTimeTable from "./components/admin/timetables/addTimeTable/AddTimeTable";
import AddSubject from "./components/admin/timetables/addSubject/AddSubject";
import AddRoom from "./components/admin/timetables/addRoom/AddRoom";
import Cameras from "./components/admin/timetables/cameras/Cameras.jsx";

// import teacher layout and component
import Lessons from "./components/teacher/lessons/Lessons";
import Students from "./components/teacher/students/Students";
import MyTimeTable from "./components/teacher/myTimeTable/MyTimeTable";

import ByStudents from "./components/admin/attendance/byStudents/ByStudents";
import ByEmployees from "./components/admin/attendance/byEmployees/ByEmployees";
import StatisticsByStudents from "./components/admin/attendance/statisticsByStudents/StatisticsByStudents";
import StatisticsByEmployees from "./components/admin/attendance/statisticsByEmployees/StatisticsByEmployees";

import ProtectedRoute from "./ProtectedRoute.jsx";

// import student layout and component
import StudentTimeTable from "./components/student/myTimeTable/MyTimeTable";
import StreamLayout from "./components/admin/stream/StreamLayout.jsx";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const routes = createBrowserRouter([
    {
      path: "/",
      errorElement: <NotFoundPage />,
      element: <HomePage />,
    },
    {
      path: "/unauthorized",
      element: <UnauthorizedPage />,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "admin",
          element: (
            <ProtectedRoute allowedRoles={["manager"]}>
              <AdminLayout />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "managers",
              element: (
                <ProtectedRoute allowedRoles={["manager"]}>
                  <ManagersLayout />
                </ProtectedRoute>
              ),
              children: [
                {
                  path: "managerslist",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <ManagersList />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "addmanager",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <AddManager />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "createrole",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <CreateRole />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "adminhistory",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <AdminHistory />
                    </ProtectedRoute>
                  ),
                },
              ],
            },
            {
              path: "teachers",
              element: (
                <ProtectedRoute allowedRoles={["manager"]}>
                  <TeachersLayout />
                </ProtectedRoute>
              ),
              children: [
                {
                  path: "teacherslist",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <TeachersList />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "addteacher",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <AddTeacher />
                    </ProtectedRoute>
                  ),
                },
              ],
            },
            {
              path: "students",
              element: (
                <ProtectedRoute allowedRoles={["manager"]}>
                  <StudentsLayout />
                </ProtectedRoute>
              ),
              children: [
                {
                  path: "studentslist",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <StudentsList />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "addstudent",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <AddStudent />
                    </ProtectedRoute>
                  ),
                },
              ],
            },
            {
              path: "groups",
              element: (
                <ProtectedRoute allowedRoles={["manager"]}>
                  <GroupsLayout />
                </ProtectedRoute>
              ),
              children: [
                {
                  path: "groupslist",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <GroupsList />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "addgroup",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <AddGroup />
                    </ProtectedRoute>
                  ),
                },
              ],
            },
            {
              path: "departments",
              element: (
                <ProtectedRoute allowedRoles={["manager"]}>
                  <DepartmentsLayout />
                </ProtectedRoute>
              ),
              children: [
                {
                  path: "departmentslist",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <DepartmentsList />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "adddepartment",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <AddDepartment />
                    </ProtectedRoute>
                  ),
                },
              ],
            },
            {
              path: "stream",
              element: (
                <ProtectedRoute allowedRoles={["manager"]}>
                  <StreamLayout />
                </ProtectedRoute>
              ),
            },
            {
              path: "timetables",
              element: (
                <ProtectedRoute allowedRoles={["manager"]}>
                  <TimeTablesLayout />
                </ProtectedRoute>
              ),
              children: [
                {
                  path: "timetable",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <TimeTable />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "addtimetable",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <AddTimeTable />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "addsubject",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <AddSubject />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "addroom",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <AddRoom />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "cameras",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <Cameras />
                    </ProtectedRoute>
                  ),
                },
              ],
            },
            {
              path: "attendance",
              element: (
                <ProtectedRoute allowedRoles={["manager"]}>
                  <AttendanceLayout />
                </ProtectedRoute>
              ),
              children: [
                {
                  path: "bystudents",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <ByStudents />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "byemployees",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <ByEmployees />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "statisticebystudents",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <StatisticsByStudents />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "statisticebyemployees",
                  element: (
                    <ProtectedRoute allowedRoles={["manager"]}>
                      <StatisticsByEmployees />
                    </ProtectedRoute>
                  ),
                },
              ],
            },
            {
              path: "myprofile",
              element: (
                <ProtectedRoute allowedRoles={["manager"]}>
                  <MyProfile />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          path: "teacher",
          element: (
            <ProtectedRoute allowedRoles={["teacher"]}>
              <TeacherLayout />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "lessons",
              element: (
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <Lessons />
                </ProtectedRoute>
              ),
            },
            {
              path: "students",
              element: (
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <Students />
                </ProtectedRoute>
              ),
            },
            {
              path: "mytimetable",
              element: (
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <MyTimeTable />
                </ProtectedRoute>
              ),
            },
            {
              path: "myprofile",
              element: (
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <MyProfile />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          path: "student",
          element: (
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentLayout />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "mytimetable",
              element: (
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentTimeTable />
                </ProtectedRoute>
              ),
            },
            {
              path: "myprofile",
              element: (
                <ProtectedRoute allowedRoles={["student"]}>
                  <MyProfile />
                </ProtectedRoute>
              ),
            },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
