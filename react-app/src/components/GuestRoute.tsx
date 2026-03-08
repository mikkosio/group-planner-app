import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

interface GuestRouteProps {
    children: React.ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>;
};

export default GuestRoute;
