const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';

    const messageDate = new Date(timestamp);
    const now = new Date();

    const isToday =
        messageDate.getDate() === now.getDate() &&
        messageDate.getMonth() === now.getMonth() &&
        messageDate.getFullYear() === now.getFullYear();

    if (isToday) {
        // Show time if sent today
        return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        // Show date if older than today
        return messageDate.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    }
};

export default formatMessageTime;