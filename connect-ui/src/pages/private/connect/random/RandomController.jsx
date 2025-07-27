import { useEffect } from "react";
import { socket } from "@/services/socket";
import { useDispatch } from "react-redux";
import {
  setConnected,
  setPartnerId,
  addMessage,
  resetRandomChat,
  clearMessages,
} from "../../../../redux/slices/chat/randomChatSlice";

const RandomController = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.connect(); // Ensure connection is established

    socket.on("random:waiting", () => {
      console.log("Waiting for a partner...");
    });

    socket.on("random:matched", ({ partnerId }) => {
      dispatch(setPartnerId(partnerId));
      dispatch(setConnected(true));
    });

    socket.on("random:message", ({ message, from }) => {
      dispatch(addMessage({
        content: message,
        senderId: from,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
    });

    socket.on("random:disconnected", () => {
      dispatch(setConnected(false));
      dispatch(setPartnerId(null));
      dispatch(clearMessages());
    });

    socket.on("random:ended", () => {
      dispatch(setConnected(false));
      dispatch(setPartnerId(null));
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
