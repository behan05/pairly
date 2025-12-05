import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for friend requests slice
 * - incomingRequest: data for an incoming request
 * - outgoingRequest: data for an outgoing request
 * - requests: list of friend requests fetched from API
 * - loading: loading state for API calls
 * - error: error state for API calls
 */
const initialState = {
    incomingRequest: null,
    outgoingRequest: null,

    requests: [],
    loading: false,
    error: null
};

/**
 * Redux slice for friend requests
 * - Handles incoming/outgoing requests
 * - Stores request list, loading, and error states
 * - Provides reset for full state
 */
const sleepSpaceRequestSlice = createSlice({
    name: 'sleepSpaceRequest',
    initialState,
    reducers: {
        // Incoming friend request
        setIncomingRequest: (state, action) => {
            state.incomingRequest = action.payload;
        },
        clearIncomingRequest: (state) => {
            state.incomingRequest = null;
        },

        // Outgoing friend request
        setOutgoingRequest: (state, action) => {
            state.outgoingRequest = action.payload;
        },
        clearOutgoingRequest: (state) => {
            state.outgoingRequest = null;
        },

        setSleepSpaceError: (state, action) => {
            state.error = action.payload;
        },

        setSleepSpaceLoading: (state, action) => {
            state.loading = action.payload;
        },

        // Reset the entire state
        resetState: () => initialState
    }
});

// Export actions for use in components
export const {
    setIncomingRequest,
    clearIncomingRequest,
    setOutgoingRequest,
    clearOutgoingRequest,
    setSleepSpaceError,
    setSleepSpaceLoading,
    resetState,
} = sleepSpaceRequestSlice.actions;

// Export reducer for store
export default sleepSpaceRequestSlice.reducer;
