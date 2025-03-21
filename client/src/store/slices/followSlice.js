import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFollowers,
  getFollowings,
  followUser,
  unfollowUser,
} from "../../api/followApi";

export const getUserFollowers = createAsyncThunk(
  "follow/getFollowers",
  async (userId, { rejectWithValue }) => {
    try {
      return await getFollowers(userId);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching followers");
    }
  }
);

export const getUserFollowings = createAsyncThunk(
  "follow/getFollowings",
  async (userId, { rejectWithValue }) => {
    try {
      return await getFollowings(userId);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching followings");
    }
  }
);

export const addFollowing = createAsyncThunk(
  "follow/addFollowing",
  async (userId, { rejectWithValue }) => {
    try {
      return await followUser(userId);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error following user");
    }
  }
);

export const deleteFollowing = createAsyncThunk(
  "follow/deleteFollowing",
  async (userId, { rejectWithValue }) => {
    try {
      return await unfollowUser(userId);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error unfollowing user");
    }
  }
);

const followSlice = createSlice({
  name: "follow",
  initialState: {
    followers: [],
    followings: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserFollowers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserFollowers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.followers = action.payload;
      })
      .addCase(getUserFollowers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserFollowings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserFollowings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.followings = action.payload;
      })
      .addCase(getUserFollowings.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addFollowing.fulfilled, () => {})
      .addCase(deleteFollowing.fulfilled, () => {});
  },
});

export default followSlice.reducer;
