import { useContext, useEffect, useState } from 'react';
import ImgButton from '../ImgButton';
import le_chat from './../../assets/svg/le_chat.svg';
import ChatSocketContext from '../ChatContext';
import useChatParams from '../../hooks/useChatParams';
import { useAuth } from '../../useAuth';
import { toast } from 'react-hot-toast';

function ChatInput() {
  const [message, setMessage] = useState<string>('');
  const socket = useContext(ChatSocketContext);
  const activeChannel = useChatParams((state) => state.activeChannel);
  const {user} = useAuth();
  const [isMuted, setIsMuted] = useState<boolean>(activeChannel?.isMuted ?? false);
  const setChannelIsMuted = useChatParams((state) => state.setChannelIsMuted);
  useEffect(() => {
    socket.on('channel:mute', (data) => {
      // console.log('channel:mute', data);
      setChannelIsMuted(data.channel_id, true);
      if (data.channel_id === activeChannel?.id && data.user_id === user?.id) {
        toast.error(`You have been muted for 1 minute`);
        setIsMuted(true);
      }
    });
    //
    socket.on('channel:unmute', (data) => {
      toast.success(`You have been unmuted`);
      // console.log('channel:unmute', data);
      setChannelIsMuted(data.channel_id, false);
      if (data.channel_id === activeChannel?.id && data.user_id === user?.id) {
        toast.success(`You have been unmuted`);
        setIsMuted(false);
      }
    });
    return () => {
      socket.off('channel:mute');
    }
  }, [socket, activeChannel, user, setChannelIsMuted]);
  
  useEffect(() => {
    if (activeChannel) {
      setIsMuted(activeChannel.isMuted);
    }
  }, [activeChannel]);

  const handleSend = () => {
    console.log('Send :' + message);
    socket.emit('channel:message', { message, id: activeChannel?.id });
    setMessage('');
  };

  return (
    <div className="chat-msg-input">
     { isMuted &&
        <input
            type="text"
            placeholder="On Timeout..."
            className='chat-msg-input-input disabled-input'
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            disabled
          /> 
      }
      { !isMuted &&
        <input
            type="text"
            placeholder="write a something..."
            className="chat-msg-input-input"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          /> 
      }
      <div className="send-message">
        <ImgButton
          classes="send-button backgroundless-image-button"
          src={le_chat}
          alt={'Send message button'}
          onClick={handleSend}
        />
      </div>
    </div>
  );
}

export default ChatInput;
