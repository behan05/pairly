import { useEffect } from "react";
import { socket } from "@/services/socket";
import { useDispatch } from "react-redux";
import {
  setConnected,
  setPartnerId,
  addMessage,
  resetRandomChat,
  clearMessages,
  setPartnerProfile,
  setWaiting,
} from "@/redux/slices/chat/randomChatSlice";

const RandomController = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Reconnect socket if not connected
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("random:waiting", () => {
      console.log("Waiting for a partner...");
      dispatch(setWaiting(true));
    });

    socket.on("random:matched", ({ partnerId, partnerProfile }) => {
      dispatch(setPartnerId(partnerId));
      dispatch(setConnected(true));
      dispatch(setWaiting(false));
      dispatch(setPartnerProfile(partnerProfile));
    });

    socket.on("random:message", ({ message, senderId, timestamp }) => {
      dispatch(addMessage({
        message,
        senderId,
        timestamp: timestamp || new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
    });

    socket.on("random:disconnected", () => {
      dispatch(setConnected(false));
      dispatch(setPartnerId(null));
      dispatch(setPartnerProfile(null));
      dispatch(clearMessages());
      dispatch(setWaiting(false));
    });

    socket.on("random:ended", () => {
      dispatch(setConnected(false));
      dispatch(setPartnerId(null));
      dispatch(setPartnerProfile(null));
      dispatch(clearMessages());
    });

    return () => {
      socket.off("random:waiting");
      socket.off("random:matched");
      socket.off("random:message");
      socket.off("random:disconnected");
      socket.off("random:ended");
      dispatch(resetRandomChat());
    };
  }, [dispatch]);

  return null;
};

export default RandomController;
