import { useEffect } from 'react';

import { socket } from '@/services/socket';
import { useDispatch } from 'react-redux';

import {
  setWaiting,
  setError,
  setPartnerId,
  setConnected,
  addMessage,
  clearMessages,
  setPartnerTyping,
  resetAnonymousState
} from '../../../redux/slices/anonymousChat/anonymousSlice';


/**
 * AnonymousController component
 * - Handles socket events for Anonymous chat feature
 * - Updates Redux state based on socket events (match, message, typing, disconnect, etc.)
 * - Cleans up socket listeners on unmount
 */
function AnonymousChatController() {

  const dispatch = useDispatch();

  // Connect socket if not already connected
  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on('anonymous:waiting', () => {
      console.log('waiting');
      
      dispatch(setWaiting(true));
    });

    socket.on('anonymous:error', ({ error }) => {
      dispatch(setError(error));
      dispatch(setWaiting(false));
    });

    socket.on('anonymous:matched', ({ partnerId }) => {
      dispatch(setPartnerId(partnerId))
      dispatch(setWaiting(false));
      dispatch(setError(''));
    });

    socket.on('anonymous:message', () => {

    });

    socket.on('anonymous:partner-typing', () => {

    });

    socket.on('anonymous:partner-disconnected', () => {

    });

    socket.on('anonymous:disconnected', () => {

    });

    // Manual disconnect event
    socket.on('anonymous:ended', () => {
      dispatch(resetAnonymousState());
    })

    // Cleanup socket listeners and reset chat state on unmount
    return () => {
      socket.off('anonymous:waiting');
      socket.off('anonymous:error');
      socket.off('anonymous:matched');
      socket.off('anonymous:message');
      socket.off('anonymous:partner-typing');
      socket.off('anonymous:partner-disconnected');
      socket.off('anonymous:disconnected');
      socket.off('anonymous:ended');
    }

  }, [dispatch])

}

export default AnonymousChatController;