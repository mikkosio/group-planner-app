export const formatDate = (iso: string) => {
    const date = new Date(iso);
    const datestring = date.toLocaleDateString("en-CA", {
        month: "short",
        day: "numeric",
    });
    const timestring = date.toLocaleTimeString("en-CA", {
        hour: "numeric",
        minute: "2-digit",
    });
    return `${datestring} at ${timestring}`
}