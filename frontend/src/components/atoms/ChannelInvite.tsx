import React, { useEffect } from 'react';
import ClassButton from '../ClassButton';
import ImgButton from '../ImgButton';
import invite from '../../assets/img/invite.png';
import useChatParams from '../../hooks/useChatParams';
import ChannelUser, { ChannelUserRole, ChannelUserStatus } from '../../modules/channeluser';
import api from '../../api/api';
import { toast } from 'react-hot-toast';

function ChannelInvite({ onClose }: { onClose: () => void }) {
  const activeChannelOptions = useChatParams().activeChannelOptions;



  const activeChannelOptionsInviteUsers =
    useChatParams().activeChannelOptionsInviteUsers;
  const setActiveChannelOptionsInviteUsers =
    useChatParams().setActiveChannelOptionsInviteUsers;

const handleInvite = () => {
  api
    .get(`/channels/${activeChannelOptions?.id}/nonmembers`)
    .then((res) => {
      setActiveChannelOptionsInviteUsers(
        res.data.map(
          (user: any) =>
            new ChannelUser(
              user.id,
              user.login,
              user.avatar_url.startsWith('http')
                ? user.avatar_url
                : process.env.REACT_APP_API_URL + 'static' + user.avatar_url,
              activeChannelOptions!.id,
              ChannelUserStatus.MEMBER,
              ChannelUserRole.REGULAR,
              user.created_at
            )
        )
      );
    })
    .catch((err) => {
      console.log(err);
    });
}

  useEffect(handleInvite, []);

  const handleInviteUser = (userId: string) => {
    // console.log('Invite User');
    // setInvitedUser(!invitedUser);
    api.post(`/channels/invites/${activeChannelOptions?.id}`, {
      invitee_id: userId,}).then((res) => {
        console.log('res data invite', res.data);
      });
      toast.success('User invited');
// handleInvite( );
  };

  return (
    <div className="invite-to-channel-popup copy-book-background retro-border-box trans-orange-box">
      <div className="invite-to-channel-container">
        <h1 className="invite-to-channel-title">Invite to Channel</h1>
        <div className="invite-search-list-container">
          <input
            className="invite-search-input"
            type="text"
            placeholder="Seach..."
          />

          <div className="invite-search-list scrollable">
            {activeChannelOptionsInviteUsers?.map(
              (user: ChannelUser, index) => {
                return (
                  <div key={index}>
                    <div className="invite-search-list-item">
                      <div className="invite-user-avatar-name-container">
                        <img
                          className="channel-member-avatar"
                          src={user.avatar}
                          alt="channel member avatar"
                        />
                        <span className="channel-member-name">{user.name}</span>
                      </div>
                      {/* {!invitedUser && ( */}
                        <ImgButton
                          src={invite}
                          alt="invite user"
                          classes="invite-user-to-channel-btn"
                          onClick={() => handleInviteUser(user.id)}
                        />
                      {/* )} */}
                      {/* {invitedUser && (
                        <ImgButton
                          src={invited}
                          alt="invited user"
                          classes="invite-user-to-channel-btn"
                          onClick={handleInviteUser}
                        />
                      )} */}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
        <div className="close-channel-invite-btn-container">
          <ClassButton
            name="Close"
            classes="retro-button orange-header close-channel-invite-btn"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default ChannelInvite;
