import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { pathname } = useLocation();
    const hideNavOn = ["/", "/login", "/signup"];
    const showNav = !hideNavOn.includes(pathname) && !pathname.startsWith("/invite");
    return (
        <>
            {showNav && <Navbar />}
            <Box sx={{ pt: showNav ? 10 : 0 }}>{children}</Box>
        </>
    );
};

export default Layout;
