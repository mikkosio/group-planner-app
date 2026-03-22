import { useState } from "react";
import { Alert, Box, Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

const ProfilePage = () => {
    const { user, updateProfile, logout, deleteAccount } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: user?.name ?? "",
        email: user?.email ?? "",
        avatar: user?.avatar ?? "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setIsLoading(true);
        try {
            await updateProfile(
                formData.name || undefined,
                formData.email || undefined,
                formData.avatar || undefined,
            );
            setSuccess(true);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Failed to update profile. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        setDeleteError(null);
        setIsDeleting(true);
        try {
            await deleteAccount();
            navigate("/");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setDeleteError(err.message);
            } else {
                setDeleteError("Failed to delete account. Please try again.");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 3 }}>
            <Paper
                elevation={5}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Profile
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Update your account details
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Display Name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />

                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />

                        <TextField
                            label="Avatar URL"
                            name="avatar"
                            type="url"
                            value={formData.avatar}
                            onChange={handleChange}
                            fullWidth
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                        />

                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">Profile updated!</Alert>}

                        <Button type="submit" variant="contained" disabled={isLoading} fullWidth>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </Stack>
                </Box>

                <Button type="button" variant="outlined" onClick={logout} fullWidth>
                    Log out
                </Button>
            </Paper>

            <Paper elevation={5} sx={{ mt: 2, p: 3, borderRadius: 2 }}>
                <Typography variant="h6" color="error" sx={{ mb: 1 }}>
                    Danger Zone
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Permanently delete your account and all associated data.
                </Typography>
                <Button
                    type="button"
                    color="error"
                    variant="contained"
                    onClick={() => {
                        setDeleteError(null);
                        setDeleteModalOpen(true);
                    }}
                >
                    Delete Account
                </Button>
            </Paper>

            <ConfirmDeleteModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                loading={isDeleting}
                error={deleteError}
            />
        </Container>
    );
};

export default ProfilePage;
