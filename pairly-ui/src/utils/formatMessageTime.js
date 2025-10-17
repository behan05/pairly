const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';

    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now - messageDate;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    // Better date comparisons
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isToday =
        messageDate.toDateString() === now.toDateString();

    const isYesterday =
        messageDate.toDateString() === yesterday.toDateString();

    const getWeek = (date) => {
        const oneJan = new Date(date.getFullYear(), 0, 1);
        return Math.ceil(((date - oneJan) / 86400000 + oneJan.getDay() + 1) / 7);
    };
    const isThisWeek = getWeek(messageDate) === getWeek(now);
    const isThisYear = messageDate.getFullYear() === now.getFullYear();

    // Time logic
    if (diffSec < 10) return 'a moment ago';
    if (diffSec < 60) return 'less than a minute ago';
    if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
    if (diffHr < 24 && isToday)
        return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;

    if (isYesterday)
        return `Yesterday at ${messageDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        })}`;

    if (isThisWeek)
        return messageDate.toLocaleDateString([], {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });

    if (isThisYear)
        return messageDate.toLocaleDateString([], {
            day: 'numeric',
            month: 'short',
        });

    return messageDate.toLocaleDateString([], {
        month: 'short',
        year: 'numeric',
    });
};

export default formatMessageTime;
