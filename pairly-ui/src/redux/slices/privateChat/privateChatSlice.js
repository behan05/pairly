import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    allUsers: [],          // full users fetched from API to show in sidebar list
    chatUsers: [],         // users you have active chats with
    conversations: {},     // { conversationId: { messages: [...] } }
    unreadCount: {},       // {conversationId,partnerId, unreadMessageCount}
    activeChat: null,      // conversationId
    activePartnerId: null, // active partner id
    partnerTyping: {},
    proposalData: {},
    proposalSelectedMusic: '',
    proposalMusic: [],
    loading: false,
    error: null,
};

const privateChatSlice = createSlice({
    name: 'privateChat',
    initialState,
    reducers: {
        setAllUsers: (state, action) => {
            state.allUsers = Array.isArray(action.payload) ? action.payload : [];
        },

        setActivePartnerId: (state, action) => {
            state.activePartnerId = action.payload;
        },

        addChatUser: (state, action) => {
            const newUser = action.payload;
            if (!newUser || !newUser.partnerId) return;

            const idx = state.chatUsers.findIndex(u => u.partnerId === newUser.partnerId);
            if (idx === -1) {
                state.chatUsers.push({
                    partnerId: newUser.partnerId,
                    conversationId: newUser.conversationId ?? null,
                    isOnline: newUser.isOnline ?? false,
                    lastSeen: newUser.lastSeen ?? null
                });
            } else {
                // merge updates
                state.chatUsers[idx] = {
                    ...state.chatUsers[idx],
                    ...newUser
                };
            }
        },

        setUnreadCount: (state, action) => {
            const { conversationId, partnerId, count } = action.payload;
            if (!conversationId || partnerId == null || count == null) return;

            state.unreadCount[conversationId] = {
                partnerId,
                count
            };
        },

        setConversationMessages: (state, action) => {
            const { conversationId, messages } = action.payload;
            if (!conversationId) return;
            state.conversations[String(conversationId)] = { messages: Array.isArray(messages) ? messages : [] };
        },

        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setPartnerTyping: (state, action) => {
            const { partnerId, isTyping } = action.payload;
            if (!partnerId) return;
            state.partnerTyping[partnerId] = isTyping;
        },

        addMessage: (state, action) => {
            const { conversationId, message } = action.payload;
            if (!conversationId || !message) return;

            const cid = String(conversationId);

            // ensure conversation object exists with messages array
            if (!state.conversations[cid]) {
                state.conversations[cid] = { messages: [] };
            }

            const msgs = state.conversations[cid].messages;
            if (!Array.isArray(msgs)) {
                state.conversations[cid].messages = [];
            }

            // Prevent duplicate messages by _id
            if (message._id) {
                const exists = state.conversations[cid].messages.some(m => m._id === message._id);
                if (exists) return;
            }

            // Push new message
            state.conversations[cid].messages.push(message);

            // Update sidebar's user list in real-time
            if (state.allUsers?.length) {
                const matchedUser = state.allUsers.find(u => u.conversationId === conversationId);
                if (matchedUser) {
                    matchedUser.lastMessage = message || {};
                    matchedUser.lastMessageTime = message.createdAt;
                }
            }
        },

        updateMessagesAsRead: (state, action) => {
            const { conversationId, messageIds } = action.payload;
            if (!conversationId || !Array.isArray(messageIds)) return;
            const cid = String(conversationId);
            if (!state.conversations[cid]) return;

            state.conversations[cid].messages = state.conversations[cid].messages.map(msg =>
                messageIds.includes(msg._id) ? { ...msg, seen: true } : msg
            );
        },

        setError: (state, action) => {
            state.error = action.payload ?? null;
            state.loading = false;
        },

        setProposalData: (state, action) => {
            state.proposalData = { ...state.proposalData, ...action.payload };
        },

        resetProposalData: (state) => {
            state.proposalData = {};
        },

        setProposalMusic: (state, action) => {
            state.proposalMusic = Array.isArray(action.payload) ? action.payload : [];
        },

        clearProposalMusic: (state) => {
            state.proposalMusic = [];
        },

        setProposalSelectedMusic: (state, action) => {
            state.proposalSelectedMusic = action?.payload;
        },

        reset: (state) => {
            state.allUsers = [];
            state.chatUsers = [];
            state.conversations = {};
            state.activeChat = null;
            state.loading = false;
            state.error = null;
        }
    }
});

export const {
    setAllUsers,
    addChatUser,
    setActiveChat,
    addMessage,
    setUnreadCount,
    setPartnerTyping,
    setError,
    reset,
    setLoading,
    setConversationMessages,
    updateMessagesAsRead,
    setActivePartnerId,
    setProposalData,
    resetProposalData,
    setProposalMusic,
    clearProposalMusic,
    setProposalSelectedMusic
} = privateChatSlice.actions;

export default privateChatSlice.reducer;

export const totalNumberOfUnreadMessages = (state) => {
    const { conversations } = state.privateChat;
    if (!conversations) return 0;

    // Sum all messages that are not seen
    return Object.values(conversations).reduce((total, conv) => {
        if (!conv.messages) return total;
        const unseen = conv.messages.filter(msg => !msg.seen).length;
        return total + unseen;
    }, 0);
};

