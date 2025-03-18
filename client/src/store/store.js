import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/authSlice.js";

const store = configureStore({
  reducer: { auth },
});

export default store;
