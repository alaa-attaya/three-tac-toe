import { create } from "zustand";

export type Scene = "menu" | "vs-computer" | "local-multiplayer";

interface SceneState {
  scene: Scene;
  setScene: (scene: Scene) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  scene: "menu",
  setScene: (scene) => set({ scene }),
}));
