import { Box } from "@mui/material";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Home, Login, SignUp } from "./pages";
import { Layout, ProtectedRoute, SideNav } from "./components";
import { isTokenExpired } from "./utils/auth.js";
import { useEffect } from "react";

function App() {
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
        {/**public */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/**protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
