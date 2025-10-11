const Proposal = require('../../models/proposal/Proposal.model');
const Block = require('../../models/chat/Block.model');
const Conversation = require('../../models/chat/Conversation.model');
const axios = require('axios');

exports.getAudioController = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const { musicType } = req.params;

        if (!currentUserId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        if (!musicType) {
            return res.status(400).json({ success: false, error: 'Music type required' });
        }

        // iTunes Search API endpoint
        const URL = 'https://itunes.apple.com/search';

        // Call API with query parameters
        const response = await axios.get(URL, {
            params: {
                term: musicType, // search term
                media: 'music',  // we only want music
                limit: 20        // number of results
            }
        });

        // Return results array
        return res.status(200).json({
            success: true,
            data: response.data.results || []
        });
    } catch (err) {
        console.error('Audio fetch error:', err.message);
        return res.status(500).json({ success: false, error: 'Failed to fetch audio' });
    }
};

exports.createProposalController = async (req, res) => { };
