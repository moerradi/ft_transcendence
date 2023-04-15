import { Socket } from "socket.io";


export interface waitingPlayer {
	id: string;
	client?: Socket;
	gameMode: string;
  }