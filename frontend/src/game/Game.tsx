import React, { useContext, useEffect, useRef, useState } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import GameSocketContext from "./GameContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "../styles/src/loader.css";
import { useAuth } from "../useAuth";
interface GameStateProps {
  gameStatus: "waiting" | "playing" | "break" | "gameover";
  ballX: number;
  ballY: number;
  player1Y: number;
  player2Y: number;
  player1H: number;
  player2H: number;
  gameMode: "Frisky" | "Fast" | "Fierce";
  player1Score: number;
  player2Score: number;
}
const Game: React.FC<{ mode: string; gameId: string }> = ({ mode, gameId }) => {
  const FACTOR = 2;
  const path = window.location.pathname.split("/").at(-1);
  const [spectating, setSpectating] = useState(false);
  const socket = useContext(GameSocketContext);
  const [resized, setResized] = useState(false);
  let tableWidth = Math.min(window.innerWidth - 40, 1500);
  const ballImage = useRef<p5Types.Image>();
  const ballWidth = 20; // Adjust the width as needed
  const ballHeight = 20;
  let tableHeight = tableWidth / FACTOR;
  const gameState = {
    gameStatus: "waiting",
    ballX: tableWidth / 2,
    ballY: tableHeight / 2,
    player1Y: tableHeight / 2,
    player2Y: tableHeight / 2,
    player1H: 120,
    player2H: 120,
    gameMode: "Frisky",
    player1Score: 0,
    player2Score: 0,
  } as GameStateProps;
  const bg = useRef<any>(0);
  const navigate = useNavigate();

  //   useEffect(() => {
  //     socket?.current?.on("gameState", (state: GameStateProps) => {
  //       console.log(state);
  //     });
  //   }, []);

  socket.on("gameState", (state: GameStateProps) => {
    // console.log(state);
    gameState.gameStatus = state.gameStatus;
    gameState.ballX = state.ballX;
    gameState.ballY = state.ballY;
    gameState.player1Y = state.player1Y;
    gameState.player2Y = state.player2Y;
    gameState.player1H = state.player1H;
    gameState.player2H = state.player2H;
    gameState.gameMode = state.gameMode;
    gameState.player1Score = state.player1Score;
    gameState.player2Score = state.player2Score;
  });
  socket.on("gameOver", (state: GameStateProps) => {
    console.log("gameOver", state);
    gameState.gameStatus = "gameover";
    // sleep for 1 second
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1000);
  });

  const setup: any = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(tableWidth, tableHeight).parent(canvasParentRef);
    p5.ellipseMode(p5.CENTER);
    p5.rectMode(p5.CENTER);
    bg.current = {
      Fast: p5.loadImage("/stars.jpg"),
      Fierce: p5.loadImage("/fierce.jpg"),
      Frisky: p5.loadImage("/frisky.jpg"),
      Custom: p5.loadImage("/frisky.jpg"),
    }[mode]!;
    ballImage.current = p5.loadImage("/smiley.png");
  };

  const Draw: any = (p5: p5Types) => {
    if (gameState.gameStatus === "playing") {
      socket.emit("movePlayer", {
        playerY: p5.mouseY,
        gameId: gameId,
      });
    }
    // update();
    // soundFile.current && soundFile.current.play();
    p5.background(bg.current);

    p5.noStroke();

    // Draw paddle A
    p5.fill("#f5f5f5");
    p5.stroke("white");
    p5.rect(
      20 * (tableWidth / 1000),
      gameState.player1Y * tableHeight,
      20 * (tableWidth / 1000),
      gameState.player1H * tableHeight,
      20
    );

    // Draw paddle B
    p5.fill("#f5f5f5");
    p5.stroke("white");
    p5.rect(
      tableWidth - 20 * (tableWidth / 1000),
      gameState.player2Y * tableHeight,
      20 * (tableWidth / 1000),
      gameState.player2H * tableHeight,
      20
    );

    for (let i = 0; i < tableHeight; i += 20) {
      p5.stroke(255);
      p5.strokeWeight(2);
      p5.line(tableHeight, i, tableHeight, i + 10);
    }
    // Draw the ball

    // p5.fill("black");
    // p5.stroke("white");
    // console.log(gameState.ballX, gameState.ballY);
    p5.image(
      ballImage.current!,
      gameState.ballX * tableWidth - ballWidth / 2,
      gameState.ballY * tableHeight - ballHeight / 2,
      ballWidth,
      ballHeight
    );
    // console.log(gameState);
    // drawGameOver
    if (gameState.gameStatus === "gameover") {
      p5.fill("#cde223");
      p5.textSize(50);
      p5.textFont("Helvetica");
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text("Game Over", tableWidth / 2, tableHeight / 2);
    }
    // drawScore
    p5.stroke("black");
    p5.fill("#cde223");
    p5.textFont("Helvetica");
    p5.textSize(50);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text(gameState.player1Score, tableWidth / 2 - 100, 50);
    p5.text(gameState.player2Score, tableWidth / 2 + 100, 50);
  };

  const windowResized: any = (p5: p5Types) => {
    setResized((prev) => !prev);
    tableWidth = Math.min(window.innerWidth - 40, 1500);
    tableHeight = tableWidth / FACTOR;
    p5.resizeCanvas(tableWidth, tableHeight);
  };

  useEffect(() => {
    console.log("gameId", gameId);

    console.log("socket", socket);
    return () => {
      socket.emit("leaveGame", { gameId: gameId });
    };
  }, []);
  socket.on("disconnect", () => {
    socket.emit("leaveGame", { gameId: gameId });
  });
  return (
    <div
      className="pattern-background green-pattern"
      style={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: 'url("/notebook.jpg") no-repeat center center',
          border: "10px solid black",
          backgroundSize: "cover",
          display: "inline-block",
          padding: 20, // Adjust the padding to control the space between the canvas and the background image
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <div className="canvas-wrapper">
          <Sketch setup={setup} draw={Draw} windowResized={windowResized} />
        </div>
      </div>
    </div>
  );
};

const Waiting = () => {
  const socket = useContext(GameSocketContext);
  const [gameReady, setGameReady] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [gameId, setGameId] = useState("");
  // get query params
  const [query] = useSearchParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    // const tmpGameId = query.get("gameId")
    // if (tmpGameId) {
    // 	setGameId(tmpGameId);
    // }
    if (!["Fast", "Frisky", "Fierce", "Custom"].includes(params["mode"]!))
      navigate("/404");
    if (params["mode"] !== "Custom") {
      console.log("join_queue", params.mode);
      socket.emit("join_queue", { gameMode: params.mode });
    }
    socket.on("gameReady", (data: { gameId: string }) => {
      console.log("gameready", data.gameId);
      // print socketid
      setGameReady(true);
      setGameId(data.gameId);
    });

    return () => {
      socket.emit("leave_queue");
      socket.off("gameReady");
    };
  }, [socket]);

  if (gameId) return <Game mode={params["mode"]!} gameId={gameId} />;

  return (
    <div
      style={{
        justifyContent: "center",
        background: "#25252b",
        minHeight: "100vh",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="pong-wrapper">
        <div className="pong-strich strich1"></div>
        <div className="pong-strich strich2"></div>
        <div className="pong-ball"></div>
      </div>
      <h1 style={{ color: "white" }}>Waiting for opponent...</h1>
    </div>
  );
};

export default Waiting;
