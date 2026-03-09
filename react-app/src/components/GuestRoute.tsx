import { Box, CircularProgress } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

interface GuestRouteProps {
    children: React.ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (user) {
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>;
};

export default GuestRoute;
