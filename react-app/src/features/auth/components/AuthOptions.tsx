import { Box, Stack, Button } from "@mui/material";
import GoogleLogo from "../../../assets/google-logo.svg";
import AppleLogo from "../../../assets/apple-logo.svg";

const AuthOptions = () => {
    return (
        <Stack spacing={2} sx={{ width: "100%" }} >
            <Button
                variant="outlined"
                startIcon={<Box component="img" src={GoogleLogo} alt="Google logo" sx={{ height: 20 }} />}
                sx={{
                    color: "black",
                    borderColor: "gray"
                }}
            >
                Sign in with Google
            </Button>
            <Button
                variant="outlined"
                startIcon={<Box component="img" src={AppleLogo} alt="Google logo" sx={{ height: 24 }} />}
                sx={{
                    color: "black",
                    borderColor: "gray",
                }}
            >
                Sign in with Apple
            </Button>
        </Stack >
    )
}

export default AuthOptions;