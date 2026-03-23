import { Container, Paper, Typography, Box } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthOptions from "@/features/auth/components/AuthOptions";
import FormDivider from "@/features/auth/components/FormDivider";
import LoginFields from "@/features/auth/components/login/LoginFields";
import GatherlyLogo from "@/assets/gatherlylogo.png";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dest = location.state?.from || "/home";

    const handleSuccess = () => {
        console.log(dest);

        navigate(dest, { replace: true });
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
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                }}
            >
                {/* Logo */}
                <Box
                    component="img"
                    src={GatherlyLogo}
                    alt="Logo"
                    sx={{
                        height: 100,
                    }}
                />
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                    Gatherly
                </Typography>

                {/* Sign in text */}
                <FormDivider text="Sign in with" />

                {/* Sign-in buttons */}
                <AuthOptions />

                {/* Divider */}
                <FormDivider text="or" />

                {/* Input Fields */}
                <LoginFields handleSuccess={handleSuccess} />

                {/* Redirect to sign-up */}
                <Typography variant="body2">
                    New to Gatherly?{" "}
                    <Link
                        to={`/signup`}
                        style={{ textDecoration: "none", fontWeight: "bold" }}
                        state={{ from: dest }}
                    >
                        Create account
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
};

export default LoginPage;
