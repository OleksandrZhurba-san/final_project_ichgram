import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import SideNav from "../sideNav/SideNav";
import { useTheme, useMediaQuery } from "@mui/material";

const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
      }}
    >
      <Box
        sx={{
          width: isMobile ? "60px" : "244px",
          flexShrink: 0,
          transition: "width 0.3s ease",
        }}
      >
        <SideNav />
      </Box>
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: { xs: "12px", md: "20px" },
          maxWidth: { xs: `calc(100% - 60px)`, md: `calc(100% - 244px)` },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
