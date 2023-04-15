import { ConfigService } from '@nestjs/config';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { game } from './game';
import { GameService } from './game.service';
import * as jwt from 'jsonwebtoken';
import { userPayload } from '../auth/types/userPayload';
import { GameMode } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';

type status = 'Online' | 'InGame' | 'Offline';

interface Player {
  id: number;
  mode: string;
}
interface UserData {
  id: number;
  login: string;
}

@WebSocketGateway({ cors: true })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(
    private gameService: GameService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    console.log('GameGateway constructor');
  }

  //   public games: game[] = [];
  public games = new Map<string, game>();
  //   public waitingPlayers: Player[] = [];
  public waitingPlayers = new Map<string, number[]>();
  public gameInvitations = new Map<string, { from: number; to: number }>();

  public connectedUsers = new Map<number, string>();

  status(id: number): status {
    for (const game of this.games.values()) {
      const sid = id.toString();
      if (game._player1.id === sid || game._player2.id === sid) {
        return 'InGame';
      }
    }
    if (this.connectedUsers.has(id)) {
      return 'Online';
    }
    return 'Offline';
  }

  handleConnection(client: Socket & { userData: UserData }, ...args: any[]) {
    try {
      console.log('handleConnection');
      console.log(client.handshake.auth.token);
      const token = client.handshake.auth.token;
      if (!client.handshake.auth.token) {
        client.disconnect();
        return;
      }
      const decoded = jwt.verify(
        token,
        this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      ) as userPayload;
      console.log('decoded', decoded);
      client.userData = {
        id: decoded.id,
        login: decoded.login,
      };
      const existingUser = this.connectedUsers.get(client.userData.id);
      if (existingUser) {
        this.connectedUsers.set(client.userData.id, client.id);
      }
      this.connectedUsers.set(client.userData.id, client.id);
      this.server.emit('status-updated');
    } catch (err) {
      console.log(err);
      client.disconnect();
      return;
    }
  }

  handleConnectionError(
    client: Socket & { userData: { id: string } },
    ...args: any[]
  ) {
    console.log('Connection error');
  }

  handleDisconnect(client: Socket & { userData: UserData }) {
    this.connectedUsers.delete(client.userData.id);
    this.server.emit('status-updated');
    const playerIndex = this.waitingPlayers.forEach((mode) => {
      const playerIndex = mode.findIndex(
        (player) => player === client.userData.id,
      );
      if (playerIndex !== -1) {
        mode.splice(playerIndex, 1);
      }
    });
    // check if in game and stop it
    const game = this.games.forEach((game) => {
      if (
        game._player1.id === client.userData.id.toString() ||
        game._player2.id === client.userData.id.toString()
      ) {
        console.log('game found', game._id);
        game.gameOver(true);
      }
    });
  }

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  @SubscribeMessage('movePlayer')
  handleMovePlayer(
    client: Socket & { userData: UserData },
    payload: { playerY: number; gameId: string },
  ): void {
    const game = this.games.get(payload.gameId);
    if (!game) {
      return;
    }
    game.movePlayer(payload.playerY, client.userData.id.toString());
  }

  @SubscribeMessage('join_queue')
  handleJoinQueue(
    client: Socket & { userData: UserData },
    payload: { gameMode: string },
  ): void {
    console.log('join_queue', payload.gameMode, client.userData.id);
    const queue = this.waitingPlayers.get(payload.gameMode);
    if (!queue) {
      this.waitingPlayers.set(payload.gameMode, [client.userData.id]);
      return;
    }
    const existingPlayer = queue.find((id) => id === client.userData.id);
    if (existingPlayer) {
      console.log('existingPlayer', existingPlayer);
      return;
    }
    queue.push(client.userData.id);
    if (queue.length >= 2) {
      const player1 = queue.pop();
      const player2 = queue.pop();
      const socketId1 = this.connectedUsers.get(player1);
      const socketId2 = this.connectedUsers.get(player2);
      if (!socketId1 || !socketId2) {
        console.log('socketId not found');
        return;
      }
      const newGame = new game(player1.toString(), player2.toString(), this);
      newGame._gameMode = payload.gameMode as GameMode;
      this.games.set(newGame._id, newGame);
      this.server.emit('status-updated');
      this.server.sockets.sockets.get(socketId1).join(newGame._id);
      this.server.sockets.sockets.get(socketId2).join(newGame._id);
      this.games.get(newGame._id).startGame();
      this.server.to(socketId1).emit('gameReady', {
        gameId: newGame._id,
      });
      this.server.to(socketId2).emit('gameReady', {
        gameId: newGame._id,
      });
    }
  }

  @SubscribeMessage('leave_queue')
  handleLeaveQueue(client: Socket & { userData: UserData }): void {
    this.waitingPlayers.forEach((mode) => {
      const playerIndex = mode.findIndex(
        (player) => player === client.userData.id,
      );
      if (playerIndex !== -1) {
        mode.splice(playerIndex, 1);
      }
    });
  }

  async handleGameOver(gameId: string) {
    // emit game over to both
    const game = this.games.get(gameId);
    if (!game) {
      return;
    }
    const socketId1 = this.connectedUsers.get(parseInt(game._player1.id));
    const socketId2 = this.connectedUsers.get(parseInt(game._player2.id));
    if (socketId1) {
      this.server.to(socketId1).emit('gameOver', { gameId });
      this.server.sockets.sockets.get(socketId1).leave(gameId);
    }
    if (socketId2) {
      this.server.to(socketId2).emit('gameOver', { gameId });
      this.server.sockets.sockets.get(socketId2).leave(gameId);
    }
    try {
      const gameState = game.getGameState();

      const winnerXp =
        Math.abs(gameState.player1Score - gameState.player2Score) * 10 + 100;
      const loserXp = 100;
      const Player1Won = gameState.player1Score > gameState.player2Score;
      const player_one_exp = Player1Won ? winnerXp : loserXp;
      const player_two_exp = Player1Won ? loserXp : winnerXp;
      const winnerId = Player1Won
        ? parseInt(game._player1.id)
        : parseInt(game._player2.id);
      const loserId = Player1Won
        ? parseInt(game._player2.id)
        : parseInt(game._player1.id);
      await this.prisma.$transaction([
        this.prisma.match.create({
          data: {
            player_one_id: parseInt(game._player1.id),
            player_two_id: parseInt(game._player2.id),
            player_one_score: gameState.player1Score,
            player_two_score: gameState.player2Score,
            player_one_exp: player_one_exp,
            player_two_exp: player_two_exp,
            game_mode: game._gameMode,
          },
        }),
        this.prisma.user.update({
          where: {
            id: winnerId,
          },
          data: {
            exp: {
              increment: winnerXp,
            },
          },
        }),
        this.prisma.user.update({
          where: {
            id: loserId,
          },
          data: {
            exp: {
              increment: loserXp,
            },
          },
        }),
      ]);
    } catch (err) {
      console.log(err);
    }
    this.games.delete(gameId);
    this.server.emit('status-updated');
  }

  @SubscribeMessage('invite')
  async handleInvite(
    client: Socket & { userData: UserData },
    payload: { userId: string },
  ): Promise<void> {
    const { id } = client.userData;
    // get player by login
    const socketId = this.connectedUsers.get(parseInt(payload.userId));
    if (socketId) {
      const inviteId = uuidv4();
      this.gameInvitations.set(inviteId, {
        from: id,
        to: parseInt(payload.userId),
      });
      this.server
        .to(socketId)
        .emit('invited', { inviteId, login: client.userData.login });
    }
  }

  @SubscribeMessage('accept_invite')
  async handleAcceptInvite(
    client: Socket & { userData: UserData },
    payload: { inviteId: string },
  ): Promise<void> {
    const invitation = this.gameInvitations.get(payload.inviteId);
    if (!invitation) {
      return;
    }
    const socketId = this.connectedUsers.get(invitation.from);
    if (!socketId) {
      return;
    }
    const newGame = new game(
      invitation.from.toString(),
      client.userData.id.toString(),
      this,
    );
    newGame._gameMode = 'Frisky';
    this.games.set(newGame._id, newGame);
    this.server.emit('status-updated');
    this.server.sockets.sockets.get(socketId).join(newGame._id);
    client.join(newGame._id);
    this.games.get(newGame._id).startGame();
    this.server.to(socketId).emit('gameReady', {
      gameId: newGame._id,
    });
    this.server.to(client.id).emit('gameReady', {
      gameId: newGame._id,
    });
  }
  @SubscribeMessage('leaveGame')
  async handleLeaveGame(
    client: Socket & { userData: { id: string; login: string } },
    payload: { gameId: string },
  ): Promise<void> {
    const game = this.games.get(payload.gameId);
    if (game) {
      game.gameOver(true);
    }
  }
}
