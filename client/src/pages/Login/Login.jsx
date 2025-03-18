import React from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Divider,
  Link,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/authSlice.js";
import { useNavigate } from "react-router-dom";
import loginLogo from "../../assets/login-banner.png";
import ichgramLogo from "../../assets/ichgram-logo.png";
import useStyles from "./LoginStyles.js";
import { NavLink } from "react-router-dom";

const Login = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, isLoading, isError, message } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(loginUser(data)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        navigate("/home");
      }
    });
  };

  return (
    <Box className={classes.root}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        className={classes.container}
      >
        <Box className={classes.imageContainer}>
          <img src={loginLogo} alt="Banner" className={classes.image} />
        </Box>

        <Box className={classes.formWrapper}>
          <Box className={classes.formContainer}>
            <img src={ichgramLogo} alt="Logo" className={classes.logoImage} />

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Username or Email"
                fullWidth
                margin="normal"
                variant="outlined"
                {...register("login", { required: "Email is required" })}
                error={!!errors.login}
                helperText={errors.login?.message}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                variant="outlined"
                {...register("password", { required: "Password is required" })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className={classes.loginButton}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </form>

            <Box className={classes.dividerContainer}>
              <Divider className={classes.divider} />
              <Typography className={classes.orText}>OR</Typography>
              <Divider className={classes.divider} />
            </Box>

            <Link href="#" className={classes.forgotPassword}>
              Forgot password?
            </Link>
          </Box>

          <Box className={classes.signupContainer}>
            <Typography>
              Don't have an account?{" "}
              <NavLink to="/sign-up" className={classes.signupLink}>
                Sign up
              </NavLink>
            </Typography>
          </Box>

          {isError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default Login;
