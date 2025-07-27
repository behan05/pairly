import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    connected: false,
    waiting: false,
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
            state.messages.push(action.payload);
        },
        setPartnerProfile: (state, action) => {
            state.partnerProfile = action.payload;
        },
        clearMessages: (state) => {
            state.messages = [];
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
} = randomChatSlice.actions;
export default randomChatSlice.reducer;
