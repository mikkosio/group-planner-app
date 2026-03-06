import { alpha, AppBar, Box, Toolbar, Typography } from "@mui/material";
import MenuButton from "./MenuButton";
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import NavDropdown from "./NavDropdown";

const navbarInset = { left: 16, right: 16 };
const navbarZIndex = {
    navbar: 1300,
    backdrop: 1299
};

const routes = [
    { label: "Home", path: "/home" },
    { label: "Profile", path: "/profile" }
]

const Navbar = () => {
    const location = useLocation();
    const hideOn = ['/', '/login', '/signup'];

    const navbarRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);
    
    if (hideOn.includes(location.pathname)) return null;

    return (
        <>
            <AppBar
                ref={navbarRef}
                position="fixed"
                sx={{
                    top: 8,
                    ...navbarInset,
                    width: 'auto',
                    borderRadius: 3,
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.8),
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    zIndex: navbarZIndex.navbar
                }}
            >
                <Toolbar>
                    {/* Logo */}
                    <Typography variant="h6" sx={{ flexGrow: 1, display: "flex", justifyContent: "left"}}>
                        Gatherly
                    </Typography>
                    
                    {/* Profile */}
                    <MenuButton open={open} setOpen={setOpen} />
                </Toolbar>
            </AppBar>

            {/* Blur backdrop */}
            <Box
                onClick={() => setOpen(false)}
                sx={{
                    position: "fixed",
                    inset: 0,
                    zIndex: navbarZIndex.backdrop,
                    backdropFilter: open ? 'blur(8px)' : 'none',
                    WebkitBackdropFilter: open ? 'blur(8px)' : 'none',
                    backgroundColor: open ? 'rgba(0,0,0,0.2)' : 'transparent',
                    transition: 'backdrop-filter 0.3s ease, background-color 0.3s ease',
                }}
            />


            {/* Dropdown menu */}
            <NavDropdown 
                navbarRef={navbarRef} 
                open={open} setOpen={setOpen} 
                inset={navbarInset} 
                zIndex={navbarZIndex.navbar}
                routes={routes}
            />
        </>
        
    )
}

export default Navbar;