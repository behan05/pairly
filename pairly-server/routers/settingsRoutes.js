const Routers = require('express').Router();
const settingsController = require('../controllers/settingsController');
const ticketSupportController = require('../controllers/support-ticket/SupportTicket');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * ========================
 *  Bug Reports & Help
 * ========================
 */

// ======================== Create Support Ticket API =====================
/**
 * @route   POST /api/settings/contact-support
 * @desc    Support ticket raise by user
 * @access  Private
 */
Routers.post('/contact-support', authMiddleware, ticketSupportController.createSupportTicket);
/**
 * @route   GET /api/settings/contact-support
 * @desc    Getting raised tickets
 * @access  Private
 */
Routers.get('/contact-support', authMiddleware, ticketSupportController.getSupportTicket);

// ======================== Setting Support API =====================
/**
 * @route   POST /api/settings/report-problem
 * @desc    Submit a bug or problem report
 * @access  Public / private
 */
Routers.post('/report-problem', settingsController.bugReport);

/**
 * ========================
 *  Account Management
 * ========================
 */

/**
 * @route   PATCH /api/settings/change-credentials
 * @desc    Change email/password or other credentials
 * @access  Private
 */
Routers.patch('/change-credentials', authMiddleware, settingsController.changeCredentials);

/**
 * @route   GET /api/settings/request-info
 * @desc    Request downloadable copy of account info
 * @access  Private
 */
Routers.get('/request-info', authMiddleware, settingsController.requestInfo);

/**
 * @route   DELETE /api/settings/delete-account
 * @desc    Permanently delete account
 * @access  Private
 */
Routers.delete('/delete-account', authMiddleware, settingsController.deleteAccount);


/**
 * ========================
 *  Privacy Settings
 * ========================
 */

/**
 * @route   PATCH /api/settings/privacy-settings
 * @desc    Update privacy preferences
 * @access  Private
 */
Routers.patch('/privacy-settings', authMiddleware, settingsController.updatePrivacy);

/**
 * @route   GET /api/settings/privacy-settings
 * @desc    Get current privacy settings
 * @access  Private
 */
Routers.get('/privacy-settings', authMiddleware, settingsController.getPrivacy);


/**
 * ========================
 *  Notification Settings
 * ========================
 */

/**
 * @route   PATCH /api/settings/notification-settings
 * @desc    Update notification preferences
 * @access  Private
 */
Routers.patch('/notification-settings', authMiddleware, settingsController.updateNotificationSettings);

/**
 * @route   GET /api/settings/notification-settings
 * @desc    Get current notification settings
 * @access  Private
 */
Routers.get('/notification-settings', authMiddleware, settingsController.getNotificationSettings);


/**
 * ========================
 *  Chat Settings
 * ========================
 */

/**
 * @route   PATCH /api/settings/chat-settings
 * @desc    Update chat-related preferences
 * @access  Private
 */
Routers.patch('/chat-settings', authMiddleware, settingsController.updateChatSettings);

/**
 * @route   GET /api/settings/chat-settings
 * @desc    Get current chat settings
 * @access  Private
 */
Routers.get('/chat-settings', authMiddleware, settingsController.getChatSettings);

module.exports = Routers;
