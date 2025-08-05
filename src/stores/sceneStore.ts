import { create } from "zustand";

export type Scene =
  | "menu"
  | "leaderboard"
  | "vs-computer"
  | "local-multiplayer"
  | "online-multiplayer"
  | "signin"
  | "settings";

interface SceneState {
  scene: Scene;
  setScene: (scene: Scene) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  scene: "menu",
  setScene: (scene) => set({ scene }),
}));
