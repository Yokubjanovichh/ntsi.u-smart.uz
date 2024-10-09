import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const initialState = {
  cameras: [],
  status: null,
  error: null,
};

// Async thunk to fetch all cameras
export const fetchCameras = createAsyncThunk(
  "cameras/fetchCameras",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      const response = await axios.get("/manager/camera/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
      });
      return response.data; // Make sure the API returns the correct data format
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch cameras"
      );
    }
  }
);

// Async thunk to add a new camera
export const addCamera = createAsyncThunk(
  "cameras/addCamera",
  async (data, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      const response = await axios.post("/manager/camera/", data, {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
      });
      return response.data; // This should return the newly added camera object
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add camera"
      );
    }
  }
);

// Async thunk to delete a camera by ID
// export const deleteCamera = createAsyncThunk(
//   "cameras/deleteCamera",a
//   async (cameraId, thunkAPI) => {
//     try {
//       const token = localStorage.getItem("token");
//       const token_type = localStorage.getItem("token_type") || "Bearer";
//       await axios.delete(`/manager/camera/${cameraId}/`, {
//         headers: {
//           Authorization: `${token_type} ${token}`,
//         },
//       });
//       return cameraId; // Return the ID to filter the deleted camera in the state
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data || "Failed to delete camera"
//       );
//     }
//   }
// );

export const deleteCamera = createAsyncThunk(
  "cameras/deleteCamera",
  async (cameraId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      await axios.delete("/manager/camera/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
        params: {
          id: cameraId, // Send the studentId as a query parameter
        },
        withCredentials: true,
      });

      return cameraId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete camera"
      );
    }
  }
);

// Async thunk to update a camera by ID
export const updateCamera = createAsyncThunk(
  "cameras/updateCamera",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      const response = await axios.put(`/manager/camera/${id}/`, updatedData, {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
      });
      return response.data; // Ensure this returns the updated camera object
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update camera"
      );
    }
  }
);

// Cameras slice definition
const camerasSlice = createSlice({
  name: "cameras",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch cameras cases
      .addCase(fetchCameras.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCameras.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cameras = action.payload; // Populate the state with fetched cameras
      })
      .addCase(fetchCameras.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add camera cases
      .addCase(addCamera.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCamera.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cameras.push(action.payload); // Add new camera to the state
      })
      .addCase(addCamera.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Update camera cases
      .addCase(updateCamera.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCamera.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.cameras.findIndex(
          (camera) => camera.id === action.payload.id
        );
        if (index !== -1) {
          state.cameras[index] = action.payload; // Update the camera in the state
        }
      })
      .addCase(updateCamera.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Delete camera cases
      .addCase(deleteCamera.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCamera.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cameras = state.cameras.filter(
          (camera) => camera.id !== action.payload // Remove the camera from the state
        );
      })
      .addCase(deleteCamera.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default camerasSlice.reducer;
