import { Card, CardContent, Typography, Divider } from "@mui/material";
import { formatDate } from "@/utils/formatDate";
import type { Activity } from "@/types/models";
import { ThumbUp } from "@mui/icons-material";
import { useState } from "react";

interface ActivityCardProps {
    activity: Activity;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
    const [expanded, setExpanded] = useState(false);

    const maxLength = 60;
    const isLong = (activity.description?.length ?? 0) > maxLength;
    const description = expanded ? activity.description : (activity.description && activity.description.slice(0, maxLength).trim());
    return (
        <Card elevation={0} sx={{ width: "100%" }}>
            <CardContent
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 0, "&:last-child": { pb: 0 } }}
            >
                <div>
                    <Typography variant="subtitle1">
                        {activity.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatDate(activity.proposedTime)}
                    </Typography>
                </div>
            </CardContent>

            <Divider sx={{ borderBottomWidth: 2.5, my: 1, bgcolor: "background.default" }} /> 
            <CardContent sx={{ p: 0, m: 0, position: "relative", "&:last-child": { pb: 0 } }}>
                <Typography
                    variant="caption"
                    sx={{
                        color: "info.main",
                        fontStyle: "italic",
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                    }}
                >
                    proposed by {activity.user.name}
                </Typography>
                
                {activity.description && (
                    <Typography variant="body2" color="text.secondary">
                        {description}
                        {(isLong && !expanded) && "..."}
                        {isLong && (
                            <Typography
                                variant="inherit"
                                component="span"
                                onClick={() => setExpanded((prev) => !prev)}
                                sx={{
                                    color: "primary.main",
                                    cursor: "pointer",
                                }}
                            >
                                {expanded ? " Show less" : " Read more"}
                            </Typography>
                        )}
                    </Typography>
                )}
                <Typography
                    variant="caption"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "success.main",
                        mt: 1.5,
                    }}
                >
                    <ThumbUp color="success" fontSize="small" />
                    {activity._count.votes}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ActivityCard;
