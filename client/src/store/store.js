import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice.js";
import posts from "./slices/postsSlice.js";
import follow from "./slices/followSlice.js";
import comments from "./slices/commentsSlice.js";
import user from "./slices/userSlice.js";
import likes from "./slices/likeSlice.js";
import search from "./slices/searchSlice.js";

const store = configureStore({
  reducer: { auth, posts, follow, comments, user, likes, search },
});

export default store;
