const formatBubbleTime = (timestamp) => {
    if (!timestamp) return '';

    const messageDate = new Date(timestamp);
    const now = new Date();

    // More reliable yesterday detection (crosses month/year boundaries safely)
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isToday = messageDate.toDateString() === now.toDateString();
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();

    // Common time format options
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // ensures readable AM/PM format (you can switch to false for 24h)
    };

    // Today → only show time
    if (isToday) {
        return messageDate.toLocaleTimeString([], timeOptions);
    }

    // Yesterday → "Yesterday, 10:35 PM"
    if (isYesterday) {
        return `Yesterday, ${messageDate.toLocaleTimeString([], timeOptions)}`;
    }

    // Older → "16 Oct, 10:35 PM"
    return `${messageDate.toLocaleDateString([], {
        day: 'numeric',
        month: 'short',
    })}, ${messageDate.toLocaleTimeString([], timeOptions)}`;
};

export default formatBubbleTime;
