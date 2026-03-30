import { Alert, Snackbar } from "@mui/material";

interface FeedbackSnackbarProps {
    open: boolean;
    message: string;
    severity?: "success" | "error" | "warning" | "info";
    onClose: () => void;
    autoHideDuration?: number;
}

const FeedbackSnackbar = ({
    open,
    message,
    severity = "success",
    onClose,
    autoHideDuration = 3000,
}: FeedbackSnackbarProps) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default FeedbackSnackbar;
