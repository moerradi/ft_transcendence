import { useContext, useEffect, useState } from 'react';
import { useAuth } from '../useAuth';
import api from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useFriendButton } from '../hooks/useFriendButton';
import GameSocketContext from '../game/GameContext';
import addFriend from './../assets/svg/addFriend.svg'
import playinvite from './../assets/svg/playinvite.svg'
import Block from './../assets/svg/Block.svg'
// import { useProfileImage } from "../hooks/useProfileImage";
// import { useAuth } from "../useAuth";
// import { useNickname } from "../hooks/useNickname";
// import api from "../api/api";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import GameSocketContext from "../game/GameContext";

// function Control() {
//   const { login } = useParams();
//   const nav = useNavigate();
//   const { user, setUserState, loading } = useAuth();
//   const [friendButton, setFriendButton] = useState("");
//   const [friendButtonColor, setFriendButtonColor] = useState("");
//   const [userId, setUserId] = useState("");
//   const socket = useContext(GameSocketContext);

//   // const [playButton, setPlayButton] = useState('Let\'s play!');

function Control() {
  const { login } = useParams();
  const nav = useNavigate();
  const { user, loading } = useAuth();
  // const [friendButton, setFriendButton] = useState('');
  const friendButton = useFriendButton((state) => state.friendButton);
  const setFriendButton = useFriendButton((state) => state.setFriendButton);
  const [friendButtonColor, setFriendButtonColor] = useState('');
  const [blockButton, setBlockButton] = useState('');
  const [userId, setUserId] = useState('');
  const socket = useContext(GameSocketContext);
  // const [playButton, setPlayButton] = useState('Let\'s play!');

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    api
      .get('/profile/' + login + '/info')
      .then((response) => {
        setUserId(response.data.id);
        console.log('control', response.data);
        if (response.data.friendship === 'PENDING') {
          setFriendButton('Pending');
          setFriendButtonColor('gray-header');
          setBlockButton('Block');
        } else if (response.data.friendship === 'ACCEPTED') {
          setFriendButton('Unfriend');
          setFriendButtonColor('red-header');
          setBlockButton('Block');
        } else if (response.data.friendship === 'BLOCKED') {
          setBlockButton('Unblock');
          setFriendButton('Blocked');
          setFriendButtonColor('white-header');
        } else {
          setFriendButton('befriend');
          setBlockButton('Block');
          setFriendButtonColor('flower-green');
        }
      })
      .catch((error) => {
        console.log(error);
        nav('/404', { replace: true });
      });
  }, [user, loading]);

  // add friend logic:
  const friendHandleCLick = () => {
    if (blockButton === 'Unblock') {
      setFriendButton('Blocked');
      setFriendButtonColor('white-header');
      toast.error("You can't be friends with a blocked user!", {
        position: 'top-right',
      });
      return;
    }
    if (friendButton === 'Unfriend') {
      api
        .post('/friend/unfriend/' + login)
        .then((response) => {
          console.log(response);
          setFriendButton('befriend');
          setFriendButtonColor('flower-green');
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (friendButton === 'befriend') {
      api
        .post('/friend/add/' + login)
        .then((response) => {
          console.log(response);
          setFriendButton('Pending');
          setFriendButtonColor('gray-header');
        })
        .catch((error) => {
          console.log('erradi is dog ', error.response);
        });
    }
  };

  // invite to play logic:
  const playHandleCLick = () => {
    toast.success('game invitation has been sent with style!', {
      position: 'top-right',
    });
    console.log('invite', userId);
    socket.emit('invite', { userId: userId });
    nav('/game/Custom', { replace: true });
  };

  const blockHandleCLick = () => {
    if (blockButton === 'Block') {
      setBlockButton('Unblock');
      setFriendButton('Blocked');
      setFriendButtonColor('white-header');
      api
        .post('/friend/block/' + login)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (blockButton === 'Unblock') {
      setBlockButton('Block');
      setFriendButton('befriend');
      setFriendButtonColor('flower-green');
      api
        .post('/friend/unblock/' + login)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="settings-container">
      <div className="copy-book-background retro-border-box trans-pink-box setting-box">
        <img className="svg-text-edit-add" src={addFriend} alt="" />
        <div className="retro-button-container">
          <button
            className={'retro-button-ami ' + friendButtonColor}
            onClick={friendHandleCLick}
          >
            {friendButton}
          </button>
        </div>
      </div>

      <div className="copy-book-background retro-border-box trans-pink-box setting-box">
      <img className="svg-text-edit-add" src={playinvite} alt="" />
        <div className="retro-button-container">
          <button
            className="retro-button-ami pink-header"
            onClick={playHandleCLick}
          >
            Let's play!
          </button>
        </div>
      </div>

      <div className="copy-book-background retro-border-box trans-pink-box setting-box">
      <img className="svg-text-edit-add" src={Block} alt="" />
        <div className="retro-button-container">
          <button
            className="retro-button-ami pink-header"
            onClick={blockHandleCLick}
          >
            {blockButton}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Control;
