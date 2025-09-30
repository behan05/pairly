const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';

    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now - messageDate;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    const isToday =
        messageDate.getDate() === now.getDate() &&
        messageDate.getMonth() === now.getMonth() &&
        messageDate.getFullYear() === now.getFullYear();

    const isYesterday =
        diffDay === 1 &&
        messageDate.getDate() === now.getDate() - 1 &&
        messageDate.getMonth() === now.getMonth() &&
        messageDate.getFullYear() === now.getFullYear();

    const isThisWeek = diffDay < 7;
    const isThisYear = messageDate.getFullYear() === now.getFullYear();

    // Ultra-recent activity
    if (diffSec < 10) return 'a moment ago';
    if (diffSec < 30) return 'seconds ago';
    if (diffMin < 1) return 'less than a minute ago';

    // Recent activity
    if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
    if (diffHr < 24 && isToday) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;

    // Calendar-based formatting
    if (isYesterday)
        return `Yesterday at ${messageDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        })}`;

    if (isThisWeek)
        return `${messageDate.toLocaleDateString([], {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
        })}`;

    if (isThisYear)
        return `${messageDate.toLocaleDateString([], {
            day: 'numeric',
            month: 'short',
        })}`;

    return `${messageDate.toLocaleDateString([], {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })}`;
};

export default formatMessageTime;