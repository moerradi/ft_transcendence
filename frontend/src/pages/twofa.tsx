import React, { useEffect, useState } from "react";
import ClassButton from "../components/ClassButton";
import insertwofa from "../assets/svg/insert2fa.svg";
import Cookies from "js-cookie";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function Twofa() {
  const [towfacode, setTowfacode] = React.useState<string>("");
  const nav = useNavigate();

  useEffect(() => {
    const twofa = Cookies.get("2fa");
    if (twofa !== "true") {
      nav("/", { replace: true });
    }

    setTimeout(() => {
      Cookies.remove("2fa");
      Cookies.remove("__2fa");
      nav("/login", { replace: true });
    }, 1000 * 60 * 2);
  }, []);

  function submit2fa() {
    console.log("2fa submitted");
    api
      .post(
        "/auth/verify2fa",
        { code: towfacode },
        { headers: { Authorization: `Bearer ${Cookies.get("access_token")}` } }
      )
      .then((res: any) => {
        const access_token = res.data.accessToken;
        Cookies.set("access_token", access_token);
        Cookies.remove("2fa");
        window.location.reload();
      })
      .catch((err) => {
        // error code 401 flush and go to login
        // error code 403 code is wrong
        console.log(err);
        // code is wrong probably
      });
  }
  
  function cancel2fabutton() {
    // logout
    Cookies.remove("2fa");
      Cookies.remove("__2fa");
      nav("/login", { replace: true });
  }
  return (
    <div className="menu-container pattern-background brown-pattern">
      <div className="twofa-room-popup copy-book-background retro-border-box trans-brown-box">
        <img className="svg-text svg-text-margin" src={insertwofa} alt="" />
          <input className="the-twofa-popup-input"
            type="text"
            placeholder="Code goes here"
            value={towfacode}
            onChange={(e) => setTowfacode(e.target.value)}
          />
          <div className="create-button-container">
            <ClassButton
              name="Enable"
              classes="retro-button brown-header confirm-new-chat-btn"
              onClick={submit2fa}
            />
            <ClassButton
              name="Cancel"
              classes="retro-button brown-header confirm-new-chat-btn"
              onClick={cancel2fabutton}
            />
          </div>
      </div>
    </div>
  );
}

export default Twofa;
