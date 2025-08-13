import { useEffect } from 'react';

// Path: connect-ui/src/pages/private/connect/random/RandomController.jsx
import { socket } from '@/services/socket';

// Redux imports
import { useDispatch } from 'react-redux';

// Redux actions
import {
  setConnected,
  setPartnerId,
  addMessage,
  resetRandomChat,
  clearMessages,
  setPartnerProfile,
  setWaiting,
  setPartnerTyping,
  setIncomingRequest,
  clearIncomingRequest,
  setOutgoingRequest,
  clearOutgoingRequest
} from '@/redux/slices/chat/randomChatSlice';

/**
 * RandomController component
 * - Handles socket events for random chat feature
 * - Updates Redux state based on socket events (match, message, typing, disconnect, etc.)
 * - Cleans up socket listeners on unmount
 */
const RandomChatController = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Connect socket if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    // === Match and Connection Events ===
    socket.on('random:waiting', () => {
      dispatch(setWaiting(true));
    });

    socket.on('random:matched', ({ partnerId, partnerProfile }) => {
      dispatch(setConnected(true));
      dispatch(setPartnerId(partnerId));
      dispatch(setPartnerProfile(partnerProfile));
      dispatch(setWaiting(false));
    });

    // Handle incoming messages
    socket.on(
      'random:message',
      ({ message, senderId, type, timestamp, fileName = 'default.txt' }) => {
        const formattedTime = new Date(timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });

        dispatch(
          addMessage({
            message,
            senderId,
            type,
            fileName,
            timestamp: formattedTime
          })
        );
      }
    );

    // === Typing Events ===
    socket.on('random:partner-typing', (isTyping) => {
      dispatch(setPartnerTyping(isTyping));
    });

    // === Disconnection Events ===
    socket.on('random:partner-disconnected', () => {
      dispatch(setConnected(false));
      dispatch(setPartnerId(null));
      dispatch(setPartnerProfile(null));
      dispatch(clearMessages());
      dispatch(setWaiting(false));
    });

    // Handle socket errors
    socket.on('random:error', ({ message }) => {
      // Error prompt will added later..
    });

    socket.on('random:disconnected', () => {
      dispatch(setConnected(false));
      dispatch(setPartnerId(null));
      dispatch(setPartnerProfile(null));
      dispatch(clearMessages());
      dispatch(setWaiting(false));
    });

    // Manual disconnect event
    socket.on('random:ended', () => {
      dispatch(setConnected(false));
      dispatch(setPartnerId(null));
      dispatch(setPartnerProfile(null));
      dispatch(clearMessages());
    });

    // Friend Request events
    socket.on('privateChat:requestReceived', (data) => {
      dispatch(setIncomingRequest({
        requestId: data.requestId,
        from: data.from,
        status: data.status,
        createdAt: data.createdAt
      }));
    });

    socket.on('privateChat:requestAccepted', () => {
      dispatch(setOutgoingRequest({
        message: 'Request Accepted'
      }))
    });

    socket.on('privateChat:requestReject', () => {
      dispatch(clearOutgoingRequest());
    });

    socket.on('privateChat:requestCancel', () => {
      dispatch(clearIncomingRequest())
    });

    // Cleanup socket listeners and reset chat state on unmount
    return () => {
      socket.off('random:waiting');
      socket.off('random:matched');
      socket.off('random:message');
      socket.off('random:partner-typing');
      socket.off('random:partner-stop-typing');
      socket.off('random:partner-disconnected');
      socket.off('random:error');
      socket.off('random:disconnected');
      socket.off('random:ended');
      socket.off('privateChat:requestReceived');
      socket.off('privateChat:requestAccepted');
      socket.off('privateChat:requestReject');
      socket.off('privateChat:requestCancel');
      dispatch(resetRandomChat());
    };
  }, [dispatch]);

  return null;
};

export default RandomChatController;
