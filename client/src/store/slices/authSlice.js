import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserService, registerUserService } from "../../api/authApi";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");
const user = token ? jwtDecode(token) : null;

const initialState = {
  user,
  token,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  isAuthLoaded: !!token,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      return await registerUserService(userData);
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      return await loginUserService(credentials);
    } catch (error) {
      return rejectWithValue(error.message || "login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = action.payload.data.token;
        localStorage.setItem("token", action.payload.data.token);
        state.user = jwtDecode(action.payload.data.token);
        state.isAuthLoaded = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.isAuthLoaded = true;
      });
  },
});

export const { logout } = authSlice.actions;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
