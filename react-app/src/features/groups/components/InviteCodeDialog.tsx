import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { joinGroup } from "@/features/groups/api/join-group";
import axios from "axios";
import FeedbackSnackbar from "@/components/FeedbackSnackbar";

/**
 * Props for InviteCodeDialog
 */
interface JoinGroupDialogProps {
    open: boolean;
    handleClose: () => void;
}

/**
 * Modal dialog that allows a user to join a group using a 6-character invite code.
 */
const InviteCodeDialog = ({ open, handleClose }: JoinGroupDialogProps) => {
    const [code, setCode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
    }>({
        open: false,
        message: "",
    });

    // Control user input in text field
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
    ) => {
        setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
    };

    // Handle post request to join a group
    const handleJoin = async () => {
        setLoading(true);
        setError(""); // Clear any previous errors

        try {
            const res = await joinGroup(code);

            if (!res.success) {
                const message = res.message || "Failed to join group.";
                setError(message);
                return;
            }

            // Show success snackbar
            setSnackbar({
                open: true,
                message: "Successfully joined the group!",
            });

            setCode(""); // Clear input
            setError(""); // Clear any errors

            // Close dialog after brief delay
            setTimeout(() => {
                handleClose();
                setSnackbar({ open: false, message: "" });
            }, 1500);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.message || "Failed to join group";
                setError(message);
            } else {
                setError("Unexpected error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        p: 1,
                    },
                },
            }}
        >
            {/* Title */}
            <DialogTitle>Join a Group</DialogTitle>

            {/* Dialog Text */}
            <DialogContent>
                <Typography variant="body2" color="primary.main">
                    Enter the invite code you received from your friend
                </Typography>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Invite Code"
                    placeholder="e.g. Y7VN1M"
                    value={code}
                    error={!!error}
                    helperText={error}
                    slotProps={{
                        htmlInput: {
                            maxLength: 6,
                            sx: {
                                letterSpacing: 4,
                                "&:not(:placeholder-shown)": {
                                    textTransform: "uppercase",
                                },
                            },
                        },
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                        },
                    }}
                    onChange={(e) => handleChange(e)}
                />
            </DialogContent>

            {/* Dialog Buttons */}
            <DialogActions>
                <Button onClick={handleClose} sx={{ mx: 0.5 }}>
                    Cancel
                </Button>
                <Button onClick={handleJoin} variant="contained" disabled={code.length !== 6}>
                    {loading ? "Joining..." : "Join"}
                </Button>
            </DialogActions>

            {/* Snackbar for success notifications only */}
            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity="success" 
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </Dialog>
    );
};

export default InviteCodeDialog;
