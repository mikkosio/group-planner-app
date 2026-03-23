import { alpha, Collapse, MenuItem, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

interface NavRoute {
    label: string;
    path: string;
}

interface NavDropdownProps {
    navbarRef: React.RefObject<HTMLDivElement | null>;
    open: boolean;
    setOpen: (open: boolean) => void;
    inset: { left: number; right: number };
    zIndex: number;
    routes: NavRoute[];
}

const NavDropdown = ({ navbarRef, open, setOpen, inset, zIndex, routes }: NavDropdownProps) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <Paper
            sx={{
                position: "fixed",
                top: (navbarRef.current?.offsetHeight ?? 0) + 13,
                ...inset,
                borderRadius: 3,
                backgroundColor: (theme) => alpha(theme.palette.primary.light, 0.8),
                zIndex: zIndex,
                "& .MuiMenuItem-root": {
                    margin: 0.5,
                    fontSize: 18,
                },
                "& .MuiMenuItem-root.logout": {
                    color: "error.main",
                    fontWeight: 900,
                },
            }}
        >
            <Collapse in={open} timeout={300} easing="cubic-bezier(0.16, 1, 0.3, 1)">
                {routes.map((route: NavRoute) => (
                    <MenuItem
                        key={route.path}
                        onClick={() => {
                            setOpen(false);
                            navigate(route.path);
                        }}
                    >
                        {route.label}
                    </MenuItem>
                ))}
                <MenuItem
                    className="logout"
                    onClick={() => {
                        setOpen(false);
                        logout();
                    }}
                >
                    Logout
                </MenuItem>
            </Collapse>
        </Paper>
    );
};

export default NavDropdown;
