import { AppBar, Toolbar, Typography } from "@mui/material";
import ProfileMenu from "./ProfileMenu";

const Navbar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                {/* Logo */}
                <Typography variant="h6" sx={{ flexGrow: 1, display: "flex", justifyContent: "left"}}>
                    Gatherly
                </Typography>
                
                {/* Profile */}
                <ProfileMenu />
            </Toolbar>

        </AppBar>
    )
}

export default Navbar;