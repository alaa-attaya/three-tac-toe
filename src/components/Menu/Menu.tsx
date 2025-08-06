"use client";

import { useSceneStore } from "@/stores/sceneStore";

export default function Menu() {
  const setScene = useSceneStore((state) => state.setScene);

  return (
    <div className="tw:flex tw:flex-col tw:gap-4 tw:sm:gap-6 tw:py-2 tw:px-2 tw:items-center tw:justify-center tw:min-h-[70vh]">
      <div className="tw:py-4 tw:px-4">
        <h2 className="tw:text-center tw:text-4xl tw:font-bold tw:text-[color:var(--tw-color-title)]">
          Menu
        </h2>
      </div>

      <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-4 tw:sm:gap-6  tw:px-8 tw:py-8 tw:w-full">
        <button
          type="button"
          className="tw:btn-secondary"
          onClick={() => setScene("online-multiplayer")}
        >
          Online
        </button>
        <button
          type="button"
          className="tw:btn-secondary"
          onClick={() => setScene("local-multiplayer")}
        >
          Local
        </button>
        <button
          type="button"
          className="tw:btn-secondary"
          onClick={() => setScene("vs-computer")}
        >
          Computer
        </button>
      </div>
    </div>
  );
}
