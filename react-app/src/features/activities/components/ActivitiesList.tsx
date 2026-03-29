import { useEffect, useState } from "react";
import { Hiking } from "@mui/icons-material";
import {
    Alert,
    Avatar,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    Typography,
} from "@mui/material";
import axios from "axios";
import { getAllActivities } from "@/features/activities/api/get-all-activities";
import type { Activity } from "@/types/models";
import ActivityCard from "./ActivityCard";

interface ActivitiesListProps {
    groupId: string;
}

const ActivitiesList = ({ groupId }: ActivitiesListProps) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadActivities = async (groupId: string) => {
            try {
                setLoading(true);
                setError(null);

                const res = await getAllActivities(groupId);
                const activities = res.data.activities;

                setActivities(activities);
            } catch (err: unknown) {
                let message = "Failed to fetch activities.";
                
                if (axios.isAxiosError(err) && err.response?.data?.message) {
                    message = err.response.data.message;
                }

                setError(message);
            } finally {
                setLoading(false);
            }
        };

        loadActivities(groupId);
    }, [groupId]);

    return (
        <>
            {loading && <CircularProgress size={24} />}
            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && activities.length === 0 && (
                <Typography color="text.secondary">This group has no proposals yet...</Typography>
            )}

            {!loading && !error && activities.length > 0 && (
                <List
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        alignItems: "center",
                    }}
                >
                    {activities.map((activity) => (
                        <ListItem
                            key={activity.id}
                            sx={{
                                bgcolor: "background.paper",
                                borderRadius: 2,
                                py: 2,
                                width: "100%",
                                boxShadow: 3,
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: "primary.main" }}>
                                    <Hiking />
                                </Avatar>
                            </ListItemAvatar>
                            <ActivityCard activity={activity} />
                        </ListItem>
                    ))}
                </List>
            )}
        </>
    );
};

export default ActivitiesList;
