const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');
const Subscription = require('../models/payment/Subscription.model');
const { nanoid } = require('nanoid');
const sendEmail = require('../utils/email/sendEmail');
const generateOTP = require('../utils/email/generateEmailOTP');

// helper email regex (reasonable strictness)
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// ==================== SIGNUP ==================
const registerController = async (req, res) => {
  const createUniqueId = nanoid(6);

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

    // create user public ID
    const publicId = fullName.split(' ')[0].toLowerCase() + '-' + createUniqueId

    // Create user
    const user = await User.create({
      fullName: fullNameTrimmed,
      email,
      password: hashedPassword,
      publicId,
      authProvider,
      emailVerified: false
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

    // Generate otp
    const generate = generateOTP();
    const otp = generate.otp;
    user.emailToken = otp;
    user.emailTokenExpires = generate.otpExpires;
    await user.save();

    // email content
    const html = `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.4; color: #111;">
    <div style="max-width: 600px; margin: 0 auto; padding: 24px">
      <h2 style="margin: 0 0 8px">Pairly Chat — Verify your email</h2>
      <p style="margin: 0 0 18px">
        Use the code below to verify your email address. It expires in <strong>5 minutes</strong>.
      </p>
      <div style="display:inline-block;padding:14px 20px;background:#f6f8fb;border-radius:8px;font-size:26px;letter-spacing:4px;margin:12px 0;">
        <strong>${otp}</strong>
      </div>
      <p style="margin:18px 0 0;font-size:13px;color:#555;">If you didn't request this, you can safely ignore this email.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:18px 0;" />
      <p style="font-size:12px;color:#888;margin:0;">Thanks —<br />Pairly Chat Team<br /><a href="mailto:support@pairly.chat">support@pairly.chat</a></p>
    </div>
  </body>
</html>
`;

    // send OTP email
    await sendEmail(
      email,
      'Verify your email — Pairly Chat',
      { text: `Your OTP is ${otp}`, html }
    );

    // Send success response
    return res.status(200)
      .json({
        success: true,
        message: `We’ve sent an OTP to ${email}. Please check your inbox and verify your email.`
      });

  } catch (error) {
    console.error('registerController error:', error);
    return res.status(500).json({ success: false, error: 'Failed to create user', detail: error.message });
  }
};

// ==================== LOGIN ==================
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

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    if (user.authProvider !== authProvider) {
      return res.status(400).json({
        success: false,
        error: `Please login using your ${user.authProvider} account.`
      });
    }

    // Case: Not verified yet
    if (user.authProvider === 'local' && !user.emailVerified) {
      const { otp, otpExpires } = generateOTP();
      user.emailToken = otp;
      user.emailTokenExpires = otpExpires;
      await user.save();

      const html = `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.4; color: #111;">
    <div style="max-width: 600px; margin: 0 auto; padding: 24px">
      <h2 style="margin: 0 0 8px">Pairly Chat — Verify your email</h2>
      <p style="margin: 0 0 18px">
        Use the code below to verify your email address. It expires in <strong>5 minutes</strong>.
      </p>
      <div style="display:inline-block;padding:14px 20px;background:#f6f8fb;border-radius:8px;font-size:26px;letter-spacing:4px;margin:12px 0;">
        <strong>${otp}</strong>
      </div>
      <p style="margin:18px 0 0;font-size:13px;color:#555;">If you didn't request this, you can safely ignore this email.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:18px 0;" />
      <p style="font-size:12px;color:#888;margin:0;">Thanks —<br />Pairly Chat Team<br /><a href="mailto:support@pairly.chat">support@pairly.chat</a></p>
    </div>
  </body>
</html>
      `;

      await sendEmail(
        email,
        'Verify your email — Pairly Chat',
        { text: `Your OTP is ${otp}`, html }
      );

      return res.status(200).json({
        success: true,
        message: 'Your account is not verified yet. We sent you a new OTP.',
        pendingEmail: email,
        isVerifyEmail: false
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials.'
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Subscription info
    const subscription = user.currentSubscriptionId;
    const subscriptionInfo = subscription
      ? {
        plan: subscription.plan,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        promoCode: subscription.promoCode || null,
        discountAmount: subscription.discountAmount || 0,
      }
      : { plan: 'free', status: 'active' };

    // Ensure public ID
    if (!user.publicId) {
      const uniqueId = nanoid(6);
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { publicId: `${user.fullName.split(' ')[0].toLowerCase()}-${uniqueId}` },
        { new: true }
      );
      user.publicId = updatedUser.publicId;
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      isVerifyEmail: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        publicId: user.publicId,
        subscription: subscriptionInfo,
        hasGivenOnboardingFeedback: user.hasGivenOnboardingFeedback,
      },
      token,
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred during login.',
      detail: error.message
    });
  }
};

