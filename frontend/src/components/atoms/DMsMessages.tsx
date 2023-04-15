import { useCallback, useContext, useEffect, useRef } from "react";
import ChatMsg from "./ChatMsg";
import useDMsParams from "../../hooks/useDMsParams";
import api from "../../api/api";
import { useAuth } from "../../useAuth";
import ChatSocketContext from "../ChatContext";

function DMsMessages() {
  const activeDMs = useDMsParams((state) => state.activeDMs);
  const activeDMsMessages = useDMsParams((state) => state.activeDMsMessages);
  const setActiveDMsMessages = useDMsParams(
    (state) => state.setActiveDMsMessages
  );
  const updateActiveDMsMessages = useDMsParams(
    (state) => state.updateActiveDMsMessages
  );
  const socket = useContext(ChatSocketContext);
  const ref = useRef<HTMLDivElement>(null);
  const auth = useAuth();
  // check if message author is the current user

  useEffect(() => {
    if (ref.current)
      ref.current.scrollTo({
        left: 0,
        top: ref.current.scrollHeight,
        behavior: "smooth",
      });
  }, [activeDMsMessages]);

  const load = useCallback(() => {
    api.get(`/message/${activeDMs?.id}`).then((response) => {
      setActiveDMsMessages(response.data);
    });
  }, [activeDMs?.id]);

  useEffect(() => {
    if (!activeDMs) return;
    load();
    socket.emit("dms:join", activeDMs?.id);
    socket.on("dms:message", (data) => {
      updateActiveDMsMessages(data);
      // safely update zustand state
    });
    return () => {
      socket.emit("dms:leave", activeDMs?.id);
      socket.off("dms:message");
    };
  }, [activeDMs?.id]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeDMsMessages]);

  return (
    <div className="chat-messages-list scrollable">
      {activeDMsMessages.map((msg, index) => {
        return (
          <ChatMsg
            content={msg.content}
            author={msg.author}
            owner={msg.author_id === auth.user?.id}
            key={index}
          />
        );
      })}
      <div ref={messagesEndRef}></div>
    </div>
  );
}

export default DMsMessages;
