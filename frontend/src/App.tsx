import { useContext, useEffect } from 'react';
import Navbar from './components/navbar';
import GameSocketContext from './game/GameContext';
import Router from './router';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function App() {
  const socket = useContext(GameSocketContext);
  const nav = useNavigate();

  useEffect(() => {
    socket.on("invited", (data: any) => {
	  // dont let two toasts appear at the same time
	  toast.dismiss();
      const toastId = toast(
        <div className="toast-container">
          <div className="toast-text">
            {data.login} invited you to a custom game
          </div>
          <div className="toast-buttons">
            <button
              className="toast-button"
              onClick={() => {
				console.log('inviteId', data.inviteId);
				nav(`/game/Custom`, { replace: true });
                socket.emit("accept_invite", { inviteId: data.inviteId });
                toast.dismiss(toastId);
              }}
            >
              Accept
            </button>
            <button
              className="toast-button"
              onClick={() => {
                socket.emit("decline_invite");
                toast.dismiss(toastId);
              }}
            >
              Decline
            </button>
          </div>
        </div>,
        {
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "10px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            padding: "1rem",
            width: "30rem",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          },
          duration: 100000,
        }
      );
    });
  }, [socket, nav]);

    //get cookie from 
  return (
    <>
      <Navbar />
      <Router />
      <div><Toaster/></div>
    </>
  );
}

export default App;
