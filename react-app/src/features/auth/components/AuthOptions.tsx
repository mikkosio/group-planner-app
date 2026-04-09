import { Box, Stack, Button } from "@mui/material";
import GoogleLogo from "@/assets/google-logo.svg";
import AppleLogo from "@/assets/apple-logo.svg";
import FeedbackSnackbar from "@/components/FeedbackSnackbar";
import { useState } from "react";

type AuthOptionsProps = {
    mode?: "signup" | "login";
};

const AuthOptions = ({ mode = "login" }: AuthOptionsProps) => {
    const action = mode === "signup" ? "Sign up" : "Sign in";
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleComingSoonClick = () => {
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <Stack spacing={2} sx={{ width: "100%" }}>
                <Button
                    variant="outlined"
                    startIcon={
                        <Box component="img" src={GoogleLogo} alt="Google logo" sx={{ height: 20 }} />
                    }
                    sx={{ color: "black", borderColor: "gray" }}
                    onClick={handleComingSoonClick}
                >
                    {action} with Google
                </Button>

                <Button
                    variant="outlined"
                    startIcon={
                        <Box component="img" src={AppleLogo} alt="Apple logo" sx={{ height: 24 }} />
                    }
                    sx={{ color: "black", borderColor: "gray" }}
                    onClick={handleComingSoonClick}
                >
                    {action} with Apple
                </Button>
            </Stack>

            <FeedbackSnackbar
                open={snackbarOpen}
                message="Coming Soon - This feature is not yet available"
                severity="info"
                onClose={handleSnackbarClose}
            />
        </>
    );
};

export default AuthOptions;
