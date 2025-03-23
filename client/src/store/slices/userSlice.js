import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUserById, updateUser } from "../../api/userApi";

const initialState = {
  currentUser: null,
  loggedInUser: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const fetchUserById = createAsyncThunk(
  "user/fetchById",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await getUserById(userId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user");
    }
  }
);

export const fetchLoggedInUser = createAsyncThunk(
  "user/fetchLoggedInUser",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await getUserById(userId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch logged in user"
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/update",
  async ({ updatedData }, { rejectWithValue }) => {
    try {
      const data = await updateUser(updatedData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update user");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserState: (state) => {
      state.currentUser = null;
      state.loggedInUser = null;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentUser = action.payload;
        if (state.loggedInUser?.data?._id === action.payload.data?._id) {
          state.loggedInUser = action.payload;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchLoggedInUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(fetchLoggedInUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.loggedInUser = action.payload;
      })
      .addCase(fetchLoggedInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
