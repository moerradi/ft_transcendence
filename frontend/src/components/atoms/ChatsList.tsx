import { useState } from 'react';
import { useEffect } from 'react';
import Channel from '../../modules/channel';
import useChatParams from '../../hooks/useChatParams';
import Popup from '../Popup';
import ChannelSettings from './ChannelSettings';
import ChannelMembers from './ChannelMembers';
import ChannelInvite from './ChannelInvite';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../useAuth';
import protectedlogo from '../../assets/svg/protected.svg';
import privatelogo from '../../assets/svg/private.svg';
import { ChannelType } from '../../modules/channel';

// type ChatListProps = {
// 	  chats: ChatModel[];
// }

function ChatsList() {
  const channelList = useChatParams((state) => state.channelList);
  const setChannelList = useChatParams((state) => state.setChannelList);
  const activeChannel = useChatParams((state) => state.activeChannel);
  const activeChannelSettingsSave = useChatParams((state) => state.activeChannelSettingsSave);
  const activeChannelOptions = useChatParams(
    (state) => state.activeChannelOptions
  );
  const setActiveChannel = useChatParams((state) => state.setActiveChannel);
  const setActiveChannelOptions = useChatParams(
    (state) => state.setActiveChannelOptions
  );
  const removeChannel = useChatParams((state) => state.removeChannel);
  const setActiveChannelOptionsNull = useChatParams(
    (state) => state.setActiveChannelOptionsNull
  );
  const [showSettings, setShowSettings] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showInviteToChannel, setShowInviteToChannel] = useState(false);
  const auth = useAuth();

  // const [channelType, setChannelType] = useState<ChannelType>(ChannelType.PUBLIC);
    
  useEffect(() => {
    if (!auth.user) return;
    api
      .get('/channels')
      .then((response) => {
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
              channel.isOwner,
              channel.isMuted,
            )
        );
        setChannelList(channelList);
      })
      .catch((error) => {
        console.log(error);
        toast.error('Error while fetching channels');
      });
  }, [auth.user, activeChannelSettingsSave]);
 
//   const [showAdminOptions, setShowAdminOptions] =
//     React.useState<boolean>(false);

  const handleMenuClick = (menuItem: string) => {
    console.log(menuItem);
  };

  const handleButtonClick = (itemId: number, itemName: string) => {
    console.log(`item id: ${itemId} ${itemName}`);
    setActiveChannelOptions(itemId);
  };

  const handleCloseOptions = () => {
    setActiveChannelOptions(0);
  };

  const handleLeaveChannel = () => {
    console.log('leave channel');
    if (activeChannelOptions) {
      api
        .post(`/channels/${activeChannelOptions.id}/leave`)
        .then((response) => {
          toast.success('Left channel');
          removeChannel(activeChannelOptions.id);
          setActiveChannelOptions(0);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data.message);
        });
    }
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettingsPopup = () => {
    setShowSettings(false);
    setActiveChannelOptionsNull();
  };

  const handleShowMembers = () => {
    setShowMembers(true);
  };

  const handleCloseMembers = () => {
    setShowMembers(false);
    setActiveChannelOptionsNull();
  };

  const handleShowInviteToChannel = () => {
    console.log('invite to channel');
    setShowInviteToChannel(true);
  };

  const handleCloseInviteToChannel = () => {
    setShowInviteToChannel(false);
    setActiveChannelOptionsNull();
  };

  return (
    <div className="chat-list scrollable">
      {channelList.map((item, index) => {
        const itemName = item.name;
        console.log(item);
        return (
          <div key={index}>
            {(activeChannelOptions === null ||
              activeChannelOptions?.id !== item.id) && (
              <div className="chat-list-item">
                <div className='chat-list-item-channel-type'>
                  { (item.type === ChannelType.PRIVATE) && <img className='chat-list-item-channel-type-private' src={privatelogo} alt="private channel" />}
                  { (item.type === ChannelType.PROTECTED) && <img className='chat-list-item-channel-type-private' src={protectedlogo} alt="private channel" />}
                  {/* { (channelType === "public") && <img className='chat-list-item-channel-type-private' src={privatelogo} alt="private channel" />} */}                  
                </div>
                <span
                  className="chat-list-item-name"
                  onClick={() => {
                    setActiveChannel(item.id);
                  }}
                >
                  {' '}
                  {itemName}{' '}
                </span>
                <button
                  className="three-dot-menu-button"
                  onClick={() => handleButtonClick(item.id, itemName)}
                >
                  <div className="three-dot-menu-dot"></div>
                  <div className="three-dot-menu-dot"></div>
                  <div className="three-dot-menu-dot"></div>
                </button>
              </div>
            )}
            {activeChannelOptions && activeChannelOptions.id === item.id && (
              <div className="chat-list-item-options">
                {item.isOwner && (
                  <span
                    className="chat-list-option"
                    onClick={handleShowSettings}
                  >
                    Settings
                  </span>
                )}
                {showSettings && (
                  <Popup
                    onClose={handleCloseSettingsPopup}
                    content={
                      <ChannelSettings onClose={handleCloseSettingsPopup} />
                    }
                  />
                )}
                <span className="chat-list-option" onClick={handleShowMembers}>
                  Members
                </span>
                {showMembers && (
                  <Popup
                    onClose={handleCloseMembers}
                    content={<ChannelMembers onClose={handleCloseMembers} />}
                  />
                )}
                <span
                  className="chat-list-option"
                  onClick={handleShowInviteToChannel}
                >
                  Invite
                </span>
                {showInviteToChannel && (
                  <Popup
                    onClose={handleCloseInviteToChannel}
                    content={
                      <ChannelInvite onClose={handleCloseInviteToChannel} />
                    }
                  />
                )}
                <span
                  className="chat-list-option chat-list-option-last"
                  onClick={handleLeaveChannel}
                >
                  Leave
                </span>
                <button
                  className="chat-list-options-close"
                  onClick={handleCloseOptions}
                >
                  x
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ChatsList;
