import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    width: "100%",
  },
  container: {
    maxWidth: "900px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "32px",
    width: "100%",
    margin: "0 auto",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    flex: 1,
  },
  image: {
    width: "380px",
    height: "auto",
    borderRadius: "8px",
  },
  logoImage: {
    width: "190px",
    height: "auto",
  },
  formWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  formContainer: {
    background: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "100%",
    maxWidth: "350px",
  },
  logo: {
    fontSize: "32px",
    marginBottom: "20px",
  },
  loginButton: {
    marginTop: "16px",
    backgroundColor: "#0095F6",
    color: "#fff",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: "#0074cc",
    },
  },
  dividerContainer: {
    display: "flex",
    gap: "18px",
    alignItems: "center",
    margin: "20px 0",
  },
  divider: {
    flex: 1,
    backgroundColor: "#dbdbdb",
    height: "1px",
  },
  orText: {
    margin: "0 10px",
    color: "#8e8e8e",
    fontWeight: "bold",
    fontSize: "13px",
  },
  forgotPassword: {
    display: "inline-block",
    marginTop: "10px",
    fontSize: "14px",
    // fontWeight: "bold",
    fontFamily: "inherit",
    color: "#0095F6",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  signupContainer: {
    marginTop: "10px",
    padding: "15px",
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: "350px",
    textAlign: "center",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  signupLink: {
    fontWeight: "bold",
    fontFamily: "inherit",
    color: "#0095F6",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

export default useStyles;
