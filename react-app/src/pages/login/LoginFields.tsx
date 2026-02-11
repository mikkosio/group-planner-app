import { Stack, TextField, Button } from "@mui/material";
import { useAuth } from "../../providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const LoginFields = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email")?.toString() || "";
        const password = formData.get("password")?.toString() || "";
        console.log("Sign in data:", { email, password });

        // auto login, change later
        login({
            id: "test123",
            email: email,
            name: "testUser"
        })

        navigate("/home");
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Stack spacing={2}>
                {/* Email field */}
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    required
                    fullWidth
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3
                        }
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
                            borderRadius: 3
                        }
                    }}
                />

                {/* Submit button */}
                <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "#35c2f1" }}>
                    Sign In
                </Button>
            </Stack>
        </form>
    );
};

export default LoginFields;
