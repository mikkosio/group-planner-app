import { useState } from "react";
import { Card, CardContent, Typography, IconButton, Collapse, Divider } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { formatDate } from "@/utils/formatDate";
import type { Activity } from "@/types/models";
import { ThumbUp } from "@mui/icons-material";

interface ActivityCardProps {
    activity: Activity;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Card elevation={0} sx={{ width: "100%" }}>
            <CardContent
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 0, "&:last-child": { pb: 0 } }}
            >
                <div>
                    <Typography variant="subtitle1">{activity.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatDate(activity.proposedTime)}
                    </Typography>
                </div>

                <IconButton
                    onClick={() => setExpanded(!expanded)}
                    size="small"
                    aria-label="show more"
                >
                    {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </CardContent>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Divider sx={{ borderBottomWidth: 2.5, my: 1, bgcolor: "background.default" }} /> 
                <CardContent sx={{ p: 0, m: 0, position: "relative", "&:last-child": { pb: 0 } }}>
                    <Typography
                        variant="caption"
                        sx={{
                        color: "info.main",
                        fontStyle: "italic",
                        position: "absolute",
                        top: 0,
                        right: 0,
                        }}
                    >
                        proposed by {activity.user.name}
                    </Typography>

                    <Typography variant="subtitle1">{activity.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {activity.description}
                    </Typography>
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
                        {activity._count.votes} votes
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default ActivityCard;
