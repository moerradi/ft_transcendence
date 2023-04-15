import Cookies from 'js-cookie';
import { createContext } from 'react';
import socketIOClient from 'socket.io-client';

const socket = socketIOClient(process.env.REACT_APP_API_URL as string , {
	transports: ['websocket'],
	auth: {
		token: Cookies.get("access_token"),
	},
	// withCredentials: true,
});

const GameSocketContext = createContext(socket);

export default GameSocketContext;
