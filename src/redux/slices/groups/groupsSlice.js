import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const initialState = {
  groups: [],
  status: null,
  error: null,
};

export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      const response = await axios.get("/manager/groups/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch groups"
      );
    }
  }
);

// Async thunk to search for groups based on a query
export const searchGroups = createAsyncThunk(
  "groups/searchGroups",
  async (query, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      const response = await axios.get("/manager/groups/", {
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
        error.response?.data || "Failed to search groups"
      );
    }
  }
);

// Async thunk to fetch groups with a query parameter
export const fetchGroupWithQuery = createAsyncThunk(
  "groups/fetchGroupWithQuery",
  async (query, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      const response = await axios.get("/manager/groups/", {
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
        error.response?.data || "Failed to fetch groups with query"
      );
    }
  }
);

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async (groupData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      const response = await axios.post("/manager/groups/", groupData, {
        headers: {
          Authorization: `${token_type} ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create group"
      );
    }
  }
);

export const deleteGroup = createAsyncThunk(
  "groups/deleteGroup",
  async (groupId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      await axios.delete("/manager/groups/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
        params: {
          id: groupId, // Send the groupId as a query parameter
        },
      });

      return groupId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete group"
      );
    }
  }
);

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchGroups.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(searchGroups.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchGroups.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.groups = action.payload;
      })
      .addCase(searchGroups.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchGroupWithQuery.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGroupWithQuery.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.groups = action.payload;
      })
      .addCase(fetchGroupWithQuery.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(createGroup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.groups.push(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(deleteGroup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.groups = state.groups.filter(
          (group) => group.id !== action.payload
        );
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.detail;
      });
  },
});

export default groupsSlice.reducer;
