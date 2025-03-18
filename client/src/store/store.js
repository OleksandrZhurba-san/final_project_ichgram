import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice.js";
import posts from "./slices/postsSlice.js";

const store = configureStore({
  reducer: { auth, posts },
});

export default store;
