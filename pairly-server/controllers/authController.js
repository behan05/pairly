const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');
const Subscription = require('../models/payment/Subscription.model');

// helper email regex (reasonable strictness)
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// auth Controllers
const registerController = async (req, res) => {
  try {
    const {
      fullName,
      email: rawEmail,
      password,
      confirmPassword,
      authProvider = 'local'
    } = req.body;

    // normalize input
    const fullNameTrimmed = (fullName || '').trim();
    const email = (rawEmail || '').trim().toLowerCase();

    // Basic required fields
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Enter a valid email address' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'User already exists!' });
    }

    // Password validation for local
    if (authProvider === 'local') {
      if (!password || !confirmPassword)
        return res.status(400).json({ success: false, error: 'Password required' });
      if (password !== confirmPassword)
        return res.status(400).json({ success: false, error: 'Passwords do not match' });
    }

    // Hash password
    const hashedPassword = authProvider === 'local'
      ? await bcrypt.hash(password, await bcrypt.genSalt(10))
      : null;

    // Create user
    const user = await User.create({
      fullName: fullNameTrimmed,
      email,
      password: hashedPassword,
      authProvider,
      emailVerified: false,
    });

    // Create subscription for the user
    const subscription = await Subscription.create({
      userId: user._id,
      plan: 'free',
      status: 'active',
      paymentProvider: null,
      amount: 0
    });

    // Link subscription to user
    user.currentSubscriptionId = subscription._id;
    await user.save();

    // Send success response
    return res.status(201).json({
      success: true,
      message: 'Account created successfully!'
    });

  } catch (error) {
    console.error('registerController error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create user', detail: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password, authProvider = 'local' } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.'
      });
    }

    const user = await User.findOne({ email }).populate('currentSubscriptionId');

    // User not found
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    // Auth provider mismatch
    if (user.authProvider !== authProvider) {
      return res.status(400).json({
        success: false,
        error: `Please login with ${user.authProvider}.`
      });
    }

    // Password check (local only)
    if (authProvider === 'local') {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials.'
        });
      }
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Prepare subscription info
    const subscription = user.currentSubscriptionId;
    const subscriptionInfo = subscription ? {
      plan: subscription?.plan,
      status: subscription?.status,
      startDate: subscription?.startDate,
      endDate: subscription?.endDate,
      promoCode: subscription?.promoCode || null,
      discountAmount: subscription?.discountAmount || 0
    } : { plan: 'free', status: 'active' };

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        subscription: subscriptionInfo
      },
      token,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Error occurred while logging in',
      detail: error.message
    });
  }
};

const forgetPasswordController = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, authProvider = 'local' } = req.body;

    // Field validations
    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required!',
      });
    }

    // Find user
    const getUser = await User.findOne({ email, fullName }).lean();
    if (!getUser) {
      return res.status(404).json({
        success: false,
        error: 'User does not exist',
      });
    }

    // Password match check
    if (authProvider === 'local' && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match',
      });
    }

    // Hash new password
    const hashedPassword =
      authProvider === 'local'
        ? await bcrypt.hash(password, await bcrypt.genSalt(10))
        : null;

    // Update user
    await User.findByIdAndUpdate(
      getUser._id,
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Error occurred while resetting password',
      detail: error.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  forgetPasswordController,
};
