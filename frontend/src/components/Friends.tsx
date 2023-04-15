import React, { useCallback, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../useAuth";
import api from "../api/api";
import { AxiosError } from "axios";
import { useFriendButton } from "../hooks/useFriendButton";
import GameSocketContext from "../game/GameContext";

function Friends() {
  const [friends, setFriends] = React.useState<any>([]);
  const { login } = useParams();
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const friendButton = useFriendButton((state) => state.friendButton);
  const socket = useContext(GameSocketContext);

  const load = useCallback(() => {
    if (loading) return;
    let param = login;
    if (login == null) {
      param = user.login;
    }
    api.get("/friend/friends/" + param).then((res) => {
      console.log(res.data);
      setFriends(res.data);
    });
  }, [loading, login, user]);

  useEffect(() => {
    if (loading) return;
    let param = login;
    if (login == null) {
      param = user.login;
    }
    api.get("/friend/friends/" + param).then((res) => {
      console.log(res.data);
      setFriends(res.data);
    });
  }, [friendButton]);
  
  useEffect(() => {
    load();
    socket.on("status-updated", load);
    return () => {
      socket.off("status-updated", load);
    };
  }, [load, socket]);

  return (
    <div className="friends-list-box retro-border-box trans-pink-box copy-book-background">
      <h1>Friends:</h1>
      <div className="frinds-search-form">
        <input type="text" placeholder="Search" />
      </div>
      <div className="friends-list scrollable">
        {friends.map((friend: any, index: number) => {
          return (
            <div
              className="friends-list-item"
              key={index}
              onClick={() => nav("/profil/" + friend.login, { replace: true })}
            >
              <img
                className="chat-rooms-img"
                src={
                  friend.avatar_url.startsWith("http")
                    ? friend.avatar_url
                    : process.env.REACT_APP_API_URL +
                      "static" +
                      friend.avatar_url
                }
                alt=""
              />
              <span>
                <div className="chat-rooms-name">{friend.login}</div>
                <small>{friend.status}</small>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Friends;
