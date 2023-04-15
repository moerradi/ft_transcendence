// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// // Serve static files from public directory
// app.use(express.static('public'));

// // Initialize game state
// let gameState = {
//   ball: {
//     x: 400,
//     y: 300,
//     speedX: 5,
//     speedY: 5,
//     radius: 10
//   },
//   paddleA: {
//     y: 250,
//     height: 100
//   },
//   paddleB: {
//     y: 250,
//     height: 100
//   },
//   scoreA: 0,
//   scoreB: 0
// };

// // Handle updates to game state from clients
// io.on('connection', socket => {
//   console.log('A client has connected');

//   socket.on('updateGameState', newState => {
//     // Verify that the paddle positions are legal
//     if (newState.paddleA.y < 0) {
//       newState.paddleA.y = 0;
//     } else if (newState.paddleA.y + newState.paddleA.height > canvas.height) {
//       newState.paddleA.y = canvas.height - newState.paddleA.height;
//     }
    
//     if (newState.paddleB.y < 0) {
//       newState.paddleB.y = 0;
//     } else if (newState.paddleB.y + newState.paddleB.height > canvas.height) {
//       newState.paddleB.y = canvas.height - newState.paddleB.height;
//     }

//     // Check for score
//     if (newState.ball.x - newState.ball.radius <= 0) {
//       newState.scoreB += 1;
//       resetBall();
//     } else if (newState.ball.x + newState.ball.radius >= canvas.width) {
//       newState.scoreA += 1;
//       resetBall();
//     }

//     // Update game state and send to all clients
//     gameState = newState;
//     io.emit('updateGameState', gameState);
//   });

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     console.log('A client has disconnected');
//   });
// });

// // Set up interval to update ball position and send to clients
// setInterval(() => {
//   // Update ball position based on speed
//   gameState.ball.x += gameState.ball.speedX;
//   gameState.ball.y += gameState.ball.speedY;

//   // Check for collision with paddles
//   checkForCollisions(gameState.ball, gameState.paddleA, gameState.paddleB);

//   // Check for score
//   if (gameState.ball.x - gameState.ball.radius <= 0) {
//     gameState.scoreB += 1;
//     resetBall();
//   } else if (gameState.ball.x + gameState.ball.radius >= canvas.width) {
//     gameState.scoreA += 1;
//     resetBall();
//   }

//   // Send updated game state to all clients
//   io.emit('updateGameState', gameState);
// }, 16);

// // Reset ball to starting position
// function resetBall() {
//   gameState.ball.x = 400;
//   gameState.ball.y = 300;
//   gameState.ball.speedX = -gameState.ball.speedX;
//   gameState.ball.speedY = 5;
// }

// // Listen for incoming requests
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });
