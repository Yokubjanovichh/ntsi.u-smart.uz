import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// Initial state
const initialState = {
  detections: [],
  cameras: [],
  users: [],
  status: null,
  error: null,
};
export const fetchTeachersLastDetections = createAsyncThunk(
  "detections/fetchTeachersLastDetections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/manager/detections/teachers/last/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch detections"
      );
    }
  }
);
export const fetchStudentsLastDetections = createAsyncThunk(
  "detections/fetchStudentsLastDetections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/manager/detections/students/last/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch detections"
      );
    }
  }
);
export const fetchTodayManagersLastDetections = createAsyncThunk(
  "detections/fetchTodayManagersLastDetections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/manager/detections/managers/last/today/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch detections"
      );
    }
  }
);
export const fetchTodayTeachersLastDetections = createAsyncThunk(
  "detections/fetchTodayTeachersLastDetections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/manager/detections/teachers/last/today/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch detections"
      );
    }
  }
);

export const fetchTodayStudentsLastDetections = createAsyncThunk(
  "detections/fetchTodayStudentsLastDetections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "/manager/detections/students/last/today/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch detections"
      );
    }
  }
);

export const fetchPairLastDetections = createAsyncThunk(
  "detections/fetchPairLastDetections",
  async (pair_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/teacher/detections/pair/last/`, {
        params: { pair_id }, // Передаем pair_id как параметр запроса
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch detections"
      );
    }
  }
);

const detectionsSlice = createSlice({
  name: "detections",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachersLastDetections.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTeachersLastDetections.fulfilled, (state, action) => {
        state.detections = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchTeachersLastDetections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchStudentsLastDetections.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStudentsLastDetections.fulfilled, (state, action) => {
        state.detections = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchStudentsLastDetections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchTodayManagersLastDetections.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodayManagersLastDetections.fulfilled, (state, action) => {
        state.detections = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchTodayManagersLastDetections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchTodayTeachersLastDetections.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodayTeachersLastDetections.fulfilled, (state, action) => {
        state.detections = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchTodayTeachersLastDetections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchTodayStudentsLastDetections.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodayStudentsLastDetections.fulfilled, (state, action) => {
        state.detections = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchTodayStudentsLastDetections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchPairLastDetections.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPairLastDetections.fulfilled, (state, action) => {
        state.detections = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchPairLastDetections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default detectionsSlice.reducer;
