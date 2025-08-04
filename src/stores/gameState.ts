import { create } from "zustand";

type GameState = {
  isGameRunning: boolean;
  setIsGameRunning: (val: boolean) => void;
};

export const useGameState = create<GameState>((set) => ({
  isGameRunning: false,
  setIsGameRunning: (val) => set({ isGameRunning: val }),
}));
