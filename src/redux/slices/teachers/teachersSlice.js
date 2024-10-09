import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const initialState = {
  teachers: [],
  status: null,
  error: null,
};

// Async thunk to fetch teachers from the API
export const fetchTeachers = createAsyncThunk(
  "teachers/fetchTeachers",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      const response = await axios.get("/manager/teachers/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch teachers"
      );
    }
  }
);

// Async thunk to search for teachers based on a query
export const searchTeachers = createAsyncThunk(
  "teachers/searchTeachers",
  async (query, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      const response = await axios.get("/manager/teachers/", {
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
        error.response?.data || "Failed to search teachers"
      );
    }
  }
);

// Async thunk to create a new teacher
export const addTeacher = createAsyncThunk(
  "teachers/addTeacher",
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
      formData.append("specialization", data.specialization);
      formData.append("upload_image", data.image);
      formData.append("department_id", data.departmentId);

      const response = await axios.post("/manager/teachers/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token_type} ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add teacher"
      );
    }
  }
);

// Async thunk to delete a teacher by ID
export const deleteTeacher = createAsyncThunk(
  "teachers/deleteTeacher",
  async (teacherId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      await axios.delete("/manager/teachers/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
        params: {
          id: teacherId,
        },
      });

      return teacherId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete teacher"
      );
    }
  }
);

// Teachers slice definition
const teachersSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    // Add reducers for other actions if necessary
  },
  extraReducers: (builder) => {
    builder
      // Fetch teachers cases
      .addCase(fetchTeachers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Search teachers cases
      .addCase(searchTeachers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchTeachers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teachers = action.payload; // Replace teachers with search results
      })
      .addCase(searchTeachers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add teacher cases
      .addCase(addTeacher.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addTeacher.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teachers.push(action.payload);
      })
      .addCase(addTeacher.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.detail;
      })

      // Delete teacher cases
      .addCase(deleteTeacher.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teachers = state.teachers.filter(
          (teacher) => teacher.id !== action.payload
        );
      })
      .addCase(deleteTeacher.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default teachersSlice.reducer;
