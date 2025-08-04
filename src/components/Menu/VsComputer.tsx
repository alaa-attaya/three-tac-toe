"use client";
import GameBoardVsComputer from "@/components/GameBoardVsComputer";
import BackButton from "@/components/BackButton";

type Props = {
  onBack: () => void;
};

export default function VsComputer({ onBack }: Props) {
  return (
    <div className="tw:flex tw:flex-col tw:gap-8 tw:h-full tw:w-full tw:py-2 tw:px-2">
      <BackButton onClick={onBack} />

      <GameBoardVsComputer />
    </div>
  );
}
