import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBell } from "../hooks/useBell";
import Notif from "../components/atoms/Notif";
import ImgButton from "../components/ImgButton";
import accept from '../assets/img/accept.png';
import decline from '../assets/img/decline.png';
import { useAuth } from "../useAuth";
import { AxiosError } from "axios";
import api from "../api/api";

interface FriendButtonProps {
  login: string;
  source:string;
  onClick: (request: string) => void;
}

function FriendButton(props: FriendButtonProps) {
  function handleClick() {
    props.onClick(props.login);
  }
  return(
    <button className= "notif-btn" onClick={handleClick}>
		<img src={props.source} alt="/" style={{cursor: 'pointer', maxWidth: '100%', maxHeight: '100%'}} 
		    onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}/>
	  </button>
  )
}

function Bell() {
  const setBellClose = useBell((state) => state.setBellClose);
  const setBellName = useBell((state) => state.setBellName);
  const [visible, setVisible] = useState(true);
  const [friendrequest, setfriendrequest] = React.useState<any>([]);
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const notifList = [];

  function toggleBell() {
    setBellClose(true);
    setBellName("Close");
  }

  const notifNumber = 5;

  function handleAcceptFriend(login: string){
    console.log("Accept");
    setVisible(false);
    api.post("/friend/accept/" + login)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err: AxiosError) => {
        if (err.response) {
          if (err.response.status === 404) nav("/404", { replace: true });
        }
      });
  };

  const handleDeclineFriend = (login: string) => {
    console.log("Decline");
    setVisible(false);
    api.post("/friend/decline/" + login)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err: AxiosError) => {
      if (err.response) {
        if (err.response.status === 404) nav("/404", { replace: true });
      }
    });
};

  useEffect(() => {
    if (loading) return;
    api.get("/friend/requests")
      .then((res) => {
        console.log(res.data);
        setfriendrequest(res.data);
      })
      .catch((err: AxiosError) => {
        if (err.response) {
          if (err.response.status === 404) nav("/404", { replace: true });
        }
      });
  }, [loading]);



  return (
    <div className="menu-container pattern-background purple-pattern">
        <div className="notif-container retro-border-box trans-purple-box menu-box copy-book-background">
          <h2 className="friend-request-link"> Friend Requests:</h2>
          <div className="notif-list scrollable">


        {
          friendrequest.map((friend: any, index:number) => {
            return visible ? (
              <div className="notif-box">
                <div className="notif-msg-container">
                  <span className="notif-msg-name">{friend.login}</span>
                  <span className="notif-msg-span">  sent you a friend request</span>
                </div>
                <div className="notif-buttons">
                  <FriendButton source = {accept} login={friend.login} onClick={handleAcceptFriend} />
                  <FriendButton source = {decline} login={friend.login} onClick={handleDeclineFriend} />
                </div>
              </div>
            ) : null;
          })
        }
          </div>
        </div>
      </div>
  );
}

export default Bell;
