"use client";
import { useUserStore } from "@/stores/userStore";

type Scene =
  | "menu"
  | "stats"
  | "leaderboard"
  | "vs-computer"
  | "local-multiplayer"
  | "online-multiplayer";

type Props = {
  setScene: (scene: Scene) => void;
};

export default function Menu({ setScene }: Props) {
  const username = useUserStore((state) => state.username);

  return (
    <div className="tw:flex tw:flex-col tw:gap-4 tw:sm:gap-6 tw:py-2 tw:px-2 tw:items-center">
      <div className="tw:py-4 tw:px-4">
        <h2 className="tw:text-center tw:text-4xl tw:font-bold tw:text-[color:var(--tw-color-title)]">
          Menu
        </h2>
      </div>

      <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-4 tw:sm:gap-6  tw:px-8 tw:py-8 tw:w-full">
        <button
          className="tw:btn-secondary"
          onClick={() => setScene("online-multiplayer")}
        >
          Online
        </button>
        <button
          className="tw:btn-secondary"
          onClick={() => setScene("local-multiplayer")}
        >
          Local
        </button>
        <button
          className="tw:btn-secondary"
          onClick={() => setScene("vs-computer")}
        >
          Computer
        </button>
        <button
          className="tw:btn-secondary"
          onClick={() => {
            if (!username) {
              setScene("stats");
              return;
            }
            setScene("stats");
          }}
        >
          Stats
        </button>
        <button
          className="tw:btn-secondary"
          onClick={() => setScene("leaderboard")}
        >
          Leaderboard
        </button>
      </div>
    </div>
  );
}
