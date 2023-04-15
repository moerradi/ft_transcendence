import React, { useCallback, useContext, useEffect } from "react";
import TabBox from "./TabBox";
import Settings from "./Settings";
import Profil from "./Profil";
import api from "../api/api";
import { useAuth } from "../useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { useProfileImage } from "../hooks/useProfileImage";
import Control from "./Control";
import { useActiveTab } from "../hooks/useActiveTab";
import Cookies from "js-cookie";
import { useLoggedState } from "../hooks/useLoggedState";
import GameSocketContext from "../game/GameContext";

function ProfilComp() {
  const { login } = useParams();
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [name, setName] = React.useState<string>("");
  const setProfilImage = useProfileImage((state) => state.setImage);
  const profileImage = useProfileImage((state) => state.image);
  const [options, setOptions] = React.useState<any>([]);
  const [xp, setXp] = React.useState<number>(0);
  const [level, setLevel] = React.useState<number>(0);

  const activeTab = useActiveTab((state) => state.activeTab);
  const setActiveTab = useActiveTab((state) => state.setActiveTab);
  const loggedState = useLoggedState((state) => state.loggedState);
  const setLoggedState = useLoggedState((state) => state.setLoggedState);
  const socket = useContext(GameSocketContext);
  useEffect(() => {
    if (loading) return;
    if (!user) return;
    setOptions([{ name: "Profil", content: <Profil /> }]);
    console.log(user);
    let param = login;
    if (login == null) {
      param = user.login;
    }
    api
      .get("/profile/" + param + "/info")
      .then((res) => {
        console.log(res.data);
        setName(res.data.login);
        if (res.data.avatar_url.startsWith("http")) {
          setProfilImage(res.data.avatar_url);
        } else {
          setProfilImage(
            (process.env.REACT_APP_API_URL as string) +
              "static" +
              res.data.avatar_url
          );
        }
        setXp(res.data.exp);
      })
      .catch((err: AxiosError) => {
        if (err.response) {
          if (err.response.status === 404) nav("/404", { replace: true });
        }
      });
  }, [loading, user, login]);

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (login == null || login === user.login) {
      setOptions([
        { name: "Profil", content: <Profil /> },
        { name: "Settings", content: <Settings /> },
      ]);
    } else {
      setOptions([
        { name: "Profil", content: <Profil /> },
        { name: "Control", content: <Control /> },
      ]);
    }
  }, [name, login, loading, user]);


  const load = useCallback(() => {
    if (loading) return;
    let param = login;
    if (login == null || login === user?.login) {
      setLoggedState("tab-box-avatar-online");
      return;
    }
    api.get("/friend/friends/" + user.login).then((res) => {
      console.log(res.data);
      const inuse = Array.from<any>(res.data.values()).find(
        (i) => i.login === param
      );
      console.log("here in use ", inuse);
      if (inuse.status === "Online") setLoggedState("tab-box-avatar-online");
      else if (inuse.status === "Offline")
        setLoggedState("tab-box-avatar-offline");
      else if (inuse.status === "ingame")
        setLoggedState("tab-box-avatar-ingame");
      else setLoggedState("tab-box-avatar-none");
    })
    .catch((err: AxiosError) => {
      setLoggedState("tab-box-avatar-none");
    }
    );

  }, [loading, login, user]);

  useEffect(() => {
    load();
    socket.on("status-updated", load);
    return () => {
      socket.off("status-updated", load);
    };
  }, [load, socket]);

  const color: string = "pink";
  return (
    <div className="pattern-background pink-pattern">
      <TabBox
        options={options}
        tabcolor={color}
        imgbtn={false}
        title={name}
        avatar={profileImage}
      />
    </div>
  );
}

export default ProfilComp;
