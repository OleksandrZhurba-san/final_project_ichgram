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
} from "./pages";
import { ProtectedRoute, Layout } from "./components";
import { isTokenExpired } from "./utils/auth.js";
import { useEffect } from "react";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isPublicRoute =
      location.pathname === "/login" || location.pathname === "/sign-up";

    if (!isPublicRoute && (!token || isTokenExpired(token))) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate, location.pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#fafafa",
        width: "100%",
      }}
    >
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
          </Route>
        </Route>

        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Box>
  );
};

export default App;
