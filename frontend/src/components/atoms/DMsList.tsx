import { useCallback, useContext, useEffect } from 'react';
import useDMsParams from '../../hooks/useDMsParams';
import api from '../../api/api';
import User, { Status } from '../../modules/user';
import DMs from '../../modules/dms';
import { useAuth } from '../../useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import GameSocketContext from '../../game/GameContext';
import ChatSocketContext from '../ChatContext';

function DMsList() {
  const dmsList = useDMsParams((state) => state.dmsList);
  const setDMsList = useDMsParams((state) => state.setDMsList);
  const activeDMsOptions = useDMsParams((state) => state.activeDMsOptions);
  const setActiveDMs = useDMsParams((state) => state.setActiveDMs);
  const setActiveDMsOptions = useDMsParams(
    (state) => state.setActiveDMsOptions
  );
  const { user } = useAuth();
  const nav = useNavigate();
  const socket = useContext(GameSocketContext);
  const chatSocket = useContext(ChatSocketContext);

  const load = useCallback(async () => {
    api.get('/message').then((response) => {
      setDMsList(
        response.data.map((dms: any) => {
          let user: User = new User(
            dms.id,
            dms.login,
            dms.avatar_url,
            Status.ONLINE,
            0,
            0
          );
          return new DMs(dms.id, user);
        })
      );
    });
  }, [setDMsList]);

  useEffect(() => {
    if (!user) return;
    load();
    chatSocket.on('dms:block', (data: any) => {
      console.log('dms:block', data);
      if (data.user_id === user.id) {
        setActiveDMs(null);
        load();
      }
    });
    return () => {
      chatSocket.off('dms:block');
    };
  }, [load, user, chatSocket, setActiveDMs]);

  const handleButtonClick = (itemId: string, itemName: string) => {
    console.log(`item id: ${itemId} ${itemName}`);
    setActiveDMsOptions(itemId);
  };

  const handleCloseOptions = () => {
    setActiveDMsOptions('');
  };

  const handleBlockUser = () => {
    if (activeDMsOptions) {
      api
        .post('/friend/block/' + activeDMsOptions.user.name)
        .then(() => {
          toast.success('user has been blocked with style!');
          load();
          socket.emit('dms:block', { userId: activeDMsOptions.user.id });
          setActiveDMs(null);
          chatSocket.emit('dms:block', { user_id: activeDMsOptions.user.id });
        })
        .catch(() => {
          toast.error('user could not be blocked!');
        });
      setActiveDMsOptions('');
    }
  };

  const handleInviteToPlay = () => {
    console.log('invite to play', activeDMsOptions);
    if (activeDMsOptions) {
      setActiveDMsOptions('');
      toast.success('game invitation has been sent with style!', {
        position: 'top-right',
      });
      console.log('invite', activeDMsOptions.user.id);
      socket.emit('invite', { userId: activeDMsOptions.user.id });
      nav('/game/Custom', { replace: true });
    }
  };

  const handleGotoProfile = () => {
    console.log('goto profile', activeDMsOptions);
    // activeDMsOptions.id is the user id of the user we want to go to
    if (activeDMsOptions) {
      setActiveDMsOptions('');
      nav(`/profil/${activeDMsOptions.user.name}`);
    }
  };

  return (
    <div className="chat-list scrollable">
      {dmsList.map((item, index) => {
        const itemName = item.user.name;
        return (
          <div key={item.id}>
            {(activeDMsOptions === null ||
              activeDMsOptions?.id !== item.id) && (
              <div className="chat-list-item">
                <span
                  className="chat-list-item-name"
                  onClick={() => {
                    setActiveDMs(item.id);
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
            {activeDMsOptions && activeDMsOptions.id === item.id && (
              <div className="chat-list-item-options">
                <span
                  className="chat-list-option dm-option"
                  onClick={handleGotoProfile}
                >
                  Profile
                </span>
                <span
                  className="chat-list-option dm-option"
                  onClick={handleInviteToPlay}
                >
                  Play
                </span>
                {/* <span className='chat-list-option dm-option' onClick={handleMuteUser}>Mute</span> */}
                <span
                  className="chat-list-option dm-option chat-list-option-last"
                  onClick={handleBlockUser}
                >
                  Block
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

export default DMsList;
