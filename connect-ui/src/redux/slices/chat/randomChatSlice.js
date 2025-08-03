import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for random chat slice
 * - connected: whether user is connected to a chat
 * - waiting: whether user is waiting for a match
 * - partnerTyping: typing status of chat partner
 * - partnerId: ID of matched partner
 * - partnerProfile: profile data of matched partner
 * - messages: array of chat messages
 */
const initialState = {
  connected: false,
  waiting: false,
  partnerTyping: false,
  partnerId: null,
  partnerProfile: null,
  messages: []
};

/**
 * Redux slice for random chat feature
 * - Handles connection, matching, messaging, typing, and state reset
 */
const randomChatSlice = createSlice({
  name: 'randomChat',
  initialState,
  reducers: {
    // Set the partner's user ID
    setPartnerId: (state, action) => {
      state.partnerId = action.payload;
    },
    // Set connection status
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    // Set waiting status
    setWaiting: (state, action) => {
      state.waiting = action.payload;
    },
    // Add a new message to the chat
    addMessage: (state, action) => {
      const {
        message,
        senderId,
        fileName,
        type = 'text',
        timestamp = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      } = action.payload;
      state.messages.push({ message, senderId, fileName, type, timestamp });
    },
    // Set partner profile data
    setPartnerProfile: (state, action) => {
      state.partnerProfile = action.payload;
    },
    // Clear all chat messages
    clearMessages: (state) => {
      state.messages = [];
    },
    // Set typing status of partner
    setPartnerTyping: (state, action) => {
      state.partnerTyping = action.payload;
    },
    // Reset all random chat state to initial
    resetRandomChat: () => ({ ...initialState })
  }
});

// Export actions for use in components
export const {
  setPartnerId,
  setConnected,
  setWaiting,
  addMessage,
  clearMessages,
  resetRandomChat,
  setPartnerProfile,
  setPartnerTyping
} = randomChatSlice.actions;

// Export reducer for store
export default randomChatSlice.reducer;
