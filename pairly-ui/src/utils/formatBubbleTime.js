const formatBubbleTime = (timestamp) => {
    if (!timestamp) return '';

    const messageDate = new Date(timestamp);
    const now = new Date();

    const isToday =
        messageDate.getDate() === now.getDate() &&
        messageDate.getMonth() === now.getMonth() &&
        messageDate.getFullYear() === now.getFullYear();

    const isYesterday =
        messageDate.getDate() === now.getDate() - 1 &&
        messageDate.getMonth() === now.getMonth() &&
        messageDate.getFullYear() === now.getFullYear();

    if (isToday) {
        return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (isYesterday) {
        return `Yesterday, ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    return messageDate.toLocaleDateString([], { day: 'numeric', month: 'short' }) +
        ', ' +
        messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default formatBubbleTime;