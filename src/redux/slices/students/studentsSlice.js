import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const initialState = {
  students: [],
  studentsForTeacher: [],
  status: null,
  error: null,
};

export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      const response = await axios.get("/manager/students/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch students"
      );
    }
  }
);

export const fetchStudentsByTeacher = createAsyncThunk(
  "students/fetchStudentsByTeacher",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      const response = await axios.get("teacher/students/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch students"
      );
    }
  }
);

// Async thunk to search for students based on a query
export const searchStudents = createAsyncThunk(
  "students/searchStudents",
  async (query, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      const response = await axios.get("/manager/students/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
        params: {
          query: query,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to search students"
      );
    }
  }
);

// Async thunk to create a new student
export const addStudent = createAsyncThunk(
  "students/addStudent",
  async (data, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      if (data.middleName === "") {
        data.middleName = null;
      }
      const formData = new FormData();
      formData.append("pini", data.jshir);
      formData.append("first_name", data.firstName);
      formData.append("last_name", data.lastName);
      formData.append("middle_name", data.middleName);
      formData.append("birth_date", data.birthDate);
      formData.append("phone_number", `+998${data.phoneNumber}`);
      formData.append("address", data.address);
      formData.append("password", data.password);
      formData.append("upload_image", data.image);
      formData.append("group_id", data.groupId);

      const response = await axios.post("/manager/students/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token_type} ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add student"
      );
    }
  }
);

// Async thunk to delete a student by ID
export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (studentId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      await axios.delete("/manager/students/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
        params: {
          id: studentId, // Send the studentId as a query parameter
        },
      });

      return studentId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete student"
      );
    }
  }
);

// Students slice definition
const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    // Add reducers for other actions if necessary
  },
  extraReducers: (builder) => {
    builder
      // Fetch students cases
      .addCase(fetchStudents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch students cases
      .addCase(fetchStudentsByTeacher.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStudentsByTeacher.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.studentsForTeacher = action.payload;
      })
      .addCase(fetchStudentsByTeacher.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Search students cases
      .addCase(searchStudents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.students = action.payload; // Replace students with search results
      })
      .addCase(searchStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add student cases
      .addCase(addStudent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.students.push(action.payload);
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.detail;
      })

      // Delete student cases
      .addCase(deleteStudent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.students = state.students.filter(
          (student) => student.id !== action.payload
        );
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default studentsSlice.reducer;
