const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';

    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now - messageDate;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);

    const isToday =
        messageDate.getDate() === now.getDate() &&
        messageDate.getMonth() === now.getMonth() &&
        messageDate.getFullYear() === now.getFullYear();

    const isYesterday =
        messageDate.getDate() === now.getDate() - 1 &&
        messageDate.getMonth() === now.getMonth() &&
        messageDate.getFullYear() === now.getFullYear();

    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHr < 24 && isToday) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
    if (isYesterday) return `Yesterday at ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    return messageDate.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
};

export default formatMessageTime;