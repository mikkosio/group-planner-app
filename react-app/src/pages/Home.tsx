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
import GroupsList from "@/features/groups/components/GroupsList";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import InviteCodeDialog from "@/features/groups/components/InviteCodeDialog";
import FeedbackSnackbar from "@/components/FeedbackSnackbar";
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
    const navigate = useNavigate();
    const [joinDialogOpen, setJoinDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleComingSoonClick = () => {
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

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
            onClick: () => navigate("/creategroup"), // replace with actual function
        },

        {
            title: "Manage Preferences",
            subhead: "Update your activity preferences",
            icon: SettingsIcon,
            onClick: handleComingSoonClick,
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
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <Typography variant="body1">{card.label}</Typography>
                        {/* Coming Soon Ribbon */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: 15,
                                right: -35,
                                backgroundColor: "info.main",
                                color: "white",
                                padding: "4px 40px",
                                transform: "rotate(45deg)",
                                fontSize: "0.75rem",
                                fontWeight: "bold",
                                boxShadow: 2,
                                textAlign: "center",
                            }}
                        >
                            Coming Soon
                        </Box>
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

            {joinDialogOpen && (
                <InviteCodeDialog open={true} handleClose={() => setJoinDialogOpen(false)} />
            )}

            <FeedbackSnackbar
                open={snackbarOpen}
                message="Coming Soon - This feature is not yet available"
                severity="info"
                onClose={handleSnackbarClose}
            />
        </Container>
    );
};

export default Home;
