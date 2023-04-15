import { useContext, useState } from "react";
import ImgButton from "../ImgButton";
import le_chat from "./../../assets/svg/le_chat.svg";
import ChatSocketContext from "../ChatContext";
import useDMsParams from "../../hooks/useDMsParams";

function DMsInput() {
  const [message, setMessage] = useState<string>("");
  const socket = useContext(ChatSocketContext);
  const activeDMs = useDMsParams((state) => state.activeDMs);

  const handleSend = () => {
    console.log("Send :" + message);
    socket.emit("dms:message", { message, id: activeDMs?.id });
    setMessage("");
  };

  return (
    <div className="chat-msg-input">
      <input
        type="text"
        placeholder="write a something..."
        className="chat-msg-input-input"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <div className="send-message">
        <ImgButton
          classes="send-button backgroundless-image-button"
          src={le_chat}
          alt={"Send message button"}
          onClick={handleSend}
        />
      </div>
    </div>
  );
}

export default DMsInput;
