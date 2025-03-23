import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  fetchPostsByUser,
  getAllPosts,
  likePost,
  unlikePost,
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

export const togglePostLike = createAsyncThunk(
  "posts/toggleLike",
  async (postId, { getState, rejectWithValue }) => {
    const { posts } = getState().posts;
    const { user } = getState().auth;

    const post = posts.find((p) => p._id === postId);
    if (!post || !user) return rejectWithValue("Post or user not found");

    // Ensure we use populated user_id inside likes
    const isLiked = post.likes.some((like) => {
      const likeUserId = like?.user_id?._id || like?.user_id;
      return likeUserId === user.id || likeUserId === user._id;
    });

    try {
      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }

      return { postId, liked: !isLiked, userId: user._id };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Like toggle failed");
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
      .addCase(togglePostLike.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(togglePostLike.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const { postId, userId, liked } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) {
          if (liked) {
            post.likes.push({ user_id: userId }); // or just userId if not populated
            post.likes_count += 1;
          } else {
            post.likes = post.likes.filter(
              (like) => like.user_id !== userId && like !== userId
            );
            post.likes_count -= 1;
          }
        }
      })
      .addCase(togglePostLike.rejected, (state, action) => {
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
