import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getLikesByPost, toggleLike } from "../../api/likeApi";

const initialState = {
  likesByPostId: {},
  isLoading: false,
  isError: false,
  message: "",
};

export const fetchPostLikeStatus = createAsyncThunk(
  "likes/fetchPostLikeStatus",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await getLikesByPost(postId);
      return { postId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch likes");
    }
  }
);

export const togglePostLike = createAsyncThunk(
  "likes/togglePostLike",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await toggleLike(postId);
      return { postId, liked: response.liked };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to toggle like");
    }
  }
);

const likeSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostLikeStatus.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(fetchPostLikeStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const { postId, count, liked } = action.payload;
        state.likesByPostId[postId] = { count, liked };
      })
      .addCase(fetchPostLikeStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(togglePostLike.fulfilled, (state, action) => {
        const { postId, liked } = action.payload;
        const current = state.likesByPostId[postId] || {
          count: 0,
          liked: false,
        };
        state.likesByPostId[postId] = {
          count: current.count + (liked ? 1 : -1),
          liked,
        };
      });
  },
});

export default likeSlice.reducer;
