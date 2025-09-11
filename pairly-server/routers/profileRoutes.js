const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const profileController = require('../controllers/profileController');
const upload = require('../middlewares/multerMiddleware');

/**
 * @route   GET /api/profile/my-profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/my-profile', authMiddleware, profileController.getMyProfileController);

/**
 * @route   PATCH /api/profile/general-info
 * @desc    Update user's general info (with optional profile image)
 * @access  Private
 */
router.patch(
    '/general-info',
    authMiddleware,
    upload.single('profileImage'),
    profileController.updateGeneralInfoController
);

/**
 * @route   PATCH /api/profile/matching-preferences
 * @desc    Update user's matching preferences
 * @access  Private
 */
router.patch(
    '/matching-preferences',
    authMiddleware,
    profileController.updateMatchingPreferencesController
);

/**
 * @route   PATCH /api/profile/tags-and-interests
 * @desc    Update user's tags and interests
 * @access  Private
 */
router.patch(
    '/tags-and-interests',
    authMiddleware,
    profileController.updateTagsAndInterestsController
);

module.exports = router;
