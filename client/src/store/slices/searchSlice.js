import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchUsers } from "../../api/userApi";

export const searchUsersThunk = createAsyncThunk(
  "search/users",
  async (query, { rejectWithValue }) => {
    try {
      const response = await searchUsers(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to search users");
    }
  }
);

const initialState = {
  searchResults: [],
  recentSearches: [],
  isLoading: false,
  isError: false,
  message: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearSearchState: (state) => {
      state.searchResults = [];
      state.recentSearches = [];
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsersThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(searchUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.searchResults = [];
      });
  },
});

export const { clearSearchResults, clearSearchState } = searchSlice.actions;
export default searchSlice.reducer;
