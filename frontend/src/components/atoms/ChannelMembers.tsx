import React, { useContext, useEffect } from 'react';
import ClassButton from '../ClassButton';
import useChatParams from '../../hooks/useChatParams';
import ChannelUser from '../../modules/channeluser';
import api from '../../api/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../useAuth';
import ChatSocketContext from '../ChatContext';

function ChannelMembers({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [showAdminOptions, setShowAdminOptions] =
    React.useState<boolean>(false);
  const [showOwnerOptions, setShowOwnerOptions] =
    React.useState<boolean>(false);
  const [memberTitle, setMemberTitle] = React.useState<string>('Mod');

  const activeChannelOptions = useChatParams().activeChannelOptions;
  const activeChannelOptionsMembers =
    useChatParams().activeChannelOptionsMembers;
  const setActiveChannelOptionsMembers =
    useChatParams().setActiveChannelOptionsMembers;

  const activeChannelMemberOptions = useChatParams().activeChannelMemberOptions;
  const setActiveChannelMemberOptions =
    useChatParams().setActiveChannelMemberOptions;
  const setActiveChannelMemberOptionsNull =
    useChatParams().setActiveChannelMemberOptionsNull;
  const chatSocket = useContext(ChatSocketContext);

  // fetch members from channel with id activeChannelOptions.id
  useEffect(() => {
    api
      .get(`/channels/${activeChannelOptions?.id}/members`)
      .then((res) => {
        setActiveChannelOptionsMembers(
          res.data.map(
            ({ status, user }: any) =>
              new ChannelUser(
                user.id,
                user.login,
                user.avatar_url.startsWith('http')
                  ? user.avatar_url
                  : process.env.REACT_APP_API_URL + 'static' + user.avatar_url,
                activeChannelOptions!.id,
                status,
                status,
                user.created_at
              )
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
    // also get my role in this channel
    api.get(`/channels/${activeChannelOptions?.id}/me`).then((res) => {
      console.log('res data me', res.data);
      if (res.data.isAdmin) {
        setShowAdminOptions(true);
      } else if (res.data.isOwner) {
        setShowAdminOptions(true);
        setShowOwnerOptions(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChannelOptions, ]);

  const handleButtonClick = (member: ChannelUser) => {
    setActiveChannelMemberOptions(member);
  };

  const handleBanMember = () => {
    // console.log('Ban Member');
    console.log(activeChannelMemberOptions?.id);
    api
      .post(`/channels/${activeChannelOptions?.id}/ban`, {
        memberId: activeChannelMemberOptions?.id,
      })
      .then((res) => {
        toast.success('User banned');
        chatSocket.emit('channel:ban', {
          channel_id: activeChannelOptions?.id,
          member_id: activeChannelMemberOptions?.id,
          member_login: activeChannelMemberOptions?.name,
        });
        setActiveChannelOptionsMembers(
          activeChannelOptionsMembers.filter(
            (member) => member.id !== activeChannelMemberOptions?.id
          )
        );
        setActiveChannelMemberOptionsNull();
      })
      .catch((err) => {
        console.log('ban err', err);
      });
    // activeChannelMemberOptions.id
  };

  const handleKickMember = () => {
    console.log('Kick Member');
  };

  
  const handleTimeoutMember = () => {
    console.log('Timeout Member');
    chatSocket.emit('channel:mute', {
      channel_id: activeChannelOptions?.id,
      user_id: activeChannelMemberOptions?.id,
      time: 60000,
    });
    // console.log('Timeout Member');
  };
  
  const handlePromoteToAdmin = () => {
    console.log('Promote to Admin');
    api.post(`/channels/promote/${activeChannelOptions?.id}`, {
      memberId: activeChannelMemberOptions?.id,
    })
    .then((res) => {
      toast.success('User promoted to admin');
      return true;
    })
    .catch((err) => {
      console.log('promote err', err);
      return false;
    });
    return true;
  };
  
  const handleDemoteToMember = ()  => {
    console.log('Demote to Member');
    api.post(`/channels/demote/${activeChannelOptions?.id}`, {
      memberId: activeChannelMemberOptions?.id,
    })
    .then((res) => {
      toast.success('User demoted to member');
      return true;
    })
    .catch((err) => {
      console.log('demote err', err);
      return false;
    });
    return true;
  };
  
  const handleModMember = () => {
    console.log('Mod Member');
    if (memberTitle === "Mod")
    {
      if (handlePromoteToAdmin())
        setMemberTitle("Unmod");
    }
    else
    {
      if (handleDemoteToMember())
      setMemberTitle("Mod");
    }
  };


  const handleCloseOptions = () => {
    setActiveChannelMemberOptionsNull();
  };

  return (
    <div className="channel-members-popup copy-book-background retro-border-box trans-orange-box">
      <div className="channel-members-container">
        <h1 className="channel-members-title">
          {activeChannelOptions?.name} Members
        </h1>
        <div className="channel-members-list scrollable">
          {activeChannelOptionsMembers.map((member, index) => {
            return (
              <div key={index}>
                {(activeChannelMemberOptions === null ||
                  activeChannelMemberOptions.id !== member.id) && (
                  <div className="channel-member-box">
                    <div className="channel-member-info-container">
                      <img
                        className="channel-member-avatar"
                        src={member.avatar}
                        alt="channel member avatar"
                      />
                      <span className="channel-member-name">{member.name}</span>
                    </div>
                    {showAdminOptions && member.id !== user?.id && member.id !== activeChannelOptions?.owner_id && (
                      <button
                        className="three-dot-menu-button"
                        onClick={() => handleButtonClick(member)}
                      >
                        <div className="three-dot-menu-dot"></div>
                        <div className="three-dot-menu-dot"></div>
                        <div className="three-dot-menu-dot"></div>
                      </button>
                    )}
                  </div>
                )}

                {activeChannelMemberOptions &&
                  activeChannelMemberOptions.id === member.id && (
                    <div className="chat-list-item-options">
                      {showOwnerOptions && (
                        <span
                          className="chat-list-option"
                          onClick={handleModMember}
                        >
                          {memberTitle}
                        </span>
                      )}
                      <span
                        className="chat-list-option"
                        onClick={handleTimeoutMember}
                      >
                        Timeout
                      </span>
                      <span
                        className="chat-list-option"
                        onClick={handleBanMember}
                      >
                        Ban
                      </span>
                      <span
                        className="chat-list-option chat-list-option-last"
                        onClick={handleKickMember}
                      >
                        Kick
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
        <ClassButton
          name="Close"
          classes="retro-button orange-header close-channel-members-btn"
          onClick={onClose}
        />
      </div>
    </div>
  );
}

export default ChannelMembers;
