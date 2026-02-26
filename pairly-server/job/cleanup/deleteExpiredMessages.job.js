const cron = require('node-cron');
const Message = require('../../models/chat/Message.model');
const ChatClearLog = require('../../models/chat/ChatClearLog.model');
const Conversation = require('../../models/chat/Conversation.model');


async function deleteExpiredMessage() {
    try {

    } catch (error) {

    }
};

/**
 * Run daily at midnight (00:00)
 */
cron.schedule('0 0 * * *', async () => {
    try {
        await deleteExpiredMessage();
    } catch (_) {
        // ignore to prevent app crash
    }
})