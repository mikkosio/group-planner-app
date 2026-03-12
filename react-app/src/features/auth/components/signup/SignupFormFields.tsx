import { useState } from "react";
import { Stack, TextField, Button, Alert } from "@mui/material";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

type ApiFieldError = {
    field: string;
    message: string;
};

type ApiErrorResponse = {
    message?: string;
    errors?: ApiFieldError[] | ApiFieldError;
};

const PASSWORD_RULES = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

const SignupFormFields = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const firstName = formData.get("firstName")?.toString().trim() ?? "";
        const lastName = formData.get("lastName")?.toString().trim() ?? "";
        const email = formData.get("email")?.toString().trim() ?? "";
        const password = formData.get("password")?.toString() ?? "";
        const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";
        const name = `${firstName} ${lastName}`.trim();

        if (name.length < 2) {
            setError("Name must be at least 2 characters.");
            return;
        }

        if (password.length < 8 || !PASSWORD_RULES.test(password)) {
            setError(
                "Password must be at least 8 characters and include uppercase, lowercase, and a number.",
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            await register(email, password, name);
            navigate("/home");
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                const payload = err.response?.data as ApiErrorResponse | undefined;
                const errors = payload?.errors;
                if (Array.isArray(errors) && errors.length > 0) {
                    setError(errors.map((entry) => entry.message).join(" "));
                    return;
                }

                if (errors && !Array.isArray(errors) && errors.message) {
                    setError(errors.message);
                    return;
                }

                if (payload?.message) {
                    setError(payload.message);
                    return;
                }
            }

            setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Stack spacing={2}>
                {error && <Alert severity="error">{error}</Alert>}

                <Stack direction="row" spacing={2}>
                    <TextField label="First Name" name="firstName" required fullWidth />
                    <TextField label="Last Name" name="lastName" required fullWidth />
                </Stack>

                <TextField label="Email" name="email" type="email" required fullWidth />
                <TextField label="Password" name="password" type="password" required fullWidth />
                <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    required
                    fullWidth
                />

                <Button type="submit" variant="contained" fullWidth disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                </Button>
            </Stack>
        </form>
    );
};

export default SignupFormFields;
