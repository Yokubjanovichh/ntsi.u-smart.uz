import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const initialState = {
  token: null,
  user: null,
  status: null,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ phoneNumber, password }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("username", `+998${phoneNumber}`);
      formData.append("password", password);

      const response = await axios.post("auth/login/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { access_token, token_type } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("token_type", token_type);

      return { token: access_token };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to login"
      );
    }
  }
);

export const getMe = createAsyncThunk("auth/getMe", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const token_type = localStorage.getItem("token_type");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }
    const response = await axios.get("/profile/me/", {
      headers: {
        Authorization: `${token_type} ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Failed to fetch user data"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("token_type");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.user.role = action.payload.role; // Ro'lni olish
      })
      .addCase(getMe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.detail;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
