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
import SettingsIcon from "@mui/icons-material/Settings";
import GroupsList from "./GroupsList";
import { useAuth } from "@/providers/AuthProvider";
import InviteCodeDialog from "./InviteCodeDialog";
import { useState } from "react";
import { GroupAdd, Input } from "@mui/icons-material";

// hardcoded card statistics, replace in future
const statistics = [
    { label: "No Upcoming Hangout" },
    { label: "# Total Hangouts" },
    { label: "# of Pending Votes" },
    { label: "Most Picked Activity" },
];


const Home = () => {
    const { user } = useAuth();
    const [joinDialogOpen, setJoinDialogOpen] = useState(false);

    const actions = [
        {
            title: "Join a Group",
            subhead: "Enter a code to join an existing group",
            icon: Input,
            onClick: () => setJoinDialogOpen(true),
        },
        {
            title: "Create a Group",
            subhead: "Start a new group with friends",
            icon: GroupAdd,
            onClick: () => console.log("Create Group clicked"), // replace with actual function
        },
    
        {
            title: "Manage Preferences",
            subhead: "Update your activity preferences",
            icon: SettingsIcon,
            onClick: () => console.log("Manage Preferences clicked"), // replace with actual function
        },
    ];

    return (
        <Container
            maxWidth={false}
            sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 3,
            }}
        >
            <Typography variant="h4">
                Welcome to your Dashboard{user && `, ${user.name}`}
            </Typography>

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
                        <Typography variant="body1">{card.label}</Typography>
                    </Card>
                ))}
            </Box>

            {/* Action Items */}
            <List
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    alignItems: "stretch",
                    justifyContent: "center",
                    m: "auto",
                    width: "100%",
                }}
            >
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <ListItemButton
                            key={action.title}
                            onClick={action.onClick}
                            sx={{
                                bgcolor: "background.paper",
                                borderRadius: 2,
                                py: 1.5,
                                width: "100%",
                                maxWidth: 300,
                                boxShadow: 5,
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: "primary.main" }}>
                                    <Icon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={action.title} secondary={action.subhead} />
                        </ListItemButton>
                    );
                })}
            </List>

            <GroupsList />

            {joinDialogOpen && <InviteCodeDialog open={true} handleClose={() => setJoinDialogOpen(false)} />}
        </Container>
    );
};

export default Home;
