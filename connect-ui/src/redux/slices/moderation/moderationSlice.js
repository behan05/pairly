import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Block-related state
    blockedUsers: [],
    isBlocking: false,

    // Report-related state
    reportedUsers: [],
    isReporting: false,

    // Global error or status
    error: null
}

const moderationSlice = createSlice({
    name: 'moderation',
    initialState,
    reducers: {
        setBlockedUsers: (state, action) => {
            state.blockedUsers = action.payload;
            state.isBlocking = false;
            state.error = null
        },

        setIsBlocking: (state) => {
            state.isBlocking = true;
            state.error = null
        },

        setBlockingDone: (state) => {
            state.isBlocking = false;
        },

        setReportedUsers: (state, action) => { },

        setIsReporting: (state, action) => { },

        setModerationError: (state, action) => {
            state.isBlocking = false;
            state.error = action.payload;
        },

        clearBlockedState: (state, action) => {
            state.isBlocking = false;
            state.blockedUsers = state.blockedUsers.filter(block => block.blockedUserId !== action.payload);
        },
    }
});

export const {
    setBlockedUsers,
    setIsBlocking,
    setReportedUsers,
    setIsReporting,
    setModerationError,
    setBlockingDone,
    clearBlockedState
} = moderationSlice.actions;
export default moderationSlice.reducer;