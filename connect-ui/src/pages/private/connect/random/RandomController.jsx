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
  setPartnerTyping,
} from "@/redux/slices/chat/randomChatSlice";

const RandomController = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    // === Match and Connection Events ===
    socket.on("random:waiting", () => {
      dispatch(setWaiting(true));
    });

    socket.on("random:matched", ({ partnerId, partnerProfile }) => {
      dispatch(setConnected(true));
      dispatch(setPartnerId(partnerId));
      dispatch(setPartnerProfile(partnerProfile));
      dispatch(setWaiting(false));
    });

    socket.on("random:message", ({ message, senderId, type, timestamp }) => {
      const formattedTime = new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      dispatch(addMessage({
        message,
        senderId,
        type,
        timestamp: formattedTime,
      }));
    });


    // === Typing Events ===
    socket.on("random:partner-typing", (isTyping) => {
      dispatch(setPartnerTyping(isTyping));
    });


    // === Disconnection Events ===
    socket.on("random:partner-disconnected", () => {
      dispatch(setConnected(false));
      dispatch(setPartnerId(null));
      dispatch(setPartnerProfile(null));
      dispatch(clearMessages());
      dispatch(setWaiting(false));
    });

    socket.on("random:error", ({ message }) => {
      console.error("Random Chat Error:", message);
    });

    socket.on("random:disconnected", () => {
      dispatch(setConnected(false));
      dispatch(setPartnerId(null));
      dispatch(setPartnerProfile(null));
      dispatch(clearMessages());
      dispatch(setWaiting(false));
    });

    // === Manual disconnect ===
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
      socket.off("random:partner-typing");
      socket.off("random:partner-stop-typing");
      socket.off("random:partner-disconnected");
      socket.off("random:error");
      socket.off("random:disconnected");
      socket.off("random:ended");
      dispatch(resetRandomChat());
    };
  }, [dispatch]);

  return null;
};

export default RandomController;
