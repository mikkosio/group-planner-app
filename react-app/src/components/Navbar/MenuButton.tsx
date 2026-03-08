import { Box, Avatar, Button } from "@mui/material";

interface MenuButtonProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const HamburgerIcon = ({ open }: { open: boolean }) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "4.5px", width: 18 }}>
        {[0, 1, 2].map((i) => (
            <Box
                key={i}
                sx={{
                    display: "block",
                    height: 2,
                    bgcolor: "secondary.light",
                    borderRadius: 1,
                    width: i === 2 ? 12 : 18,
                    transition: "transform 0.22s ease, opacity 0.22s ease, width 0.22s ease",
                    ...(open &&
                        i === 0 && { transform: "translateY(6.5px) rotate(45deg)", width: 18 }),
                    ...(open && i === 1 && { opacity: 0 }),
                    ...(open &&
                        i === 2 && { transform: "translateY(-6.5px) rotate(-45deg)", width: 18 }),
                }}
            />
        ))}
    </Box>
);

const MenuButton = ({ open, setOpen }: MenuButtonProps) => {
    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                    onClick={() => setOpen(!open)}
                    disableRipple
                    sx={{
                        background: "rgba(255,255,255,0.3)",
                        border: "1.5px solid",
                        borderColor: "rgba(255,255,255,0.3)",
                        borderRadius: 10,
                        gap: 1,
                        pt: 0.5,
                        pb: 0.5,
                        pl: 0.5,
                    }}
                >
                    <Avatar
                        alt="Profile"
                        src=""
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "secondary.main",
                            color: "primary.dark",
                            fontSize: 12,
                            fontWeight: 800,
                        }}
                    />
                    <HamburgerIcon open={open} />
                </Button>
            </Box>
        </>
    );
};

export default MenuButton;
