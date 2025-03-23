import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { Box } from "@mui/material";
import { Login, SignUp, Home, ProfilePage } from "./pages";
import { ProtectedRoute, Layout } from "./components";
import { isTokenExpired } from "./utils/auth.js";
import { useEffect } from "react";

const App = () => {
  const mainBoxStyle = {
    maxWidth: 1440,
    margin: "0 auto",
  };
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);
  return (
    <Box sx={mainBoxStyle}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            {/* Profile routes */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Box>
  );
};

export default App;
