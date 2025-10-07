const ContactHelp = require('../models/ContactHelp.model');
const BugReport = require('../models/ReportProblem.model');
const Settings = require('../models/Settings.model');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const zlib = require('zlib');
const Profile = require('../models/Profile.model');
const cloudinary = require('cloudinary').v2;

exports.contactHelp = async (req, res) => {
    const { fullName, email, category, subject, message } = req.body;

    if (!fullName || !email || !category || !subject || !message) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({
            error: 'All fields are required.',
            success: false
        });
    }

    try {
        const newSupportRequest = await ContactHelp.create({ fullName, email, category, subject, message });
        await newSupportRequest.save();

        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({
            message: 'Your request has been submitted successfully.',
            success: true
        });

    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({
            error: 'An error occurred while processing your request.',
            success: false,
            details: error.message
        });
    }
};

exports.bugReport = async (req, res) => {
    const {
        issueType, title, description,
        expectedBehavior, actualBehavior,
        deviceInfo, screenshot, email,
    } = req.body;

    if (!issueType || !title || !description || !email) {
        return res.status(400).json({
            error: "All fields are required.",
            success: false
        });
    }

    try {
        const newbugReport = new BugReport({
            issueType, title, description,
            expectedBehavior, actualBehavior,
            deviceInfo, screenshot, email
        });
        await newbugReport.save();

        return res.status(201).json({
            message: 'Your bug report has been submitted successfully.',
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            error: 'An error occurred while processing your bug report.',
            success: false,
            details: error.message
        });
    }
};

exports.changeCredentials = async (req, res) => {
    const { currentPassword, newEmail, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
            error: 'All fields are required.',
            success: false
        });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            error: 'New passwords do not match.',
            success: false
        });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found.',
                success: false
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                error: 'Current password is incorrect.',
                success: false
            });
        }

        if (newEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newEmail)) {
                return res.status(400).json({
                    error: 'Invalid email format.',
                    success: false
                });
            }

            const existingUser = await User.findOne({ email: newEmail });
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return res.status(400).json({
                    error: 'Email is already in use.',
                    success: false
                });
            }

            user.email = newEmail;
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({
            message: 'Credentials updated successfully.',
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            error: 'An error occurred while updating your credentials.',
            success: false,
            details: error.message
        });
    }
};

exports.requestInfo = async (req, res) => {
    const user = await User.findById(req.user.id);
    const userProfile = await Profile.findOne({ user: req.user.id });

    if (!user || !userProfile) {
        return res.status(404).json({
            error: 'User not found.',
            success: false
        });
    }

    try {
        const userData = {
            fullName: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
            signupThrough: user.authProvider,
            profile: { ...userProfile.toObject() }
        };

        const buffer = Buffer.from(JSON.stringify(userData), 'utf-8');
        const compressed = zlib.gzipSync(buffer);

        res.setHeader('Content-Type', 'application/gzip');
        res.setHeader('Content-Disposition', `attachment; filename=your-info.json.gz`);
        return res.status(200).send(compressed);
    } catch (error) {
        return res.status(500).json({
            error: 'An error occurred while processing your request.',
            success: false
        });
    }
};

exports.deleteAccount = async (req, res) => {

    try {
        const userId = req.user.id;

        // Deleting user
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({
                error: 'User not found.',
                success: false
            });
        };

        const userProfile = await Profile.findOne({ user: userId });

        // delete profile image from Cloudinary
        if (userProfile?.profileImagePublicId) {
            await cloudinary.uploader.destroy(userProfile.profileImagePublicId);
        };

        // Delete profile and settings if they exist
        await Profile.findOneAndDelete({ user: userId });
        await Settings.findOneAndDelete({ user: userId });

        return res.status(200).json({
            message: 'Your account has been deleted successfully.',
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            error: 'An error occurred while processing your request.',
            success: false
        });
    }
};

exports.updatePrivacy = async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).json({ error: 'User ID is required.', success: false });
    }

    const {
        showProfilePic,
        showLocation,
        matchVerifiedOnly,
        allowRechat,
        blockNSFW,
        autoDeleteChats,
        allowExportData
    } = req.body;

    if (
        typeof showProfilePic !== 'boolean' ||
        typeof showLocation !== 'boolean' ||
        typeof matchVerifiedOnly !== 'boolean' ||
        typeof allowRechat !== 'boolean' ||
        typeof blockNSFW !== 'boolean' ||
        typeof autoDeleteChats !== 'boolean' ||
        typeof allowExportData !== 'boolean'
    ) {
        return res.status(400).json({ error: 'Invalid privacy settings format.', success: false });
    }

    try {
        const privacySetting = await Settings.findOne({ user: userId });

        if (!privacySetting) {
            const newSettings = new Settings({
                user: userId,
                showProfilePic,
                showLocation,
                matchVerifiedOnly,
                allowRechat,
                blockNSFW,
                autoDeleteChats,
                allowExportData
            });

            await newSettings.save();
            return res.status(201).json({
                message: 'Privacy settings created and saved.',
                privacySettings: newSettings,
                success: true
            });
        }

        privacySetting.set({
            showProfilePic,
            showLocation,
            matchVerifiedOnly,
            allowRechat,
            blockNSFW,
            autoDeleteChats,
            allowExportData
        });

        await privacySetting.save();

        return res.status(200).json({
            message: 'Privacy settings updated successfully.',
            privacySettings: privacySetting,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            error: 'An error occurred while processing your request.',
            success: false,
            details: error.message
        });
    }
};

