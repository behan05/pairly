const express = require('express');
const Routers = express.Router();

const {
    registerController,
    loginController,
    resetPasswordController,
    forgotPasswordController,
    verifyEmailOtpController,
    verifyForgotOtpController,
    resendOtpController
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
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset for user using OTP
 * @access  Public
 */
Routers.post('/reset-password', resetPasswordController);

/**
 * @route   POST /api/auth/verify-email-otp
 * @desc    Verify OTP and activate user email
 * @access  Public
 */
Routers.post('/verify-email-otp', verifyEmailOtpController);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset for user
 * @access  Public
 */
Routers.post('/forgot-password', forgotPasswordController);

/**
 * @route   POST /api/auth/verify-forgot-otp
 * @desc    Verify OTP for password reset
 * @access  Public
 */
Routers.post('/verify-forgot-otp', verifyForgotOtpController);

/**
 * @route   POST /api/auth/resend-email-otp
 * @desc    Resend OTP for password verification or reset as well
 * @access  Public
 */
Routers.post('/resend-email-otp', resendOtpController);

module.exports = Routers;
