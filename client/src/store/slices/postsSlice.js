import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createPost, getAllPosts } from "../../api/postsApi";

const initialState = {
  posts: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const fetchAll = createAsyncThunk(
  "posts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllPosts();
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch posts");
    }
  }
);

export const createNewPost = createAsyncThunk(
  "posts/create",
  async (formData, { rejectWithValue }) => {
    try {
      return await createPost(formData);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create post");
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload.data;
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default postsSlice.reducer;
