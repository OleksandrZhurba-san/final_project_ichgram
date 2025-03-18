import { Box } from "@mui/material";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Home, Login, SignUp } from "./pages";

function App() {
  const mainBoxStyle = {
    maxWidth: 1440,
    margin: "0 auto",
  };

  return (
    <Box sx={mainBoxStyle}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Box>
  );
}

export default App;
