import {
    Avatar,
    Box,
    Card,
    Container,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import EventIcon from "@mui/icons-material/Event";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";

// hardcoded card statistics, replace in future
const statistics = [
    { label: "No Upcoming Hangout" },
    { label: "# Total Hangouts" },
    { label: "# of Pending Votes" },
    { label: "Most Picked Activity" },
];

const actions = [
    { 
        title: "Create a Hangout Plan",
        subhead: "Plan your next group event",
        icon: <EventIcon />,
        onClick: () => console.log("Create Hangout clicked") // replace with actual function
    },
        
    { 
        title: "Create a Group",
        subhead: "Start a new group with friends",
        icon: <PersonAddIcon />,
        onClick: () => console.log("Create Group clicked") // replace with actual function
    },
    {
        title: "Manage Preferences",
        subhead: "Update your activity preferences",
        icon: <SettingsIcon />,
        onClick: () => console.log("Manage Preferences clicked") // replace with actual function
    },
];

const Home = () => {
    return (
        <Container
            maxWidth={false}
            sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 3,
                overflow: "hidden",
            }}
        >
            <Typography variant="h4">Your Dashboard</Typography>

            {/* Card Statistics */}
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {statistics.map((card) => (
                    <Card
                        key={card.label}
                        sx={{
                            backgroundColor: grey[50],
                            height: 150,
                            width: 150,
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: grey[900],
                            borderRadius: 4,
                            p: 3,
                            boxShadow: 5,
                        }}
                    >
                        {card.label}
                    </Card>
                ))}
            </Box>

            {/* Action Items */}
            <List
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                }}
            >
                {actions.map((action) => (
                    <ListItemButton
                        key={action.title}
                        onClick={action.onClick}
                        sx={{
                            bgcolor: "#fff",
                            borderRadius: 2,
                            py: 1.5,
                            width: "100%",
                            maxWidth: 800,
                            boxShadow: 5,
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "#7e57c2" }}>{action.icon}</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={action.title} secondary={action.subhead} />
                    </ListItemButton>
                ))}
            </List>
        </Container>
    );
};

export default Home;
