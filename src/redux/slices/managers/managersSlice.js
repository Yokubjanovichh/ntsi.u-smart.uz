import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const initialState = {
  managers: [],
  status: null,
  error: null,
};

// Async thunk to fetch all managers
export const fetchManagers = createAsyncThunk(
  "managers/fetchManagers",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      const response = await axios.get("/manager/managers/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch managers"
      );
    }
  }
);

// Async thunk to search for managers based on a query
export const searchManagers = createAsyncThunk(
  "managers/searchManagers",
  async (query, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      const response = await axios.get("/manager/managers/", {
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
        error.response?.data || "Failed to search managers"
      );
    }
  }
);

// Async thunk to add a new manager
export const addManagers = createAsyncThunk(
  "managers/addManagers",
  async (data, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      if (data.middleName === "") {
        data.middleName = null;
      }
      const formData = new FormData();
      formData.append("role_id", data.role);
      formData.append("pini", data.jshir);
      formData.append("first_name", data.firstName);
      formData.append("last_name", data.lastName);
      formData.append("middle_name", data.middleName);
      formData.append("birth_date", data.birthDate);
      formData.append("phone_number", `+998${data.phoneNumber}`);
      formData.append("address", data.address);
      formData.append("password", data.password);
      formData.append("upload_image", data.image);

      const response = await axios.post("/manager/managers/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token_type} ${token}`,
        },
      });

      return response.data;
      console.log(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add manager"
      );
    }
  }
);

// Async thunk to delete a manager by ID
export const deleteManager = createAsyncThunk(
  "managers/deleteManager",
  async (managerId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      await axios.delete("/manager/managers/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
        params: {
          id: managerId, // Send the managerId as a query parameter
        },
      });

      return managerId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete manager"
      );
    }
  }
);

// Managers slice definition
const managersSlice = createSlice({
  name: "managers",
  initialState,
  reducers: {
    // Add reducers for other actions if necessary
  },
  extraReducers: (builder) => {
    builder
      // Fetch managers cases
      .addCase(fetchManagers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchManagers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.managers = action.payload;
      })
      .addCase(fetchManagers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Search managers cases
      .addCase(searchManagers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchManagers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.managers = action.payload; // Replace managers with search results
      })
      .addCase(searchManagers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add managers cases
      .addCase(addManagers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addManagers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.managers.push(action.payload);
      })
      .addCase(addManagers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.detail;
      })

      // Delete manager cases
      .addCase(deleteManager.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteManager.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.managers = state.managers.filter(
          (manager) => manager.id !== action.payload
        );
      })
      .addCase(deleteManager.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default managersSlice.reducer;
