import { createSlice } from "@reduxjs/toolkit";

/**
 * Initial state for anonymous chat slice
 * - connected: whether user is connected to a chat
 * - waiting: whether user is waiting for a match
 * - partnerTyping: typing status of chat partner
 * - partnerId: ID of matched partner
 * - messages: array of chat messages
 */
const initialState = {
    connected: false,
    waiting: false,
    error: '',
    partnerTyping: false,
    partnerId: null,
    messages: [],
}

/**
 * Redux slice for anonymous chat feature
 * - Handles connection, matching, messaging, typing, and state reset
 */
const anonymousChatSlices = createSlice({
    name: 'anonymousChat',
    initialState,

    reducers: {
        setWaiting: (state, action) => {
            state.waiting = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setPartnerId: (state, action) => {
            state.partnerId = action.payload;
        },
        setConnected: (state, action) => {
            state.connected = action.payload;
        },
        addMessage: (state, action) => {

        },
        clearMessages: (state) => {
            state.messages = []
        },
        setPartnerTyping: (state, action) => {
            state.partnerTyping = action.payload;
        },
        resetAnonymousState: (state) => {
            state.connected = false;
            state.error = '';
            state.waiting = false;
            state.partnerId = null;
            state.partnerTyping = false;
            state.messages = [];
        }
    }
});

export const { 
    setWaiting,
    setError,
    setPartnerId,
    setConnected,
    addMessage,
    clearMessages,
    setPartnerTyping,
    resetAnonymousState
} = anonymousChatSlices.actions;
export default anonymousChatSlices.reducer