import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import { Add, ShareOutlined } from "@mui/icons-material";
import { getGroupDetails } from "@/features/groups/api/group-details";
import type { GroupDetailsData } from "@/features/groups/api/group-details";
import ShareInviteDialog from "@/features/groups/components/ShareInviteDialog";
import axios from "axios";
import ActivitiesList from "@/features/activities/components/ActivitiesList";
import CreateActivityDialog from "@/features/activities/components/CreateActivityDialog";

const GroupDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [group, setGroup] = useState<GroupDetailsData["group"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [createActivityOpen, setCreateActivityOpen] = useState(false);

    const loadGroupDetails = async (groupId: string) => {
        try {
            setLoading(true);
            setError(null);
            const res = await getGroupDetails(groupId);
            setGroup(res.data.group);
        } catch (err: unknown) {
            let message = "Failed to load group details.";

            if (axios.isAxiosError(err) && err.response?.data?.message) {
                message = err.response.data.message;
            }

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) {
            setError("Missing group id.");
            setLoading(false);
            return;
        }
        void loadGroupDetails(id);
    }, [id]);

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!group) return null;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                }}
            >
                <Typography variant="h4">{group.name}</Typography>
                <IconButton
                    onClick={() => setShareDialogOpen(true)}
                    aria-label="share invite"
                    color="primary"
                >
                    <ShareOutlined />
                </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Created on {new Date(group.createdAt).toLocaleDateString()}
            </Typography>

            {/* Proposed Activities List */}
            <Paper
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    mb: 3,
                }}
            >
                <Box sx={{ display: "flex", mb: 1 }}>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                        Proposed Activities
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => setCreateActivityOpen(true)}
                        startIcon={<Add sx={{ width: 22, height: 22 }} />}
                        size="small"
                        sx={{
                            "& .MuiButton-startIcon": { margin: 0 },
                            minWidth: 0,
                            minHeight: 0,
                            width: 40,
                            height: 40,
                        }}
                    />
                </Box>
                <ActivitiesList groupId={group.id} />
            </Paper>

            {/* Members List */}
            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Members ({group.memberships.length})
                </Typography>
                <List>
                    {group.memberships.map((membership) => (
                        <ListItem key={membership.userId}>
                            <ListItemAvatar>
                                <Avatar src={membership.user.avatar ?? undefined}>
                                    {membership.user.name?.[0] ?? "U"}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={membership.user.name ?? membership.user.email}
                                secondary={`${membership.user.email} • ${membership.role ?? "Member"}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
            <Button variant="contained" onClick={() => navigate("/home")} sx={{ my: 2, mb: 2 }}>
                Back to Groups
            </Button>

            {/* Share Invite Dialog */}
            <ShareInviteDialog
                open={shareDialogOpen}
                onClose={() => setShareDialogOpen(false)}
                inviteCode={group.inviteCode}
            />

            {/* Create Activity Dialog */}
            <CreateActivityDialog 
                open={createActivityOpen}
                onClose={() => setCreateActivityOpen(false)}
                groupId={group.id}
                loadGroupDetails={loadGroupDetails}
            />
        </Container>
    );
};

export default GroupDetails;
