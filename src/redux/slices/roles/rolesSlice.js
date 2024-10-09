import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const initialState = {
  roles: [],
  resources: [],
  selectedRole: null, // Store the specific role data
  status: null,
  error: null,
};

// Fetch all roles
export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/manager/roles/");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch roles"
      );
    }
  }
);

// Fetch all resources
export const fetchResources = createAsyncThunk(
  "roles/fetchResources",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/manager/resources/");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch resources"
      );
    }
  }
);

// Create a new role
export const createRole = createAsyncThunk(
  "roles/createRole",
  async (roleData, thunkAPI) => {
    try {
      const response = await axios.post("/manager/roles/", roleData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create role"
      );
    }
  }
);

// Fetch a specific role by ID
export const fetchRoleById = createAsyncThunk(
  "roles/fetchRoleById",
  async (roleId, thunkAPI) => {
    try {
      const response = await axios.get(`/manager/roles/?id=${roleId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch role by ID"
      );
    }
  }
);

// Delete a specific role by ID
export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (roleId, thunkAPI) => {
    try {
      await axios.delete(`/manager/roles/?id=${roleId}`);
      return roleId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete role"
      );
    }
  }
);

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchResources.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.resources = action.payload;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createRole.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.roles.push(action.payload);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchRoleById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedRole = action.payload;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.detail;
      })
      .addCase(deleteRole.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.roles = state.roles.filter((role) => role.id !== action.payload);
        state.selectedRole = null;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default rolesSlice.reducer;
