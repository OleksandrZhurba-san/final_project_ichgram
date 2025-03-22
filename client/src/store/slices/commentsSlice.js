import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addComment, deleteComment } from "../../api/commentsApi";

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
      return await addComment(postId, { text });
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
const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setCommentsFromPost: (state, action) => {
      state.comments = action.payload.comments || [];
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
        state.comments.push(action.payload.comment);
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
      });
  },
});

export const { setCommentsFromPost } = commentsSlice.actions;
export default commentsSlice.reducer;
