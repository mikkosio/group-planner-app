import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const hideNavOn = ["/login", "/signup", "/invite"];
    const showNav = !hideNavOn.some(path => location.pathname.startsWith(path)) || location.pathname == "/";
    return (
        <>
            {showNav && <Navbar />}
            <Box sx={{ pt: showNav ? 10 : 0 }}>{children}</Box>
        </>
    );
};

export default Layout;
