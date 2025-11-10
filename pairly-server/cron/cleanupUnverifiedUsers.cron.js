const cron = require('node-cron');
const User = require('../models/User.model');

const deleteUnverifiedUsers = async () => {
    try {
        const result = await User.deleteMany({
            emailVerified: false,
            createdAt: {
                $lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // older than 24h
            },
        });

        console.log(`[CRON] Deleted ${result.deletedCount} unverified users.`);
    } catch (error) {
        console.error({
            success: false,
            error: 'Failed to delete unverified users via cron job',
            details: error.message,
        });
    }
};

/**
 * Run daily at midnight (00:00)
 */
cron.schedule('0 0 * * *', async () => {
    try {
        await deleteUnverifiedUsers();
    } catch (_) {
        // ignore to prevent app crash
    }
});
