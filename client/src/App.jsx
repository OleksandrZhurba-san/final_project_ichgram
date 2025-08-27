import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import { Box } from "@mui/material";
import {
  Login,
  SignUp,
  Home,
  ProfilePage,
  EditProfile,
  ExplorePage,
  NotFound,
} from "./pages";
import { ProtectedRoute, Layout, Footer } from "./components";
import { isTokenExpired } from "./utils/auth.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoggedInUser } from "./store/slices/userSlice";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isPublicRoute =
      location.pathname === "/login" || location.pathname === "/sign-up";

    if (!isPublicRoute && (!token || isTokenExpired(token))) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchLoggedInUser(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <Box
      data-testid='root'
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#fafafa",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </Box>
      {location.pathname !== "/login" &&
        location.pathname !== "/sign-up" &&
        !location.pathname.match(/^\/?$/) && <Footer />}
    </Box>
  );
};

export default App;
