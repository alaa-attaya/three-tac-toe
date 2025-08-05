"use client";
import { useSceneStore } from "@/stores/sceneStore";
import Menu from "./Menu/Menu";
import Leaderboard from "./Menu/Leaderboard";
import LocalMultiplayer from "./Menu/LocalMultiplayer";
import OnlineMultiplayer from "./Menu/OnlineMultiplayer";
import VsComputer from "./Menu/VsComputer";
import Settings from "./Settings";
import Signin from "./Signin";

export default function Game() {
  const scene = useSceneStore((state) => state.scene);
  const setScene = useSceneStore((state) => state.setScene);

  return (
    <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:px-4 tw:w-full tw:gap-6">
      <div
        className="
          tw:relative
          tw:end:w-[95vw]
          tw:lg:w-[65vw]
          tw:min-h-[85vh]
          tW:end:min-h-[70vh]
          tw:sm:min-h-[80vh]
          tw:bg-[color:var(--tw-color-screen)]
          tw:rounded-xl
          tw:p-4
          tw:border tw:border-[color:var(--tw-color-neon)]
          tw:border-t-[4px] tw:border-b-[4px] tw:border-l-[1px] tw:border-r-[1px]
          tw:animate-neon-border
        
        "
      >
        {scene === "menu" && <Menu />}
        {scene === "leaderboard" && (
          <Leaderboard onBack={() => setScene("menu")} />
        )}
        {scene === "vs-computer" && (
          <VsComputer onBack={() => setScene("menu")} />
        )}
        {scene === "local-multiplayer" && (
          <LocalMultiplayer onBack={() => setScene("menu")} />
        )}
        {scene === "online-multiplayer" && (
          <OnlineMultiplayer onBack={() => setScene("menu")} />
        )}
        {scene === "signin" && <Signin onBack={() => setScene("menu")} />}
        {scene === "settings" && <Settings onBack={() => setScene("menu")} />}
      </div>
    </div>
  );
}
