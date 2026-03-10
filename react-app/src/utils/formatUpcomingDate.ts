/**
 * Format a date for display
 * @param date - Date to format or null
 * @returns A relative or formatted string such as "in 5 minutes", "in 3 hours", "Tomorrow",
 *          a weekday name (e.g. "Monday"), or a short date like "Mar 15"; null for past dates or null input.
 */
export const formatUpcomingDate = (date: Date | null): string | null => {
    if (!date) return null;

    const now = new Date();
    const diffMs = date.getTime() - now.getTime();

    // Past event
    if (diffMs <= 0) return null;

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    // Less than 1 hour, show minutes
    if (diffHours < 1) {
        return `in ${diffMins} ${diffMins !== 1 ? "minutes" : "minute"}`;
    }

    // Less than 24 hours, show hours
    if (diffDays < 1) {
        return `in ${diffHours} ${diffHours !== 1 ? "hours" : "hour"}`;
    }

    // Check if tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
        return "Tomorrow";
    }

    // Within the next week, show weekday
    if (diffDays < 7) {
        return date.toLocaleDateString("en-US", { weekday: "long" });
    }

    // Otherwise show date
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
