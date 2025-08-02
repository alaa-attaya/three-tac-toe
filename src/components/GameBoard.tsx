"use client";
import { useEffect, useState } from "react";

type Props = {
  mode: "local" | "vs-computer" | "online";
};

type Cell = "X" | "O" | null;

export default function GameBoard({ mode }: Props) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Cell>("X");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Cell>(null);
  const [turnTime, setTurnTime] = useState(20);
  const [totalTime, setTotalTime] = useState(5 * 60);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setTurnTime((t) => {
        if (t <= 1) {
          endGame(null, `${currentPlayer} ran out of time`);
          return 20;
        }
        return t - 1;
      });

      setTotalTime((t) => {
        if (t <= 1) {
          endGame(null, "Game timed out");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlayer, gameOver]);

  const handleMove = (i: number) => {
    if (gameOver || board[i]) return;

    const updated = [...board];
    updated[i] = currentPlayer;
    setBoard(updated);

    if (checkWin(updated, currentPlayer)) {
      endGame(currentPlayer);
    } else if (updated.every((cell) => cell)) {
      endGame(null, "Draw");
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      setTurnTime(20);
    }
  };

  const endGame = (winner: Cell, reason?: string) => {
    setGameOver(true);
    setWinner(winner);
  };

  const checkWin = (b: Cell[], p: Cell) => {
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
    return lines.some(([a, b1, c]) => b[a] === p && b[b1] === p && b[c] === p);
  };

  const formatTime = (t: number) =>
    `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;

  return (
    <div className="tw:flex tw:flex-col tw:items-center tw:gap-4 tw:sm:gap-6 tw:w-full">
      {/* Player + Timer */}
      <div className="tw:flex tw:flex-col tw:items-center tw:gap-1">
        <div className="tw:text-xl tw:font-semibold">
          Turn:{" "}
          <span
            className={
              currentPlayer === "X"
                ? "tw:text-[color:var(--tw--color-x)]"
                : "tw:text-[color:var(--tw--color-o)]"
            }
          >
            {currentPlayer}
          </span>
        </div>
        <div className="tw:text-sm tw:text-[color:var(--tw-color-muted)]">
          Draw in: {formatTime(totalTime)} — Move in: {turnTime}s
        </div>
      </div>

      {/* Board */}
      <div className="tw:grid tw:grid-cols-3 tw:gap-2 tw:sm:gap-3 tw:md:gap-4 tw:lg:gap-4">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleMove(i)}
            className={`
        tw:btn-grid
        tw:aspect-square
        tw:w-20
        tw:sm:w-24
        tw:md:w-28
        tw:lg:w-32
        tw:text-2xl
        tw:sm:text-3xl
        tw:md:text-4xl
        tw:lg:text-5xl
        tw:font-bold
        tw:select-none
        ${
          cell === "X"
            ? "tw:text-[color:var(--tw-color-x)]"
            : cell === "O"
            ? "tw:text-[color:var(--tw-color-o)]"
            : ""
        }
      `}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Result */}
      {gameOver && (
        <div className="tw:mt-6 tw:text-lg tw:font-medium">
          {winner ? `Player ${winner} wins!` : "It's a draw!"}
        </div>
      )}
    </div>
  );
}
