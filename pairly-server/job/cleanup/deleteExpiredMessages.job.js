const cron = require('node-cron');
const Message = require('../../models/chat/Message.model');
const ChatClearLog = require('../../models/chat/ChatClearLog.model');
const Conversation = require('../../models/chat/Conversation.model');

/*
    This job deletes expired all messages from the database.
        - If a message is expired, it will be deleted from the database.
        - If a conversation has no messages, it will be deleted from the database.
        - If a conversation has a clear log, it will be deleted from the database.
        - If a conversation has no messages and no clear log, it will be deleted from the database.
        - Max retention period is 30 days.
*/
async function deleteExpiredMessage() {
    try {
        const batchSize = 1000;
        const now = new Date();

        // while (true) {
            // Get expired messages
            
            // Delete messages in bulk

            // Find conversations that now have ZERO messages

            // Delete chat clear logs

            // Delete empty conversations
        // }
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