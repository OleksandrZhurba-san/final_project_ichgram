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
      console.error("Error fetching like status:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch likes");
    }
  }
);

export const togglePostLike = createAsyncThunk(
  "likes/togglePostLike",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await toggleLike(postId);

      // Check if response has the expected structure
      if (!response || typeof response !== "object") {
        console.error("Invalid response structure:", response);
        throw new Error("Invalid response structure");
      }

      // Handle nested data structure
      const { data } = response;
      if (!data || typeof data !== "object") {
        console.error("Invalid data structure:", data);
        throw new Error("Invalid data structure");
      }

      const { liked, count } = data;
      if (typeof liked !== "boolean" || typeof count !== "number") {
        console.error("Invalid data types:", { liked, count });
        throw new Error("Invalid data types");
      }

      const payload = {
        postId,
        liked,
        count,
      };
      return payload;
    } catch (error) {
      console.error("Error toggling like:", error);
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
      .addCase(togglePostLike.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(togglePostLike.fulfilled, (state, action) => {
        state.isLoading = false;
        const { postId, count, liked } = action.payload;
        state.likesByPostId[postId] = { count, liked };
      })
      .addCase(togglePostLike.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default likeSlice.reducer;
