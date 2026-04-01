import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
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
import axios from "axios";

type MyGroupBase = {
    id: string;
    name: string;
    memberCount: number;
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

                const mappedGroups = baseGroups.map((group) => {
                    return {
                        id: group.id,
                        name: group.name,
                        memberCount: group.memberCount,
                    };
                });
                setGroups(mappedGroups);
            } catch (err: unknown) {
                let message = "Failed to load groups.";
                
                if (axios.isAxiosError(err) && err.response?.data?.message) {
                    message = err.response.data.message;
                }

                setError(message);
            } finally {
                setLoading(false);
            }
        };

        void loadGroups();
    }, []);

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
