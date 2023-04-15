import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameSocketContext from '../game/GameContext';

function WaitingRoom() {
  const navigate = useNavigate();
  const socket = useContext(GameSocketContext);

  useEffect(() => {
    socket.on('gameReady', () => {
      navigate('/game');
    });

    return () => {
      socket.off('gameReady');
    };
  }, [socket, navigate]);

  return (
    <div className="waiting-room">
      <h1>Waiting for an opponent...</h1>
    </div>
  );
}

export default WaitingRoom;
