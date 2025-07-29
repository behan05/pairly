import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    connected: false,
    waiting: false,
    partnerTyping: false,
    partnerId: null,
    partnerProfile: null,
    messages: [],
};

const randomChatSlice = createSlice({
    name: "randomChat",
    initialState,
    reducers: {
        setPartnerId: (state, action) => {
            state.partnerId = action.payload;
        },
        setConnected: (state, action) => {
            state.connected = action.payload;
        },
        setWaiting: (state, action) => {
            state.waiting = action.payload;
        },
        addMessage: (state, action) => {
            const {
                message,
                senderId,
                type = 'text',
                timestamp = new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            } = action.payload;
            state.messages.push({ message, senderId, type, timestamp });
        },
        setPartnerProfile: (state, action) => {
            state.partnerProfile = action.payload;
        },
        clearMessages: (state) => {
            state.messages = [];
        },
        setPartnerTyping: (state, action) => {
            state.partnerTyping = action.payload;
        },
        resetRandomChat: () => initialState,
    },
});

export const {
    setPartnerId,
    setConnected,
    setWaiting,
    addMessage,
    clearMessages,
    resetRandomChat,
    setPartnerProfile,
    setPartnerTyping,
} = randomChatSlice.actions;

export default randomChatSlice.reducer;
