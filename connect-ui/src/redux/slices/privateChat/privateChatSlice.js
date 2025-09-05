import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    allUsers: [],          // full users fetched from API to show in sidebar list
    chatUsers: [],         // users you have active chats with
    conversations: {},     // { conversationId: [messages...] }
    activeChat: null,      // conversationId
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
        addChatUser: (state, action) => {
            const newUser = action.payload;
            const exists = state.chatUsers.find(u => u.partnerId === newUser.partnerId);
            if (!exists) state.chatUsers.push(newUser);
            else Object.assign(exists, newUser);
        },
        setConversationMessages: (state, action) => {
            const { conversationId, messages } = action.payload;
            state.conversations[conversationId] = { messages };
        },
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
            const user = state.chatUsers.find(u => u.conversationId === action.payload);
            if (user) {
                user.unreadCount = 0;
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        addMessage: (state, action) => {
            const { conversationId, message } = action.payload;
            if (!message || !conversationId) return;

            if (!state.conversations[conversationId]) {
                state.conversations[conversationId] = { messages: [] };
            }

            state.conversations[conversationId].messages.push(message);

            const user = state.chatUsers.find(u => u.conversationId === conversationId);
            if (user) {
                user.message = message;
                if (state.activeChat !== conversationId) {
                    user.unreadCount = (user.unreadCount || 0) + 1;
                }
            }
        },
        updateMessagesAsRead: (state, action) => {
            const { conversationId, messageIds } = action.payload;
            if (!state.conversations[conversationId]) return;

            state.conversations[conversationId].messages = state.conversations[conversationId].messages.map(msg =>
                messageIds.includes(msg._id) ? { ...msg, seen: true } : msg
            );

            const user = state.chatUsers.find(u => u.conversationId === conversationId);
            if (user) {
                user.unreadCount = 0;
            }
        },
        setError: (state, action) => { state.error = action.payload; },
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
    setError,
    reset,
    setLoading,
    setConversationMessages,
    updateMessagesAsRead
} = privateChatSlice.actions;

export default privateChatSlice.reducer;
