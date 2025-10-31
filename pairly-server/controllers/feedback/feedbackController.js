const Feedback = require('../../models/feedback/Feedback.model');
const User = require('../../models/User.model');

exports.feedbackController = async (req, res) => {
    try {
        const currentUserId = req.user?.id;
        const { rating, message, priority, feedbackType } = req.body;

        if (!currentUserId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized — access token missing',
            });
        }

        if (!feedbackType) {
            return res.status(400).json({
                success: false,
                error: 'Feedback type is required',
            });
        }

        if (!rating && !message?.trim()) {
            return res.status(400).json({
                success: false,
                error: 'At least one of rating or message is required',
            });
        }

        if (feedbackType === 'suggestion' && !priority) {
            return res.status(400).json({
                success: false,
                error: 'Priority field is required for suggestions',
            });
        }

        // Create feedback entry
        await Feedback.create({
            userId: currentUserId,
            type: feedbackType,
            rating: rating || null,
            message: message?.trim() || null,
            priority: feedbackType === 'suggestion' ? priority : null,
        });

        // If onboarding feedback, mark user flag
        if (feedbackType === 'onboarding') {
            await User.findByIdAndUpdate(currentUserId, {
                hasGivenOnboardingFeedback: true,
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Thank you for your feedback!',
        });
    } catch (error) {
        console.error('Feedback Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Something went wrong while saving feedback',
        });
    }
};
