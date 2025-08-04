"use client";

import BackButton from "@/components/BackButton";

type Props = {
  onBack: () => void;
};
export default function Leaderboard({ onBack }: Props) {
  return (
    <div className="tw:flex tw:flex-col tw:gap-8 tw:h-full tw:w-full tw:py-2 tw:px-2">
      <BackButton onClick={onBack} />
      <div className="tw:mt-4 tw:w-full tw:max-w-md tw:rounded-xl tw:bg-surface tw:p-4 tw:shadow-md">
        <h2 className="tw:text-lg tw:font-bold tw:text-center tw:mb-4">
          Leaderboard
        </h2>
        <ul className="tw:text-sm tw:space-y-1">
          <li>#1 — Alice (15 wins)</li>
          <li>#2 — Bob (12 wins)</li>
          <li>#3 — You (8 wins)</li>
        </ul>
      </div>
    </div>
  );
}
