import authService from '../api/authService';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import login from '../assets/img/login.png';

import { useAuth } from '../useAuth';
import Cookies from 'js-cookie';
import { useEnable2fa } from '../hooks/useEnable2fa';

function Login() {
  const nav = useNavigate();
  const handleClick = async () => {
    authService.login();
  };

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
        nav('/');
    }
    const twofa = Cookies.get('2fa');
    if (twofa === "true") {
      Cookies.set("__2fa", "true");
      nav("/2fa", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="login-page">
      <img src={login} alt="" className="login-background" />
      <button className="login-button" onClick={handleClick}>
        Click here
      </button>
    </div>
  );
}

export default Login;
