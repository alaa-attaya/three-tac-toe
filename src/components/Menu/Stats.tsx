"use client";
import BackButton from "@/components/BackButton";

type Props = {
  onBack: () => void;
};

export default function Stats({ onBack }: Props) {
  return (
    <div className="tw:flex tw:flex-col tw:gap-8 tw:h-full tw:w-full tw:py-2 tw:px-2">
      <BackButton onClick={onBack} />

      <div className="tw:mt-4 tw:w-full tw:max-w-md tw:rounded-xl tw:bg-surface tw:p-4 tw:shadow-md">
        <h2 className="tw:text-lg tw:font-bold tw:text-center tw:mb-4">
          Your Stats
        </h2>
        <ul className="tw:text-sm tw:space-y-1">
          <li>Games Played: 12</li>
          <li>Wins: 8</li>
          <li>Losses: 4</li>
          <li>Best Mode: Vs Computer</li>
        </ul>
      </div>
    </div>
  );
}
