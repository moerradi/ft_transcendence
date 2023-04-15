import React from 'react';
import { useState } from 'react';
import ClassButton from '../ClassButton';
import Popup from '../Popup';
import CreateChat from '../CreateChat';
import useChatParams from '../../hooks/useChatParams';
import api from '../../api/api';
import Channel from '../../modules/channel';

function ChatSearchPlus() {
  const [showOptions, setShowOptions] = useState(false);
  const setChannelList = useChatParams((state) => state.setChannelList);

  const handlePlusNewChat = () => {
    setShowOptions(true);
  };

  const handleClosePopup = () => {
    setShowOptions(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    api.get(`/channels/search?q=${e.target.value}`).then((response) => {
      const channelList: Channel[] = response.data.map(
        (channel: any) =>
          new Channel(
            channel.id,
            channel.name,
            channel.owner_id,
            channel.type,
            channel.icon_url,
            channel.password,
            channel.isAdmin,
            channel.isOwner
          )
      );
      setChannelList(channelList);
    });
  };

  return (
    <div className="chat-search-plus">
      <input
        className="chat-search-plus-input"
        type="text"
        placeholder="Search"
        onChange={handleSearch}
      />
      <ClassButton
        name="+"
        classes="chat-plus-button"
        onClick={handlePlusNewChat}
      />
      {/* {showOptions && <BlurredBackground />} */}
      {showOptions && (
        <Popup
          onClose={handleClosePopup}
          content={<CreateChat onClose={handleClosePopup} />}
        />
      )}
    </div>
  );
}

export default ChatSearchPlus;
