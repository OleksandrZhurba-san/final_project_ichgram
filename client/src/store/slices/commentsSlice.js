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
  reducers: {},
  extraReducers: (builder) => {},
});

export default commentsSlice.reducer;
