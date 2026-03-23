import { Container, Paper, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import GatherlyLogo from "@/assets/gatherlylogo.png";
import AuthOptions from "@/features/auth/components/AuthOptions";
import FormDivider from "@/features/auth/components/FormDivider";
import SignupFormFields from "@/features/auth/components/signup/SignupFormFields";

const SignUpPage = () => {
    return (
        <Container maxWidth="sm">
            <Paper
                elevation={5}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                }}
            >
                <Box component="img" src={GatherlyLogo} alt="Logo" sx={{ height: 100 }} />
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                    Gatherly
                </Typography>

                <FormDivider text="Sign up with" />
                <AuthOptions mode="signup" />

                <FormDivider text="or" />
                <SignupFormFields />

                <Typography variant="body2">
                    Already have an account?{" "}
                    <Link to="/login" style={{ textDecoration: "none", fontWeight: "bold" }}>
                        Log in
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
};

export default SignUpPage;
