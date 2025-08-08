import { useEffect } from 'react';
import { socket } from '@/services/socket';

export function useSocket({ onMatch, onWaiting, onMessage, onEnded }) {
  useEffect(() => {
    socket.connect();

    socket.on('random:waiting', onWaiting);
    socket.on('random:matched', onMatch);
    socket.on('random:message', onMessage);
    socket.on('random:ended', onEnded);

    return () => {
      socket.off('random:waiting', onWaiting);
      socket.off('random:matched', onMatch);
      socket.off('random:message', onMessage);
      socket.off('random:ended', onEnded);
    };
  }, [onMatch, onWaiting, onMessage, onEnded]);
}
