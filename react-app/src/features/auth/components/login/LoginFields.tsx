import { useState } from "react";
import { Stack, TextField, Button, Alert } from "@mui/material";
import { useAuth } from "@/providers/AuthProvider";
import axios from "axios";

interface LoginFieldsProps {
    handleSuccess: () => void;
}

const LoginFields = ({ handleSuccess }: LoginFieldsProps) => {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email")?.toString() || "";
        const password = formData.get("password")?.toString() || "";

        try {
            await login(email, password);
            handleSuccess();
        } catch (error: unknown) {
            let message = "Login failed. Please try again.";
            
            if (axios.isAxiosError(error) && error.response?.data?.message) {
                message = error.response.data.message;
            } else if (error instanceof Error) {
                message = error.message;
            }
            
            setError(message);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Stack spacing={2}>
                {/* Error Alert */}
                {error && (
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Email field */}
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    required
                    fullWidth
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                        },
                    }}
                />

                {/* Password field */}
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    required
                    fullWidth
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                        },
                    }}
                />

                {/* Submit button */}
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ backgroundColor: "#35c2f1" }}
                >
                    Sign In
                </Button>
            </Stack>
        </form>
    );
};

export default LoginFields;
