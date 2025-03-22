import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addComment,
  deleteComment,
  getAllCommentsByPostId,
} from "../../api/commentsApi";

const initialState = {
  comments: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const postComment = createAsyncThunk(
  "comments/add",
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const response = await addComment(postId, { text });
      return response.data; // assuming response.data is the comment object
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeComment = createAsyncThunk(
  "comments/delete",
  async (commentId, { rejectWithValue }) => {
    try {
      return await deleteComment(commentId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllCommentsByPost = createAsyncThunk(
  "comments/getAllByPost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await getAllCommentsByPostId(postId);
      return response.data; // should be an array of comment objects
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch comments"
      );
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addCommentToPostState: (state, action) => {
      state.comments.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postComment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        //TODO: check later
        state.comments.push(action.payload); // use returned comment object directly
      })
      .addCase(postComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(removeComment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload.commentId
        );
      })
      .addCase(removeComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllCommentsByPost.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllCommentsByPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments = action.payload;
      })
      .addCase(getAllCommentsByPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { addCommentToPostState } = commentsSlice.actions;
export default commentsSlice.reducer;
