import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  fetchPostsByUser,
  getAllPosts,
  getPostById,
} from "../../api/postsApi";

const initialState = {
  posts: [],
  selectedPost: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllPosts();
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch posts");
    }
  }
);

export const getPostsByUser = createAsyncThunk(
  "posts/getPostsByUser",
  async (userId, { rejectWithValue }) => {
    try {
      return await fetchPostsByUser(userId);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching user posts");
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

export const fetchPostById = createAsyncThunk(
  "posts/fetchById",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await getPostById(postId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch post");
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload.data;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPostsByUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getPostsByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = action.payload.data;
      })
      .addCase(getPostsByUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(fetchPostById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.selectedPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { setSelectedPost, clearSelectedPost } = postsSlice.actions;

export default postsSlice.reducer;
