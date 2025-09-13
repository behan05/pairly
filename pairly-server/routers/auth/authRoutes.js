// Auth Routes
const express = require('express');
const Routers = express.Router();

const {
    registerController,
    loginController,
    forgetPasswordController
} = require('../../controllers/authController');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
Routers.post('/register', registerController);

/**
 * @route   POST /api/auth/login
 * @desc    Login existing user
 * @access  Public
 */
Routers.post('/login', loginController);

/**
 * @route   POST /api/auth/forgetPassword
 * @desc    Request password reset for user
 * @access  Public
 */
Routers.post('/forgot-password', forgetPasswordController);

module.exports = Routers;
