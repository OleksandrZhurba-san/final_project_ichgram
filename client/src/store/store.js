import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice.js";
import posts from "./slices/postsSlice.js";
import follow from "./slices/followSlice.js";
import comments from "./slices/commentsSlice.js";
import user from "./slices/userSlice.js";
import likes from "./slices/likeSlice.js";

const store = configureStore({
  reducer: { auth, posts, follow, comments, user, likes },
});

export default store;
