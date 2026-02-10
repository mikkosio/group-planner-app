import { Box, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";

const ProfileMenu = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* Icon */}
                <IconButton color="inherit" onClick={handleClick}>
                    <Avatar alt="Profile" src="" />
                    <ArrowDropDownIcon />
                </IconButton>

                {/* Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    slotProps={{
                        paper: {
                            sx: {
                                "& .MuiMenuItem-root": {
                                    pr: 5,
                                    "&:hover": {
                                        backgroundColor: "#1976d2",
                                        color: "#fff",
                                    },
                                },
                            }
                        }
                    }}
                >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose} sx={{ color: "red" }}>Logout</MenuItem>
                </Menu>
            </Box>
        </>
    )
}

export default ProfileMenu;