import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    allUsers: [],          // full users fetched from API to show in sidebar list
    chatUsers: [],         // users you have active chats with
    conversations: {},     // { conversationId: [messages...] }
    activeChat: null,      // conversationId
    loading: false,
    error: null
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
        setActiveChat: (state, action) => {
            state.activeChat = action.payload;
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
            if (user) user.message = message;
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
    setLoading
} = privateChatSlice.actions;

export default privateChatSlice.reducer;
