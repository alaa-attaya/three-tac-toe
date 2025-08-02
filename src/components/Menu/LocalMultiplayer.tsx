"use client";
import GameBoard from "@/components/GameBoard";
import BackButton from "@/components/BackButton";

type Props = {
  onBack: () => void;
};

export default function LocalMultiplayer({ onBack }: Props) {
  return (
    <div className="tw:flex tw:flex-col tw:gap-4 tw:h-full tw:w-full tw:py-2 tw:px-2">
      <BackButton onClick={onBack} />

      <GameBoard mode="local" />
    </div>
  );
}
