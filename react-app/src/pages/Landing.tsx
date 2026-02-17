import { Container, Typography, Box, Button } from "@mui/material";
import GatherlyLogo from "../assets/gatherlylogo.png";
import { Link } from "react-router-dom";
import { lightBlue } from "@mui/material/colors";

const LandingPage = () => {
    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "80vh",
                textAlign: "center",
                gap: 1
            }}
        >
            <Box
                component="img"
                src={GatherlyLogo}
                alt="Logo"
                sx={{ height: 120 }}
            />
            <Typography variant="h2" sx={{ fontWeight: "bold" }}>
                Gatherly
            </Typography>

            <Typography variant="h5" sx={{ color: "text.secondary", maxWidth: 400 }}>
                Spend less time planning and spend more time together.
            </Typography>

            <Button 
                variant="contained"
                component={Link}
                to="/signup"
                size="large"
                sx={{
                    backgroundColor: lightBlue[400],
                    color: "#fff",
                    borderRadius: 3,
                    px: 3,
                    "&:hover": {
                        backgroundColor: lightBlue[800],
                        boxShadow: ""
                    }
                }}
            >
                Join Gatherly for Free
            </Button>
        </Container>
    )
}

export default LandingPage;
