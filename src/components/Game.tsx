"use client";
import { useState } from "react";
import Menu from "./Menu/Menu";
import Stats from "./Menu/Stats";
import Leaderboard from "./Menu/Leaderboard";

type Scene =
  | "menu"
  | "stats"
  | "leaderboard"
  | "vs-computer"
  | "local-multiplayer"
  | "online-multiplayer";

export default function Game() {
  const [scene, setScene] = useState<Scene>("menu");

  return (
    <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:px-4 tw:w-full tw:gap-6">
      <div
        className="
          tw:relative
          tw:w-[95vw]
          tw:lg:w-[65vw]
          tw:min-h-[60vh]
          tw:sm:min-h-[80vh]
          tw:bg-[color:var(--tw-color-screen)]
          tw:rounded-xl
          tw:p-4
          tw:border tw:border-[color:var(--tw-color-neon)]
          tw:border-t-[4px] tw:border-b-[4px] tw:border-l-[1px] tw:border-r-[1px]
          tw:animate-neon-border
        "
      >
        {scene === "menu" && <Menu setScene={setScene} />}
        {scene === "stats" && <Stats />}
        {scene === "leaderboard" && <Leaderboard />}
        {scene === "vs-computer" && <p>Coming Soon: Vs Computer</p>}
        {scene === "local-multiplayer" && <p>Coming Soon: Local Multiplayer</p>}
        {scene === "online-multiplayer" && (
          <p>Coming Soon: Online Multiplayer</p>
        )}
      </div>
    </div>
  );
}
