interface GameState {
  ball: Ball;
  paddleA: Paddle;
  paddleB: Paddle;
  scoreA: number;
  scoreB: number;
}

interface Paddle {
	y: number;
	height: number;
  }
  
  interface Ball {
	x: number;
	y: number;
	speedX: number;
	speedY: number;
	radius: number;
  }