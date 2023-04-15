import { GameMode } from '@prisma/client';
import { exit } from 'process';
import { Socket } from 'socket.io';
import { GameGateway } from './game.gateway';
import { Ball, Player, Table } from './interfaces';
import { v4 as uuidv4 } from 'uuid';

export class game {
  public _id: string;
  public _gameMode: GameMode;
  private _gameStatus: 'pending' | 'waiting' | 'playing' | 'break' | 'gameover';
  public _player1: Player;
  public _player2: Player;
  private _table: Table;
  private _ball: Ball;
  private _gateway: GameGateway;
  private _speed: number;
  private FRAME_RATE = 60;
  private PADDLE_HEIGHT = 120;
  private BALL_RADIUS = 15;
  private INITIAL_SPEED = 5;
  private TABLE_WIDTH = 1000;
  private TABLE_HEIGHT = 600;

  constructor(player1: string, player2: string, server: any) {
    this._id = uuidv4();
    this._gateway = server;
    this._gameStatus = 'pending';

    this._player1 = {
      id: player1,
      score: 0,
      positionY: this.TABLE_HEIGHT / 2 - this.PADDLE_HEIGHT / 2,
      playerPaddleHeight: this.PADDLE_HEIGHT,
    };
    this._player2 = {
      id: player2,
      score: 0,
      positionY: this.TABLE_HEIGHT / 2 - this.PADDLE_HEIGHT / 2,
      playerPaddleHeight: this.PADDLE_HEIGHT,
    };
    this._table = {
      width: this.TABLE_WIDTH,
      height: this.TABLE_HEIGHT,
      rightLimit: this.TABLE_WIDTH - this.BALL_RADIUS,
      bottomLimit: this.TABLE_HEIGHT - this.BALL_RADIUS,
      leftLimit: this.BALL_RADIUS,
      topLimit: this.BALL_RADIUS,
    };
    this._ball = {
      cx: this.TABLE_WIDTH / 2,
      cy: this.TABLE_HEIGHT / 2,
      r: this.BALL_RADIUS,
      directionX: 1,
      directionY: 1,
    };
    this._speed = this.INITIAL_SPEED;
  }

  public startGame() {
	console.log('game started');
    this._gameStatus = 'playing';
    console.log('startGame');
    this.gameLoop();
  }

  public movePlayer(position: number, player: string) {
    if (this._gameStatus === 'playing') {
      if (
        player === this._player1.id &&
        position < this._table.height - this.PADDLE_HEIGHT / 2 &&
        position > this.PADDLE_HEIGHT / 2
      ) {
        this._player1.positionY = position;
      } else if (
        player === this._player2.id &&
        position < this._table.height - this.PADDLE_HEIGHT / 2 &&
        position > this.PADDLE_HEIGHT / 2
      ) {
        this._player2.positionY = position;
      }
    }
  }

  private detectCollision(nextCX: number, nextCY: number) {
    const player1Y = this._player1.positionY;
    const player2Y = this._player2.positionY;
    if (
      nextCY < player1Y + this.PADDLE_HEIGHT / 2 &&
      nextCY > player1Y - this.PADDLE_HEIGHT / 2 &&
      nextCX < this.BALL_RADIUS * 2
    ) {
      return true;
    } else if (
      nextCY < player2Y + this.PADDLE_HEIGHT / 2 &&
      nextCY > player2Y - this.PADDLE_HEIGHT / 2 &&
      nextCX > this._table.width - this.BALL_RADIUS * 2
    ) {
      return true;
    } else {
      return false;
    }
  }

  private initGoal() {
    this._ball.cx = this._table.width / 2;
    this._ball.cy = this._table.height / 2;
    const rad = Math.random();
    if (rad < 0.25) {
      this._ball.directionX = 1;
      this._ball.directionY = 1;
    } else if (rad < 0.5) {
      this._ball.directionX = 1;
      this._ball.directionY = -1;
    } else if (rad < 0.75) {
      this._ball.directionX = -1;
      this._ball.directionY = 1;
    } else {
      this._ball.directionX = -1;
      this._ball.directionY = -1;
    }
  }

  private updateScore() {
    if (this._ball.cx < this._table.leftLimit) {
      if (this._gameMode === 'Fierce') {
        this._player1.playerPaddleHeight -= 10;
      } else if (this._gameMode === 'Fast') {
        this._speed += 1;
      }
      this._player2.score++;
      this.initGoal();
    } else if (this._ball.cx > this._table.rightLimit) {
      if (this._gameMode === 'Fierce') {
        this._player2.playerPaddleHeight -= 10;
      } else if (this._gameMode === 'Fast') {
        this._speed += 1;
      }
      this._player1.score++;
      this.initGoal();
    }
    if (this._player1.score === 11 || this._player2.score === 11) this.gameOver(false);
  }

  getGameState() {
    return {
      gameStatus: this._gameStatus,
      ballX: this._ball.cx / this._table.width,
      ballY: this._ball.cy / this._table.height,
      player1Y: this._player1.positionY / this._table.height,
      player2Y: this._player2.positionY / this._table.height,
      player1Score: this._player1.score,
      player2Score: this._player2.score,
    };
  }

  gameCore() {
    const [nextCX, nextCY] = [
      this._ball.cx + this._ball.directionX,
      this._ball.cy + this._ball.directionY,
    ];
    if (this.detectCollision(nextCX, nextCY)) {
      this._ball.directionX *= -1;
    }
    // if (nextCX < this._table.leftLimit || nextCX > this._table.rightLimit) {
    //   this._ball.directionX *= -1;
    // }
    if (nextCY < this._table.topLimit || nextCY > this._table.bottomLimit) {
      this._ball.directionY *= -1;
    }

    const gameState = {
      gameMode: this._gameMode,
      gameStatus: this._gameStatus,
      ballX: nextCX / this._table.width,
      ballY: nextCY / this._table.height,
      player1Y: this._player1.positionY / this._table.height,
      player2Y: this._player2.positionY / this._table.height,
      player1H: this._player1.playerPaddleHeight / this._table.height,
      player2H: this._player2.playerPaddleHeight / this._table.height,
      player1Score: this._player1.score,
      player2Score: this._player2.score,
    };

    this._ball.cx = nextCX;
    this._ball.cy = nextCY;
    // console.log(gameState);
    return gameState;
  }

  gameOver(forfeit: boolean) {
	console.log('game over', this._id);
    this._gameStatus = 'gameover';
    this._gateway.handleGameOver(this._id);
  }

  public gameLoop() {
    const interval = setInterval(() => {
      if (this._gameStatus === 'playing') {
        this._ball.cx += this._speed * this._ball.directionX;
        this._ball.cy += this._speed * this._ball.directionY;
        this.updateScore();
        this._gateway.server.to(this._id).emit('gameState', this.gameCore());
      } else {
        clearInterval(interval);
      }
    }, 1000 / this.FRAME_RATE);
  }
}
