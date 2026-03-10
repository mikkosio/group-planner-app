import { formatUpcomingDate } from "@/utils/formatDate";
import { Group as GroupIcon } from "@mui/icons-material";
import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";

// temporary interface
interface Group {
    id: string;
    name: string;
    memberCount: number;
    nextHangoutDate: Date | null;
}

// Hardcoded groups for temp placeholder
const groups = [
    {
        id: "group-1",
        name: "Gamer boys",
        memberCount: 8,
        nextHangoutDate: new Date("2026-03-15T14:00:00")
    },
    {
        id: "group-2",
        name: "The Brokies",
        memberCount: 12,
        nextHangoutDate: null,
    },
    {
        id: "group-3",
        name: "Best Group 7",
        memberCount: 15,
        nextHangoutDate: new Date("2026-03-20T18:30:00"),
    }
];

/**
 * Create Subtitle for Group item.
 * @param group - temp interface for Group, don't know what Group object looks like yet
 * @returns JSX Element containing number of members and upcoming hangout time
 */
const getGroupSubtitle = (group: Group): React.ReactNode => {
    const memberText = `${group.memberCount} members`;
    const nextHangout = group.nextHangoutDate 
        ? formatUpcomingDate(group.nextHangoutDate) 
        : null;
    
    return (
        <>
            {memberText}
            {
                nextHangout && 
                <Typography component="span" color="warning.dark" variant="inherit">
                    {` • Next Hangout ${nextHangout}`}
                </Typography>
            }
        </>
    );
};

const GroupsList = () => {
    return (
        <>
            {/* Groups List */}
            <Typography variant="h5">Your Groups</Typography>
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
                        sx={{
                            bgcolor: "#fff",
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
                        <ListItemText primary={group.name} secondary={getGroupSubtitle(group)} />
                    </ListItemButton>
                ))}
            </List>
        </>
    );
};

export default GroupsList;