exports.getPrivacy = async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).json({ error: 'User ID is required.', success: false });
    }

    try {
        const privacySettings = await Settings.findOne({ user: userId });

        if (!privacySettings) {
            return res.status(404).json({
                error: 'Privacy settings not found.',
                success: false
            });
        }

        return res.status(200).json({
            privacySettings,
            message: 'Privacy settings retrieved successfully.',
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            error: 'An error occurred while retrieving your privacy settings.',
            success: false,
            details: error.message
        });
    }
};

exports.updateNotificationSettings = async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).json({ error: 'User ID is required.', success: false });
    }

    const {
        newMatch,
        newMessage,
        warningAlerts,
        friendRequest,
        blockNotification
    } = req.body;

    if (
        typeof newMatch !== 'boolean' ||
        typeof newMessage !== 'boolean' ||
        typeof warningAlerts !== 'boolean' ||
        typeof friendRequest !== 'boolean' ||
        typeof blockNotification !== 'boolean'
    ) {
        return res.status(400).json({ error: 'Invalid notification settings format.', success: false });
    }

    try {
        let notificationSetting = await Settings.findOne({ user: userId });

        if (!notificationSetting) {
            notificationSetting = new Settings({
                user: userId,
                newMatch,
                newMessage,
                warningAlerts,
                friendRequest,
                blockNotification
            });

            await notificationSetting.save();
            return res.status(201).json({
                message: 'Notification settings created and saved.',
                notificationSettings: notificationSetting,
                success: true
            });
        }

        notificationSetting.set({
            newMatch,
            newMessage,
            warningAlerts,
            friendRequest,
            blockNotification
        });

        await notificationSetting.save();

        return res.status(200).json({
            message: 'Notification settings updated successfully.',
            notificationSettings: notificationSetting,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            error: 'An error occurred while processing your request.',
            success: false,
            details: error.message
        });
    }
};

exports.getNotificationSettings = async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).json({ error: 'User ID is required.', success: false });
    }

    try {
        const notificationSettings = await Settings.findOne({ user: userId });

        if (!notificationSettings) {
            return res.status(404).json({
                error: 'Notification settings not found.',
                success: false
            });
        }

        return res.status(200).json({
            notificationSettings,
            message: 'Notification settings retrieved successfully.',
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            error: 'An error occurred while retrieving your notification settings.',
            success: false,
            details: error.message
        });
    }
};

exports.getChatSettings = async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).json({ error: 'User ID is required.', success: false });
    }

    try {
        const chatSettings = await Settings.findOne({ user: userId });

        if (!chatSettings) {
            return res.status(404).json({
                error: 'Chat settings not found for this user.',
                success: false
            });
        }

        return res.status(200).json({
            chatSettings,
            message: 'Chat settings retrieved successfully.',
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            error: 'An error occurred while retrieving chat settings.',
            success: false
        });
    }
};

exports.updateChatSettings = async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
        return res.status(401).json({ error: 'User ID is required.', success: false });
    }

    const {
        messageSound,
        showTypingStatus,
        showOnlineStatus,
        showLastSeen,
        enterToSend,
        chatTheme,
        chatFontSize
    } = req.body;

    const isValid =
        typeof messageSound === 'boolean' &&
        typeof showTypingStatus === 'boolean' &&
        typeof showOnlineStatus === 'boolean' &&
        typeof showLastSeen === 'boolean' &&
        typeof enterToSend === 'boolean' &&
        ['light', 'dark'].includes(chatTheme) &&
        ['small', 'medium', 'large'].includes(chatFontSize);

    if (!isValid) {
        return res.status(400).json({
            error: 'Invalid chat settings format. Please ensure all fields are correctly formatted.',
            success: false
        });
    }

    try {
        await Settings.findOneAndUpdate(
            { user: userId },
            {
                messageSound,
                showTypingStatus,
                showOnlineStatus,
                showLastSeen,
                enterToSend,
                chatTheme,
                chatFontSize
            },
            { new: true, upsert: true }
        );

        const updatedSettings = await Settings.findOne({ user: userId });

        return res.status(200).json({
            message: 'Chat settings updated successfully.',
            chatSettings: updatedSettings,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            error: 'An error occurred while updating chat settings.',
            success: false,
            details: error.message
        });
    }
};
