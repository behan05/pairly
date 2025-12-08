const SupportTicket = require('../../models/SupportTicket.model');

exports.createSupportTicket = async (req, res) => {
    const { fullName, email, category, subject, message } = req.body;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized access. User must be logged in.'
        })
    };

    if (!fullName || !email || !category || !subject || !message) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({
            error: 'All fields are required.',
            success: false
        });
    }

    try {
        const newSupportRequest = await SupportTicket.create(
            {
                user: currentUserId,
                fullName,
                email,
                category,
                subject,
                message,
                status: 'pending'
            }
        );
        await newSupportRequest.save();

        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({
            message: 'Your request has been submitted successfully.',
            success: true
        });

    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        console.error(error);
        return res.status(500).json({
            error: 'An error occurred while processing your request.',
            success: false,
            details: error.message
        });
    }
};

exports.getSupportTicket = async (req, res) => {
    const currentUserId = req.user?.id;

    if (!currentUserId) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized access. User must be logged in.'
        });
    }

    try {
        const tickets = await SupportTicket.find({ user: currentUserId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            tickets   // empty array if none
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch support tickets.',
            details: error.message
        });
    }
};
