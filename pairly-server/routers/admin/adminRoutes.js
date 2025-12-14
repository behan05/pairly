const routes = require('express').Router();
const {
    signupController,
    loginController
} = require('../../controllers/adminPanelControllers/auth.controller');
const {
    getAllUsersController,
    getUserByIdController,
    banUserByIdController,
    unbanUserByIdController,
    deleteUserByIdController,
} = require('../../controllers/adminPanelControllers/users.controller');

// Middelware (Security)
const adminAuth = require('../../middlewares/adminAuthMiddleware');
/** 
 * ====================== ADMIN AUTH ======================
 * adminLoginController
 */
routes.post('/auth/signup', signupController);
routes.post('/auth/login', loginController);


/**
 * ====================== USERS ======================
 */

// Get all users
routes.get('/users', getAllUsersController);

// Get single user by ID to get whole details
routes.get('/users/:id', getUserByIdController);

// Ban user (block from platform)
routes.post('/users/:id/ban', adminAuth, banUserByIdController);

// Unban user
routes.post('/users/:id/unban', adminAuth, unbanUserByIdController);

// Delete user permanently
routes.delete('/users/:id', adminAuth, deleteUserByIdController);


/**
 * ====================== REPORTS (Random + Private) ======================
 */

// Get all reports
routes.get('/reports', adminAuth, (req, res) => { });

// Resolve a report
routes.post('/reports/:id/resolve', adminAuth, (req, res) => { });


/**
 * ====================== FEEDBACK ======================
 */

// Get all feedback
routes.get('/feedback', adminAuth, (req, res) => { });

// Delete feedback
routes.delete('/feedback/:id', adminAuth, (req, res) => { });


/**
 * ====================== PAYMENTS ======================
 */

// Get all transactions
routes.get('/transactions', adminAuth, (req, res) => { });


/**
 * ====================== RANDOM CHAT ======================
 */

// Get all random chat connections
routes.get('/random/connections', adminAuth, (req, res) => { });

// Get random blocks
routes.get('/random/blocks', adminAuth, (req, res) => { });

// Get random reports
routes.get('/random/reports', adminAuth, (req, res) => { });


/**
 * ====================== PRIVATE CHAT ======================
 */

// Get private chat connections
routes.get('/private/connections', adminAuth, (req, res) => { });

// Get private blocks
routes.get('/private/blocks', adminAuth, (req, res) => { });

// Get private reports
routes.get('/private/reports', adminAuth, (req, res) => { });


/**
 * ====================== SETTINGS ======================
 */

// Get platform settings
routes.get('/settings', adminAuth, (req, res) => { });

// Update platform settings
routes.put('/settings', adminAuth, (req, res) => { });


/**
 * ====================== DASHBOARD ======================
 */

routes.get('/dashboard/stats', adminAuth, (req, res) => { });


module.exports = routes;
