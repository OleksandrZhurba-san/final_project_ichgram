import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "158px",
        paddingTop: "24px",
        maxWidth: "1440px",
        margin: "0 auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignSelf: "center",
          justifyContent: "space-between",
          width: "450px",
        }}
      >
        <Link
          to="/home"
          style={{
            color: "#737373",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "16px",
            "&:hover": {
              color: "#737373",
            },
          }}
        >
          Home
        </Link>
        <Link
          to="/search"
          style={{
            color: "#737373",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "16px",
            "&:hover": {
              color: "#737373",
            },
          }}
        >
          Search
        </Link>
        <Link
          to="/explore"
          style={{
            color: "#737373",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "16px",
            "&:hover": {
              color: "#737373",
            },
          }}
        >
          Explore
        </Link>
        <Link
          to="/messages"
          style={{
            color: "#737373",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "16px",
            "&:hover": {
              color: "#737373",
            },
          }}
        >
          Messages
        </Link>
        <Link
          to="/notifications"
          style={{
            color: "#737373",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "16px",
            "&:hover": {
              color: "#737373",
            },
          }}
        >
          Notifications
        </Link>
        <Link
          to="/create"
          style={{
            color: "#737373",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "16px",
            "&:hover": {
              color: "#737373",
            },
          }}
        >
          Create
        </Link>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "123px",
        }}
      >
        <Typography
          sx={{
            color: "#737373",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: "16px",
          }}
        >
          © 2024 ICHgram
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
