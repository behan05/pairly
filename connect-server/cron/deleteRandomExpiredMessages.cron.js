const cron = require('node-cron');
const deleteExpiredRandomMessages = require('../utils/socket/deleteOldRandomMessages');

/**
 * Schedule a cron job to run the `deleteRandomExpiredMessages` function once daily at midnight (00:00).
 * Cron Expression: '0 0 * * *'
 * ┬ ┬ ┬ ┬ ┬
 * │ │ │ │ │
 * │ │ │ │ └───── Day of week (every day)
 * │ │ │ └──────── Month (every month)
 * │ │ └──────────── Day of month (every day)
 * │ └──────────────── Hour (0 = midnight)
 * └──────────────────── Minute (0)
 */

cron.schedule('0 0 * * *', async () => {
    try {
        await deleteExpiredRandomMessages();
    } catch (_) {
        // Ignore errors to prevent the app from crashing due to cron failure
        return;
    }
});