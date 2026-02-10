import { Stack, TextField, Button } from "@mui/material";

const LoginFields = () => {
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email")?.toString() || "";
        const password = formData.get("password")?.toString() || "";
        console.log("Sign in data:", { email, password });
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
                <Button type="submit" variant="contained" fullWidth>
                    Sign In
                </Button>
            </Stack>
        </form>
    );
};

export default LoginFields;
