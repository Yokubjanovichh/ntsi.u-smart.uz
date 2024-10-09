import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const initialState = {
  departments: [],
  status: null,
  error: null,
};

// Fetch departments
export const fetchDepartments = createAsyncThunk(
  "departments/fetchDepartments",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      const response = await axios.get("/manager/departments/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch departments"
      );
    }
  }
);

// Create a new department
export const addDepartment = createAsyncThunk(
  "departments/addDepartment",
  async (data, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      const response = await axios.post(
        "/manager/departments/",
        {
          manager_id: data.managerId,
          name: data.name,
        },
        {
          headers: {
            Authorization: `${token_type} ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create department"
      );
    }
  }
);

// Delete a department
export const deleteDepartment = createAsyncThunk(
  "departments/deleteDepartment",
  async (id, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      await axios.delete("/manager/departments/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
        params: {
          id: id, // Send the department id as a query parameter
        },
      });

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete department"
      );
    }
  }
);

// Create the slice
const departmentsSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addDepartment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.departments.push(action.payload);
      })
      .addCase(addDepartment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteDepartment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.departments = state.departments.filter(
          (department) => department.id !== action.payload
        );
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.detail;
      });
  },
});

export default departmentsSlice.reducer;