// ==================== VERIFY SIGNUP OTP -- OR -- LOGIN VERIFY OTP IF NOT ==================
const verifyEmailOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ success: false, error: 'Email and OTP are required' });

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, error: 'User not found' });

    // Check token and expiry
    const currentTime = new Date();

    if (!user.emailToken || user.emailToken !== otp) {
      return res.status(400).json({ success: false, error: 'Invalid OTP' });
    }

    // Expiry check (5 minutes)
    if (!user.emailTokenExpires || currentTime > user.emailTokenExpires) {
      return res.status(400).json({ success: false, error: 'OTP expired. Please request a new one.' });
    }

    // Verify & clear token
    user.emailVerified = true;
    user.emailToken = null;
    await user.save();

    return res.status(200).json({ success: true, message: 'Email verified successfully!' });
  } catch (err) {
    console.error('verifyEmailOtpController error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ==================== RESET OTP ==================
// TODO add limit 3 max
const resendOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required. Please try again.'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found!' });
    }
    
    // Generate new OTP
    const { otp, otpExpires } = generateOTP();
    user.emailToken = otp;
    user.emailTokenExpires = otpExpires;
    await user.save();

    // Email content
    const html = `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.4; color: #111;">
    <div style="max-width: 600px; margin: 0 auto; padding: 24px">
      <h2 style="margin: 0 0 8px">Pairly Chat — Verify your email</h2>
      <p style="margin: 0 0 18px">
        Use the code below to verify your email address. It expires in <strong>5 minutes</strong>.
      </p>
      <div style="display:inline-block;padding:14px 20px;background:#f6f8fb;border-radius:8px;font-size:26px;letter-spacing:4px;margin:12px 0;">
        <strong>${otp}</strong>
      </div>
      <p style="margin:18px 0 0;font-size:13px;color:#555;">If you didn't request this, you can safely ignore this email.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:18px 0;" />
      <p style="font-size:12px;color:#888;margin:0;">Thanks —<br />Pairly Chat Team<br /><a href="mailto:support@pairly.chat">support@pairly.chat</a></p>
    </div>
  </body>
</html>
`;

    await sendEmail(
      email,
      'Verify your email — Pairly Chat',
      { text: `Your OTP is ${otp}`, html }
    );

    return res.status(200).json({
      success: true,
      message: `We’ve sent a new OTP to ${email}. Please check your inbox and verify your email.`
    });

  } catch (error) {
    console.error('resendOtpController error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to resend OTP',
      detail: error.message
    });
  }
};

// ==================== FORGOT PASSWORD ==================
const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Never reveal that user doesn’t exist
      return res.status(200).json({
        success: true,
        message: 'If this email is registered, you’ll receive an OTP shortly.'
      });
    }

    const { otp, otpExpires } = generateOTP();
    user.emailToken = otp;
    user.emailTokenExpires = otpExpires;
    await user.save();

    const html = `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.5; color: #111;">
    <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="margin: 0 0 8px;">Pairly Chat — Password Reset Verification</h2>
      <p style="margin: 0 0 18px;">
        We received a request to reset your Pairly Chat account password. 
        Please use the code below to verify your email and continue with the password reset process. 
        The code will expire in <strong>5 minutes</strong>.
      </p>
      <div style="display:inline-block; padding:14px 20px; background:#f6f8fb; border-radius:8px; font-size:26px; letter-spacing:4px; margin:12px 0;">
        <strong>${otp}</strong>
      </div>
      <p style="margin:18px 0 0; font-size:13px; color:#555;">
        If you did not request a password reset, please ignore this email — your account remains secure.
      </p>
      <hr style="border:none; border-top:1px solid #eee; margin:18px 0;" />
      <p style="font-size:12px; color:#888; margin:0;">
        Thanks,<br />
        <strong>Pairly Chat Team</strong><br />
        <a href="mailto:support@pairly.chat" style="color:#555; text-decoration:none;">support@pairly.chat</a>
      </p>
    </div>
  </body>
</html>
                `;

    await sendEmail(
      email,
      'Verify your email — Pairly Chat',
      { text: `Your OTP is ${otp}`, html }
    );

    return res.status(200).json({
      success: true,
      message: 'OTP sent to your email.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Something went wrong.' });
  }
};

// ==================== VERIFY FORGOT OTP ==================
const verifyForgotOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      emailToken: otp,
      emailTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP.' });
    }

    // OTP verified temporarily
    user.emailVerified = true;
    await user.save();

    return res.status(200).json({ success: true, message: 'OTP verified successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Something went wrong.' });
  }
};

// ==================== USER PASSWORD RESET ==================
const resetPasswordController = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Validate required fields
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required.',
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match.',
      });
    }

    // Optional: Password strength check
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long.',
      });
    }

    // Find user
    const getUser = await User.findOne({ email });
    if (!getUser) {
      return res.status(404).json({
        success: false,
        error: 'User does not exist.',
      });
    }

    // Ensure it's a local account
    if (getUser.authProvider !== 'local') {
      return res.status(400).json({
        success: false,
        error: `Password reset is not available for ${getUser.authProvider} accounts.`,
      });
    }

    // Ensure email is verified
    if (!getUser.emailVerified) {
      return res.status(400).json({
        success: false,
        error: 'Your email is not verified. Please verify your email first.',
      });
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(getUser._id, { password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully.',
    });
  } catch (error) {
    console.error('resetPasswordController error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred while resetting the password.',
      detail: error.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  resetPasswordController,
  forgotPasswordController,
  verifyEmailOtpController,
  verifyForgotOtpController,
  resendOtpController
};
