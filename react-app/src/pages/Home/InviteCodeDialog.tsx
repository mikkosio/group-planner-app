import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { useState } from "react";

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
const InviteCodeDialog = ({open, handleClose}: JoinGroupDialogProps) => {
    const [code, setCode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    
    // Control user input in text field
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
        setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
    }

    // Handle post request to join a group
    const handleJoin = async () => {
        setLoading(true);

        // simulate post request, replace in the future
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Display modal or some success message after successful join
        handleClose()
        setLoading(false);
        alert("Join success")

        console.log(code);
    }

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
                    }
                }
            }}
        >
            {/* Title */}
            <DialogTitle>
                Join a Group
            </DialogTitle>

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
                    slotProps={{
                        htmlInput: {
                            maxLength: 6,
                            sx: {
                                letterSpacing: 4,
                                "&:not(:placeholder-shown)": {
                                    textTransform: "uppercase"
                                }
                            }
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
                <Button onClick={handleClose} sx={{ mx: 0.5}}>Cancel</Button>
                <Button
                    onClick={handleJoin}
                    variant="contained"
                    disabled={code.length !== 6}
                >
                    {loading ? "Joining..." : "Join"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InviteCodeDialog;