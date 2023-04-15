import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { game } from './game';
import { waitingPlayer } from './interfaces';

@Injectable()
export class GameService {
  private queue: waitingPlayer[] = [];
  joinQueue(playerId: string, client: Socket, gameMode: string) {
    if (this.queue.find((player) => player.id === playerId)) {
      return;
    } else {
      this.queue.push({
        id: playerId,
        client,
        gameMode,
      });
    }
    console.log('queue', this.queue);
    // return this.matchPlayers();
  }

  leaveQueue(playerId: string) {
    const playerIndex = this.queue.findIndex(
      (player) => player.id === playerId,
    );
    if (playerIndex !== -1) {
      this.queue.splice(playerIndex, 1);
    }
    // console.log('Leave_queue', this.queue);
  }

  //   startGame(player1: waitingPlayer, player2: waitingPlayer) {
  // 	const new_game = new game(player1.id, player2.id, this);
  // 	player1.client.join(new_game._id.toString());
  // 	player2.client.join(new_game._id.toString());
  // 	this.games.push(new_game);

  //   }

  getQueue() {
    return this.queue;
  }

  clearQueue(): void {
    this.queue = [];
  }
  matchPlayersByGameMode(gameMode: string): waitingPlayer[] | null {
    const matchedPlayers = this.queue.filter(
      (player) => player.gameMode === gameMode,
    );

    if (matchedPlayers.length >= 2) {
      return [matchedPlayers[0], matchedPlayers[1]];
    }
    return null;
  }
  isPlayerInQueue(playerId: string): boolean {
    return this.queue.some((player) => player.id === playerId);
  }
  removePlayersFromQueue(playersToRemove: waitingPlayer[]): void {
    this.queue = this.queue.filter(
      (player) =>
        !playersToRemove.some(
          (playerToRemove) => playerToRemove.id === player.id,
        ),
    );
  }
}
