import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import SideNav from "../sideNav/SideNav";

const Layout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        maxWidth: 1440,
        margin: "0 auto",
      }}
    >
      <Box
        sx={{ width: "244px", flexShrink: 0, borderRight: "1px solid #dbdbdb" }}
      >
        <SideNav />
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
