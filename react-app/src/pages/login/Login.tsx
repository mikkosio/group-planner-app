import { Container, Paper, Typography, Box } from "@mui/material";
import AuthOptions from "../../components/AuthOptions";
import FormDivider from "../../components/FormDivider";
import LoginFields from "./LoginFields";
import GatherlyLogo from "../../assets/gatherlylogo.png";

const LoginPage = () => {
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
                    borderRadius: 2
                }}>
                {/* Logo */}
                <Box
                    component="img"
                    src={GatherlyLogo}
                    alt="Logo"
                    sx={{
                        height: 100
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
                <FormDivider text="Or" />

                {/* Input Fields */}
                <LoginFields />
            </Paper>
        </Container>
    );
};

export default LoginPage;
