import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import useChatParams from "../../hooks/useChatParams";
import bigcat from "../../assets/svg/bigcat.svg";
import { ChannelType } from "../../modules/channel";
import { useState } from "react";
import protectedlogo from "../../assets/svg/protected.svg";
import api from "../../api/api";
import { toast } from "react-hot-toast";

function ChatProtected() {
  const activeChannel = useChatParams((state) => state.activeChannel);
  const activeChannelPassword = useChatParams(
    (state) => state.activeChannelPassword
  );
  const serActiveChannelPassword = useChatParams(
    (state) => state.setActiveChannelPassword
  );
  const [protectedChannelPass, setProtectedChannelPass] = useState(false);

  const handlePasswordInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    serActiveChannelPassword(event.target.value);
  };

  const handlePasswordConfirm = () => {
    api
      .post("/channels/auth", {
        channelId: activeChannel?.id,
        password: activeChannelPassword,
      })
      .then((response) => {
        if (response.data.success) {
          toast.success("Password correct");
          setProtectedChannelPass(true);
        } else {
          toast.error("Password incorrect");
        }
      })
      .catch((error) => {
        toast.error("Password incorrect");
      });
  };

  return (
    <>
      {protectedChannelPass && (
        <>
          <ChatMessages />
          <ChatInput />
        </>
      )}
      {!protectedChannelPass && (
        <div className="protected-channel-password-container">
          <img
            src={protectedlogo}
            alt="password protected channel"
            className="protected-channel-password-img"
          />
            <div className="confirm-protected-channel-password-container">
          <input
            type="text"
            placeholder="Password"
            className="protected-channel-password-input"
            value={activeChannelPassword}
            onChange={handlePasswordInputChange}
          />

          <button
            className="retro-button orange-header confirm-protected-channel-password"
            onClick={handlePasswordConfirm}
            >
            Confirm
          </button>
              </div>
        </div>
      )}
    </>
  );
}

export default ChatProtected;
