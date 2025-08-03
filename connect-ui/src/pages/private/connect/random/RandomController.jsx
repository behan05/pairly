import { useEffect } from 'react';
import { socket } from '@/services/socket';
import { useDispatch } from 'react-redux';
import {
  setConnected,
  setPartnerId,
  addMessage,
  resetRandomChat,
  clearMessages,
  setPartnerProfile,
  setWaiting,
  setPartnerTyping
} from '@/redux/slices/chat/randomChatSlice';

/**
 * RandomController component
 * - Handles socket events for random chat feature
 * - Updates Redux state based on socket events (match, message, typing, disconnect, etc.)
 * - Cleans up socket listeners on unmount
 */
const RandomController = () => {
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

    // Handle socket errors (removed debug console.log)
    socket.on('random:error', ({ message }) => {
      // Error handling can be added here
      console.log(message);
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
      dispatch(resetRandomChat());
    };
  }, [dispatch]);

  return null;
};

export default RandomController;
