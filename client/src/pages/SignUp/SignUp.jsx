import React from "react";
import { Container, TextField, Button, Typography, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/slices/authSlice.js";
import { useNavigate } from "react-router-dom";
import { styles } from "./SignUpStyles.js";
import ichgramLogo from "../../assets/ichgram-logo.png";
import { NavLink } from "react-router-dom";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = (data) => {
    dispatch(registerUser(data)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        navigate("/login");
      } else if (result.payload) {
        if (result.payload.toLowerCase().includes("already")) {
          setError("username", { type: "server", message: result.payload });
        }
        if (result.payload.toLowerCase().includes("already")) {
          setError("email", { type: "server", message: result.payload });
        }
      }
    });
  };

  return (
    <Container style={styles.container}>
      <img src={ichgramLogo} alt="ICHGram Logo" style={styles.logo} />

      <Typography variant="h6" gutterBottom>
        Sign up to see photos and videos from your friends.
      </Typography>

      {/*TODO: move to component*/}
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          style={styles.input}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Enter a valid email",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Full Name"
          variant="outlined"
          fullWidth
          style={styles.input}
          {...register("full_name", { required: "Full name is required" })}
          error={!!errors.full_name}
          helperText={errors.full_name?.message}
        />

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          style={styles.input}
          {...register("username", { required: "Username is required" })}
          error={!!errors.username}
          helperText={errors.username?.message}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          style={styles.passwordInput}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Typography variant="body2" style={styles.learnMoreLink}>
          People who use our service may have uploaded your contact information
          to Instagram. <Link href="#">Learn More</Link>
        </Typography>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={styles.signUpButton}
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>

      <Typography variant="body2">
        Have an account? <NavLink to="/login">Log in</NavLink>
      </Typography>
    </Container>
  );
};

export default SignUp;
