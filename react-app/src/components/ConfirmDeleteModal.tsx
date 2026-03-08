import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

interface ConfirmDeleteModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    error?: string | null;
}

/**
 * Modal dialog to confirm permanent account deletion
 */
const ConfirmDeleteModal = ({
    open,
    onClose,
    onConfirm,
    loading,
    error,
}: ConfirmDeleteModalProps) => {
    return (
        <Dialog open={open} onClose={loading ? undefined : onClose}>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete your account? This action is permanent and
                    cannot be undone.
                </DialogContentText>
                {error && (
                    <DialogContentText color="error" sx={{ mt: 1 }}>
                        {error}
                    </DialogContentText>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
                    {loading ? "Deleting..." : "Delete Account"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDeleteModal;
