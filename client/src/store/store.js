import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice.js";
import posts from "./slices/postsSlice.js";
import follow from "./slices/followSlice.js";

const store = configureStore({
  reducer: { auth, posts, follow },
});

export default store;
