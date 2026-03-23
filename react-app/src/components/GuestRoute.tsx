import { Box, CircularProgress } from "@mui/material";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

interface GuestRouteProps {
    children: React.ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (user && !location.state?.from) {
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>;
};

export default GuestRoute;
