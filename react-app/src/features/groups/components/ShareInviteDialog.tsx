import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { useState } from "react";
import FeedbackSnackbar from "@/components/FeedbackSnackbar";

/**
 * Props for ShareInviteDialog
 */
interface ShareInviteDialogProps {
    open: boolean;
    onClose: () => void;
    inviteCode: string;
}

/**
 * Modal dialog that displays the group invite code and link with copy-to-clipboard functionality.
 */
const ShareInviteDialog = ({ open, onClose, inviteCode }: ShareInviteDialogProps) => {
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
    }>({
        open: false,
        message: "",
    });

    // Generate the full invite link using configured app URL, fallback to window.location.origin
    const inviteLink = `${import.meta.env.VITE_APP_URL || window.location.origin}/invite/${inviteCode}`;

    // Copy text to clipboard
    const handleCopy = async (text: string, type: "code" | "link") => {
        try {
            await navigator.clipboard.writeText(text);
            setSnackbar({
                open: true,
                message: type === "code" ? "Invite code copied!" : "Invite link copied!",
            });
        } catch (err) {
            console.error("Failed to copy:", err);
            setSnackbar({
                open: true,
                message: "Failed to copy. Please try again.",
            });
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
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
                <DialogTitle>Share Invite</DialogTitle>

                {/* Dialog Content */}
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Share this invite code or link with others to join your group
                    </Typography>

                    {/* Invite Code Section */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Invite Code
                        </Typography>
                        <TextField
                            fullWidth
                            value={inviteCode}
                            slotProps={{
                                input: {
                                    readOnly: true,
                                    sx: {
                                        fontFamily: "monospace",
                                        fontSize: "1.1rem",
                                        letterSpacing: 4,
                                        fontWeight: 600,
                                    },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => handleCopy(inviteCode, "code")}
                                                edge="end"
                                                aria-label="copy invite code"
                                            >
                                                <ContentCopy />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                },
                            }}
                        />
                    </Box>

                    {/* Invite Link Section */}
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Invite Link
                        </Typography>
                        <TextField
                            fullWidth
                            value={inviteLink}
                            slotProps={{
                                input: {
                                    readOnly: true,
                                    sx: {
                                        fontSize: "0.9rem",
                                    },
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => handleCopy(inviteLink, "link")}
                                                edge="end"
                                                aria-label="copy invite link"
                                            >
                                                <ContentCopy />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 3,
                                },
                            }}
                        />
                    </Box>
                </DialogContent>

                {/* Dialog Actions */}
                <DialogActions>
                    <Button onClick={onClose} variant="contained" sx={{ mx: 0.5 }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for copy feedback */}
            <FeedbackSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity="success"
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </>
    );
};

export default ShareInviteDialog;
