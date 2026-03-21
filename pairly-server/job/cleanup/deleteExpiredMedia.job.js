const cron = require('node-cron');
const Message = require('../../models/chat/Message.model');
const Conversation = require('../../models/chat/Conversation.model');
const ChatClearLog = require('../../models/chat/ChatClearLog.model');
const cloudinary = require('../../lib/cloudinary');

/*
    This job deletes expired media files from the database and Cloudinary.
        - If a media file is expired, it will be deleted from the database and Cloudinary.
        - Max retention period is 30 days.
*/
async function deleteExpiredMedia() {
    try {
        // deleting media in match max limit 500
        const batchSize = 500;

        // while (true) {
        //     const expired = await Message.find({
        //         deleteAt: {
        //             $lte: Date.now()
        //         }
        //     })
        // }

        // delete from cloudinary


        // delete from DB

    } catch (error) {

    }
};

/**
 * Run daily at midnight (00:00)
 */
cron.schedule('0 0 * * *', async () => {
    try {
        await deleteExpiredMedia();
    } catch (_) {
        // ignore to prevent app crash
    }
})
