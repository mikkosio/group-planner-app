import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Avatar,
    AvatarGroup,
    Container,
    Box,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const statCards = [
    { label: "Next event date" },
    { label: "# Total Events/YR" },
    { label: "# of pending votes" },
    { label: "Most Picked activity type" },
];

const actionItems = [
    { title: "Create a Group", subhead: "Start a new group with friends" },
    { title: "Manage Preferences", subhead: "Update your activity preferences" },
    { title: "Create a Plan", subhead: "Plan your next group event" },
];

const Dashboard = () => {
    return (
        <Box sx={{ bgcolor: "#f5f0fa", minHeight: "100vh" }}>
            {/* Navigation Bar */}
            <AppBar position="static" sx={{ bgcolor: "#7e57c2" }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, textAlign: "center" }}
                    >
                        Navigation Menu
                    </Typography>
                    <AvatarGroup max={3} sx={{ "& .MuiAvatar-root": { width: 30, height: 30, fontSize: 14 } }}>
                        <Avatar sx={{ bgcolor: "#90caf9" }}>U</Avatar>
                        <Avatar sx={{ bgcolor: "#ce93d8" }}>U</Avatar>
                    </AvatarGroup>
                </Toolbar>
            </AppBar>

            <Container maxWidth="sm" sx={{ pt: 3, pb: 4 }}>
                {/* Dashboard Heading */}
                <Typography
                    variant="h5"
                    sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        mb: 3,
                    }}
                >
                    THE DASHBOARD
                </Typography>

                {/* Stat Cards Grid */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                        mb: 4,
                    }}
                >
                    {statCards.map((card) => (
                        <Card
                            key={card.label}
                            sx={{
                                bgcolor: "#e0e0e0",
                                borderRadius: 2,
                                minHeight: 100,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CardContent sx={{ textAlign: "center", p: 2 }}>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 500 }}
                                >
                                    {card.label}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Action Items */}
                <List sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {actionItems.map((item) => (
                        <ListItem
                            key={item.title}
                            sx={{
                                bgcolor: "#fff",
                                borderRadius: 2,
                                boxShadow: 1,
                                py: 1.5,
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: "#7e57c2" }}>A</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.title}
                                secondary={item.subhead}
                            />
                            <ListItemSecondaryAction>
                                <Stack>
                                    <ArrowDropUpIcon fontSize="small" color="action" />
                                    <ArrowDropDownIcon
                                        fontSize="small"
                                        color="action"
                                        sx={{ mt: -1 }}
                                    />
                                </Stack>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Container>
        </Box>
    );
};

export default Dashboard;
