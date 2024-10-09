import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// Initial state
const initialState = {
  rooms: [],
  subjects: [],
  slots: [],
  slotsByTeacher: [],
  pairsByTeacher: [],
  timetable: [],
  status: null,
  error: null,
};

// Async thunk for creating a room
export const createRoom = createAsyncThunk(
  "rooms/createRoom",
  async (roomData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      const response = await axios.post("/manager/rooms/", roomData, {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create room"
      );
    }
  }
);

// Async thunk for fetching rooms with a query parameter
export const fetchRooms = createAsyncThunk(
  "rooms/fetchRooms",
  async (query, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      const response = await axios.get("/manager/rooms/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
        params: { query },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch rooms"
      );
    }
  }
);

// Async thunk for deleting a room
export const deleteRoom = createAsyncThunk(
  "rooms/deleteRoom",
  async (roomId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      await axios.delete("/manager/rooms/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
        params: { id: roomId }, // Pass the room id as a query parameter
      });
      return roomId; // Return the id to identify the room that was deleted
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete room"
      );
    }
  }
);

// Async thunk for searching subjects
export const searchSubjects = createAsyncThunk(
  "subjects/searchSubjects",
  async (query, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      const response = await axios.get(`/manager/subjects/?query=${query}`, {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to search subjects"
      );
    }
  }
);

// Async thunk for creating a subject
export const createSubject = createAsyncThunk(
  "subjects/createSubject",
  async (subjectData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      const response = await axios.post("/manager/subjects/", subjectData, {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create subject"
      );
    }
  }
);

// Async thunk for deleting a subject
export const deleteSubject = createAsyncThunk(
  "subjects/deleteSubject",
  async (subjectId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      await axios.delete(`/manager/subjects/`, {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
        params: { id: subjectId },
      });
      return subjectId; // Return the id to identify the subject that was deleted
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete subject"
      );
    }
  }
);

// Async thunk for creating a slot
export const createSlot = createAsyncThunk(
  "slots/createSlot",
  async (slotData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      const response = await axios.post("/manager/slots/", slotData, {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create slot"
      );
    }
  }
);

// Async thunk for deleting a slot
export const deleteSlot = createAsyncThunk(
  "slots/deleteSlot",
  async (slotId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      await axios.delete(`/manager/slots/`, {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
        params: { id: slotId },
      });
      return slotId; // Return the id to identify the slot that was deleted
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to delete slot"
      );
    }
  }
);

// Async thunk for fetching slots
export const fetchSlots = createAsyncThunk(
  "slots/fetchSlots",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      const response = await axios.get("/manager/slots/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch slots"
      );
    }
  }
);
export const fetchSlotsByTeacher = createAsyncThunk(
  "slots/fetchSlotsByTeacher",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      const response = await axios.get("/teacher/slots/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch slots"
      );
    }
  }
);

export const fetchPairsByTeacher = createAsyncThunk(
  "pairs/fetchPairsByTeacher",
  async (date, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      const response = await axios.get("/teacher/pairs/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
        params: { date },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch pairs"
      );
    }
  }
);

export const fetchPairsByStudent = createAsyncThunk(
  "pairs/fetchPairsByStudent",
  async (date, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      const response = await axios.get("/student/pairs/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
        params: { date },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch pairs"
      );
    }
  }
);

// Async thunk for creating a pair (timetable)
export const createPair = createAsyncThunk(
  "pairs/createPair",
  async (pairData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";
      const response = await axios.post("/manager/pairs/", pairData, {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create pair"
      );
    }
  }
);

// Async thunk for fetching the timetable (pairs) based on group_id, year, and month
export const fetchTimeTable = createAsyncThunk(
  "timetables/fetchTimeTable",
  async ({ query, year, month }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const token_type = localStorage.getItem("token_type") || "Bearer";

      const response = await axios.get("/manager/pairs/", {
        headers: {
          Authorization: `${token_type} ${token}`,
        },
        params: {
          query,
          year,
          month,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch timetable"
      );
    }
  }
);

const timetablesSlice = createSlice({
  name: "timetables",
  initialState,
  reducers: {
    // Add reducers for other synchronous actions if necessary
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRoom.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.rooms.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteRoom.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter((room) => room.id !== action.payload);
        state.status = "succeeded";
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(searchSubjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchSubjects.fulfilled, (state, action) => {
        state.subjects = action.payload;
        state.status = "succeeded";
      })
      .addCase(searchSubjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.detail;
      })
      .addCase(createSubject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.subjects.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteSubject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.subjects = state.subjects.filter(
          (sub) => sub.id !== action.payload
        ); // Remove the deleted subject by id
        state.status = "succeeded";
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createSlot.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createSlot.fulfilled, (state, action) => {
        state.slots.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(createSlot.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteSlot.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteSlot.fulfilled, (state, action) => {
        state.slots = state.slots.filter((slot) => slot.id !== action.payload);
        state.status = "succeeded";
      })

      .addCase(deleteSlot.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchSlots.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSlots.fulfilled, (state, action) => {
        state.slots = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchSlots.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchSlotsByTeacher.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSlotsByTeacher.fulfilled, (state, action) => {
        state.slotsByTeacher = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchSlotsByTeacher.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchPairsByTeacher.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPairsByTeacher.fulfilled, (state, action) => {
        state.pairsByTeacher = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchPairsByTeacher.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchPairsByStudent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPairsByStudent.fulfilled, (state, action) => {
        state.pairsByStudent = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchPairsByStudent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchRooms.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.rooms = action.payload; // Replace the rooms array with fetched data
        state.status = "succeeded";
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createPair.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPair.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Optionally, you could push the new pair into a pairs array or handle success in another way.
      })
      .addCase(createPair.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchTimeTable.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTimeTable.fulfilled, (state, action) => {
        state.timetable = action.payload; // Store the fetched timetable data
        state.status = "succeeded";
      })
      .addCase(fetchTimeTable.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default timetablesSlice.reducer;
