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

    friendRequestAcceptedMessage: '',
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
const friendRequestSlice = createSlice({
    name: 'friendRequest',
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
        setFriendRequestAcceptedMessage: (state, action) => {
            state.friendRequestAcceptedMessage = action.payload;
        },

        // Friend request list from REST API
        setFriendRequests: (state, action) => {
            state.error = null;
            state.loading = false;
            state.requests = action.payload;
        },
        setFriendRequestError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        setFriendRequestLoading: (state) => {
            state.error = null;
            state.loading = true;
        },
        clearErrorLoading: (state) => {
            state.error = null;
            state.loading = false;
        },

        removeFriendRequest: (state, action) => {
            state.requests = state.requests.filter(req => req.sender !== action.payload)
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
    setFriendRequestAcceptedMessage,
    setFriendRequests,
    setFriendRequestError,
    setFriendRequestLoading,
    clearErrorLoading,
    resetState,
    removeFriendRequest
} = friendRequestSlice.actions;

// Export reducer for store
export default friendRequestSlice.reducer;

// Pending request count selector
export const pendingFriendRequestCount = (state) => {
    let requestCount = 0;

    // Count all pending requests in the main list
    requestCount += state.friendRequest.requests.filter(
        req => req.status !== 'accepted' && req.status !== 'rejected'
    ).length;

    // Add 1 if there's a pending incoming request not in the list
    if (state.friendRequest.incomingRequest &&
        state.friendRequest.incomingRequest.status !== 'accepted' &&
        state.friendRequest.incomingRequest.status !== 'rejected'
    ) {
        requestCount += 1;
    }

    // Add 1 if there's a pending outgoing request not in the list
    if (state.friendRequest.outgoingRequest &&
        state.friendRequest.outgoingRequest.status !== 'accepted' &&
        state.friendRequest.outgoingRequest.status !== 'rejected'
    ) {
        requestCount += 1;
    }

    return requestCount;
};
