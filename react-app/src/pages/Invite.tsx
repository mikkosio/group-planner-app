import FeedbackSnackbar from "@/components/FeedbackSnackbar";
import { joinGroup } from "@/features/groups/api/join-group";
import { Check, Close, Home } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Container, Paper, Snackbar, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const InvitePage = () => {
    const navigate = useNavigate();
    const { code } = useParams<{ code: string }>();

    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState("");
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "info";
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    useEffect(() => {
        if (!code) {
            setError("Invalid invite link!");
            return;
        }

        // Handle post request to join a group
        const handleJoin = async () => {
            setLoading(true);

            try {
                const res = await joinGroup(code);

                if (!res.success) {
                    setError(res.message || "Failed to join group.");
                    return;
                }

                // Show success state (no snackbar needed - UI shows it)
                setSuccess(true);

                // Redirect after showing success message
                setTimeout(() => {
                    navigate("/home");
                }, 3000);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const message = err.response?.data?.message || "Failed to join group";

                    // Special handling for "already a member"
                    if (message.toLowerCase().includes("already a member")) {
                        setSuccess(true);
                        setSnackbar({
                            open: true,
                            message: "You're already in this group!",
                            severity: "info",
                        });
                        setTimeout(() => navigate("/home"), 2500);
                    } else {
                        setError(message);
                    }
                } else {
                    setError("Unexpected error");
                }
            } finally {
                setLoading(false);
            }
        };

        handleJoin();
    }, [code, navigate]);

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "90vh",
            }}
        >
            <Paper
                elevation={5}
                sx={{
                    p: 6,
                    borderRadius: 4,
                    textAlign: "center",
                }}
            >
                {loading ? (
                    <Box sx={{ py: 2 }}>
                        <CircularProgress size={50} />
                        <Typography variant="h5" sx={{ mt: 3 }}>
                            Joining group…
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                            Hang tight, we're getting you in.
                        </Typography>
                    </Box>
                ) : success ? (
                    <Box sx={{ py: 2 }}>
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 10,
                                backgroundColor: "success.light",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                                mb: 2,
                            }}
                        >
                            <Check color="success" sx={{ fontSize: 38 }} />
                        </Box>

                        <Typography variant="h4" gutterBottom>
                            Welcome!
                        </Typography>

                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Redirecting you to your groups...
                        </Typography>

                        <Button
                            variant="contained"
                            startIcon={<Home />}
                            onClick={() => navigate("/home")}
                            sx={{
                                px: 4,
                                py: 1.5,
                                textTransform: "none",
                            }}
                        >
                            View My Groups Now
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 10,
                                backgroundColor: "error.light",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                                mb: 2,
                            }}
                        >
                            <Close color="error" sx={{ fontSize: 38 }} />
                        </Box>

                        <Typography variant="h4" gutterBottom={true}>
                            Oops!
                        </Typography>

                        <Box
                            sx={{
                                backgroundColor: "error.light",
                                borderRadius: 2,
                                px: 2,
                                py: 1.5,
                                mb: 4,
                            }}
                        >
                            <Typography variant="body2" color="error">
                                {error || "Failed to join the group."}
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Home />}
                            onClick={() => navigate("/home")}
                            sx={{
                                backgroundColor: "primary.dark",
                                px: 4,
                                py: 1.5,
                                textTransform: "none",
                                "&:hover": {
                                    backgroundColor: "error.main",
                                },
                            }}
                        >
                            Return to Home
                        </Button>
                    </>
                )}
            </Paper>

            {/* Snackbar for success/info notifications only */}
            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </Container>
    );
};

export default InvitePage;
