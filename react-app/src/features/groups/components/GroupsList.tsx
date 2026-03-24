import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import { getGroupDetails } from "@/features/groups/api/group-details";
import { Group as GroupIcon } from "@mui/icons-material";
import {
    Alert,
    Avatar,
    CircularProgress,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import type { ApiResponse } from "@/types/api";

type MyGroupBase = {
    id: string;
    name: string;
};

type MyGroupsData = {
    groups: MyGroupBase[];
};

type GroupListItem = {
    id: string;
    name: string;
    memberCount: number;
};

const GroupsList = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState<GroupListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadGroups = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = (await api.get("/groups")) as ApiResponse<MyGroupsData>;
                const baseGroups = res.data.groups;

                const groupsWithCounts = await Promise.all(
                    baseGroups.map(async (group) => {
                        const detail = await getGroupDetails(group.id);
                        return {
                            id: group.id,
                            name: group.name,
                            memberCount: detail.data.group.memberships.length,
                        };
                    }),
                );

                setGroups(groupsWithCounts);
            } catch (err: unknown) {
                const message =
                    typeof err === "object" &&
                    err !== null &&
                    "response" in err &&
                    typeof (err as { response?: { data?: { message?: unknown } } }).response?.data
                        ?.message === "string"
                        ? (err as { response?: { data?: { message?: string } } }).response?.data
                              ?.message
                        : "Failed to load groups.";

                setError(message ?? "Failed to load groups.");
            } finally {
                setLoading(false);
            }
        };

        void loadGroups();
    }, []);
    // Contemplating centering the Group Name and member count since it looks off in desktop view
    // but is fine for mobile.
    return (
        <>
            <Typography variant="h5">Your Groups</Typography>

            {loading && <CircularProgress size={24} />}
            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && groups.length === 0 && (
                <Typography color="text.secondary">You’re not in any groups yet.</Typography>
            )}

            {!loading && !error && groups.length > 0 && (
                <List
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        alignItems: "center",
                    }}
                >
                    {groups.map((group) => (
                        <ListItemButton
                            key={group.id}
                            onClick={() => navigate(`/groups/${group.id}`)}
                            sx={{
                                bgcolor: "background.paper",
                                borderRadius: 2,
                                py: 1.5,
                                width: "100%",
                                boxShadow: 5,
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: "primary.main" }}>
                                    <GroupIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={group.name}
                                secondary={`${group.memberCount} members`}
                            />
                        </ListItemButton>
                    ))}
                </List>
            )}
        </>
    );
};

export default GroupsList;
