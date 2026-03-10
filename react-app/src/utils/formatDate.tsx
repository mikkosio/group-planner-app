/**
 * Format a date for display
 * @param date - Date to format or null
 * @returns Formatted string like "Today", "Tomorrow", or "Mar 15"
 */
export const formatUpcomingDate = (date: Date | null): string | null => {
    if (!date) return null;

    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // Past event
    if (diffMs < 0) {
        return null;
    }

    // Display minutes if <1hour
    if (diffHours < 1) {
        const diffMins = Math.round(diffMs / (1000 * 60));
        return `in ${diffMins} ${diffMins !== 1 ? "minutes" : "minute"}`;
    }

    // Display hours remaining if <24
    if (diffHours < 24) {
        return `in ${diffHours} ${diffHours !== 1 ? "hours" : "hour"}`;
    }

    // Check if tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
        return "Tomorrow";
    }

    // Check if within the next week
    if (diffDays < 7) {
        return date.toLocaleDateString("en-US", { weekday: "long" });
    }

    // Otherwise show date
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};
