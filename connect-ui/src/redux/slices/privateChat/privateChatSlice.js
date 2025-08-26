import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    users: [],
    conversations: {},
    activeChat: null,
    loading: false,
    error: null
};

const privateChatSlice = createSlice({
    name: 'privateChat',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            // directly store the server response array
            state.users = action.payload;
        },
        setActiveChat: (state, action) => {
            state.activeChat = action.payload; // conversationId
        },
        addMessage: (state, action) => {
            const { conversationId, message, lastMessage } = action.payload;
            const newMessage = message || lastMessage;

            if (!newMessage) return;

            if (!state.conversations[conversationId]) {
                state.conversations[conversationId] = [];
            }
            state.conversations[conversationId].push(newMessage);

            const user = state.users.find(u => u.conversationId === conversationId);
            if (user) user.lastMessage = newMessage;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        reset: (state) => {
            state.users = [];
            state.conversations = {};
            state.activeChat = null;
            state.loading = false;
            state.error = null
        },
    }
});

export const {
    setUsers,
    setActiveChat,
    addMessage,
    setLoading,
    setError,
    reset,
} = privateChatSlice.actions;
export default privateChatSlice.reducer;