"use client";
import { useEffect, useState, useRef } from "react";
import { useGameState } from "@/stores/gameState";

type Cell = "X" | "O" | null;

export default function GameBoardLocal() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Cell>("X");
  const [gameOver, setGameOver] = useState(true);
  const [winner, setWinner] = useState<Cell>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [xMoves, setXMoves] = useState<number[]>([]);
  const [oMoves, setOMoves] = useState<number[]>([]);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [moveTimeLeft, setMoveTimeLeft] = useState(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const setIsGameRunning = useGameState((state) => state.setIsGameRunning);
  const [gameStarted, setGameStarted] = useState(false);
  const [startingPlayer, setStartingPlayer] = useState<Cell>("X");
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    setIsGameRunning(true);
    const initialTime = 5.05;
    setMoveTimeLeft(5);

    if (timerRef.current) clearInterval(timerRef.current);

    const start = performance.now();

    timerRef.current = setInterval(() => {
      const elapsed = (performance.now() - start) / 1000;
      const remaining = initialTime - elapsed;

      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        setMoveTimeLeft(0);

        endGame(currentPlayer === "X" ? "O" : "X");
      } else {
        setMoveTimeLeft(Math.min(5, parseFloat(remaining.toFixed(2))));
      }
    }, 50);

    return () => {
      clearInterval(timerRef.current!);
      setIsGameRunning(false);
    };
  }, [currentPlayer, gameOver, gameStarted, setIsGameRunning]);

  const handleMove = (i: number) => {
    if (!gameStarted || gameOver || board[i]) return;

    const updated = [...board];
    const playerMoves = currentPlayer === "X" ? xMoves : oMoves;
    let newMoves = [...playerMoves];

    if (newMoves.length === 3) {
      const oldest = newMoves.shift()!;
      updated[oldest] = null;
    }

    updated[i] = currentPlayer;
    newMoves.push(i);

    setBoard(updated);
    currentPlayer === "X" ? setXMoves(newMoves) : setOMoves(newMoves);

    const winLine = getWinningLine(updated, currentPlayer);
    if (winLine) {
      setWinningLine(winLine);
      endGame(currentPlayer);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const endGame = (winner: Cell) => {
    setGameOver(true);
    setWinner(winner);

    if (winner === "X") {
      setXWins((w) => w + 1);
      setStartingPlayer("X");
    }
    if (winner === "O") {
      setOWins((w) => w + 1);
      setStartingPlayer("O");
    }
  };

  const getWinningLine = (b: Cell[], p: Cell): number[] | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return (
      lines.find(([a, b1, c]) => b[a] === p && b[b1] === p && b[c] === p) ||
      null
    );
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer(startingPlayer);
    setGameOver(false);
    setWinner(null);

    setWinningLine(null);
    setXMoves([]);
    setOMoves([]);
  };

  return (
    <div className="tw:flex tw:flex-col tw:items-center tw:gap-4 tw:sm:gap-6 tw:w-full">
      <div className="tw:flex tw:flex-col tw:gap-2 tw:sm:gap-4">
        {/* Scoreboard */}

        <div
          className={`tw:flex  tw:justify-between
               tw:gap-4 tw:font-semibold tw:grid-display
                tw:text-base tw:sm:text-lg tw:md:text-xl tw:lg:text-2xl`}
        >
          <span
            className="tw:flex tw:flex-1 tw:justify-start tw:gap-4 tw:text-[color:var(--tw-color-x)] 
            tw:w-26 tw:sm:w-30 tw:md:w-36 tw:lg:w-48 "
          >
            <span className="tw:flex">X</span>
            <span className="tw:flex tw:flex-1 tw:truncate">
              {String(xWins).padStart(3, "0")}
            </span>
          </span>
          <span
            className="tw:flex tw:flex-1 tw:gap-4 tw:justify-end tw:text-[color:var(--tw-color-o)]  
                tw:w-26  tw:sm:w-30 tw:md:w-36 tw:lg:w-48 "
          >
            <span className="tw:flex  tw:truncate">
              {String(oWins).padStart(3, "0")}
            </span>
            <span className="tw:flex">O</span>
          </span>
        </div>

        {/* Top Info Row */}
        <div className="tw:flex tw:justify-between tw:items-center tw:gap-4">
          <div
            className={`tw:flex  tw:flex-1 
              tw:w-26 tw:sm:w-30 tw:md:w-36 tw:lg:w-48 
              tw:truncate
               tw:justify-start tw:font-semibold tw:grid-display tw:text-base tw:sm:text-lg tw:md:text-xl tw:lg:text-2xl ${
                 gameOver
                   ? winner === "X"
                     ? "tw:text-[color:var(--tw-color-x)]"
                     : winner === "O"
                     ? "tw:text-[color:var(--tw-color-o)]"
                     : ""
                   : currentPlayer === "X"
                   ? "tw:text-[color:var(--tw-color-x)]"
                   : "tw:text-[color:var(--tw-color-o)]"
               }`}
          >
            {gameOver
              ? winner
                ? `Player ${winner} wins!`
                : ""
              : `Turn: ${currentPlayer}`}
          </div>

          {/* Timer */}
          <div
            className={`tw:flex tw:justify-end tw:font-semibold tw:grid-display tw:text-base tw:sm:text-lg tw:md:text-xl tw:lg:text-2xl`}
          >
            <div
              className={`tw:flex tw:items-center tw:gap-1 ${
                currentPlayer === "X"
                  ? "tw:text-[color:var(--tw-color-x)]"
                  : "tw:text-[color:var(--tw-color-o)]"
              }`}
            >
              <span>{moveTimeLeft.toFixed(2)}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="tw:w-[1em] tw:h-[1em]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{
                  color:
                    currentPlayer === "X"
                      ? "var(--tw-color-x)"
                      : "var(--tw-color-o)",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="tw:grid tw:grid-cols-3 tw:gap-2 tw:sm:gap-3 tw:md:gap-4 tw:lg:gap-4">
          {board.map((cell, i) => {
            const isDimmed = !gameStarted
              ? true
              : !gameOver
              ? (currentPlayer === "X" &&
                  xMoves.length === 3 &&
                  xMoves[0] === i) ||
                (currentPlayer === "O" &&
                  oMoves.length === 3 &&
                  oMoves[0] === i)
              : winner && winningLine
              ? !winningLine.includes(i)
              : true;

            return (
              <button
                key={i}
                onClick={() => handleMove(i)}
                type="button"
                className={`tw:btn-grid tw:aspect-square tw:w-20 
                  tw:sm:w-24 tw:md:w-28 tw:lg:w-32 tw:text-2xl
                  tw:sm:text-3xl tw:md:text-4xl tw:lg:text-5xl
                  tw:font-bold tw:select-none
                  ${isDimmed ? "tw:opacity-40 tw:pointer-events-none" : ""}
                   ${gameOver ? "tw:pointer-events-none" : ""}
                  ${
                    cell === "X"
                      ? "tw:text-[color:var(--tw-color-x)]"
                      : cell === "O"
                      ? "tw:text-[color:var(--tw-color-o)]"
                      : ""
                  }`}
              >
                {cell}
              </button>
            );
          })}
        </div>
      </div>

      {!gameStarted || gameOver ? (
        <button
          type="button"
          onClick={() => {
            if (gameOver) resetGame();
            setGameStarted(true);
          }}
          className="tw:btn-grid tw:text-[color:var(--tw-color-button-text)]"
        >
          Play
        </button>
      ) : null}
    </div>
  );
}
