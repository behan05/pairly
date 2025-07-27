import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    connected: false,
    partnerId: null,
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
        addMessage: (state, action) => {
            state.messages.push(action.payload);
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
    addMessage,
    clearMessages,
    resetRandomChat,
} = randomChatSlice.actions;
export default randomChatSlice.reducer;
