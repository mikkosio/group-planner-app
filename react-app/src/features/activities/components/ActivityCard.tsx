import { useState } from "react";
import { Card, CardContent, Typography, IconButton, Collapse } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { formatDate } from "@/utils/formatDate";
import type { Activity } from "@/types/models";

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
                <CardContent sx={{ p: 0, m: 0, "&:last-child": { pb: 0 }, mt: 1.5 }}>
                    {activity.description ? (
                        <Typography variant="body2" color="text.secondary">
                            {activity.description}
                        </Typography>
                    ) : (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            No additional details
                        </Typography>
                    )}
                </CardContent>
            </Collapse>
        </Card>
    );
};

export default ActivityCard;
