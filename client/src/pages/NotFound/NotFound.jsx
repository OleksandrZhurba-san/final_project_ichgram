import { Box, Typography } from "@mui/material";
import loginLogo from "../../assets/login-banner.png";

const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        gap: "32px",
        p: 4,
      }}
    >
      <Box
        sx={{
          width: "301px",
          height: "460px",
          position: "relative",
        }}
      >
        <Box
          component="img"
          src={loginLogo}
          alt="Instagram app preview"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "450px",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: "36px",
            fontWeight: 700,
            color: "text.primary",
            mb: 2,
          }}
        >
          Oops! Page Not Found (404 Error)
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontSize: "16px",
            fontWeight: 500,
            color: "#737373",
            lineHeight: 1.5,
          }}
        >
          We're sorry, but the page you're looking for doesn't seem to exist. If
          you typed the URL manually, please double-check the spelling. If you
          clicked on a link, it may be outdated or broken.
        </Typography>
      </Box>
    </Box>
  );
};

export default NotFound;
