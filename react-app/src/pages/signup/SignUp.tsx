import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import AuthOptions from "../../components/AuthOptions";
import FormDivider from "../../components/FormDivider";
import GatherlyLogo from "../../assets/gatherlylogo.png";

const SignUpPage = () => {
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName")?.toString() || "";
    const lastName = formData.get("lastName")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const confirmPassword = formData.get("confirmPassword")?.toString() || "";
    console.log("Sign up data:", {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={5}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mt: 8,
          p: 2,
          borderRadius: 2,
        }}
      >
        <Box
          component="img"
          src={GatherlyLogo}
          alt="Logo"
          sx={{ height: 100 }}
        />
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          Gatherly
        </Typography>

        <FormDivider text="Sign up with" />

        <AuthOptions />

        <FormDivider text="or" />

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="First Name"
                name="firstName"
                required
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
              <TextField
                label="Last Name"
                name="lastName"
                required
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
            </Stack>

            <TextField
              label="Email"
              name="email"
              type="email"
              required
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              required
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ backgroundColor: "#35c2f1" }}
            >
              Sign Up
            </Button>
          </Stack>
        </form>

        {/* Redirect to login */}
        <Typography variant="body2">
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ textDecoration: "none", fontWeight: "bold" }}
          >
            Log in
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default SignUpPage;
