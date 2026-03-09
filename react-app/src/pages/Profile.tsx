import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const ProfilePage = () => {
    const { user, updateProfile, logout, deleteAccount } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: user?.name ?? "",
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
            await updateProfile(formData.name || undefined, formData.avatar || undefined);
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
        <div>
            <h1>Profile</h1>
            <p>
                <strong>Email:</strong> {user?.email}
            </p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Display Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                    />
                </div>
                <div>
                    <label htmlFor="avatar">Avatar URL</label>
                    <input
                        id="avatar"
                        name="avatar"
                        type="url"
                        value={formData.avatar}
                        onChange={handleChange}
                        placeholder="https://example.com/avatar.png"
                    />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}
                {success && <p style={{ color: "green" }}>Profile updated!</p>}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                </button>
            </form>

            <button type="button" onClick={logout} style={{ marginTop: "1rem" }}>
                Log out
            </button>

            <hr style={{ marginTop: "2rem" }} />
            <div>
                <h2>Danger Zone</h2>
                <p>Permanently delete your account and all associated data.</p>
                <button
                    type="button"
                    onClick={() => {
                        setDeleteError(null);
                        setDeleteModalOpen(true);
                    }}
                    style={{ color: "red" }}
                >
                    Delete Account
                </button>
            </div>

            <ConfirmDeleteModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                loading={isDeleting}
                error={deleteError}
            />
        </div>
    );
};

export default ProfilePage;
