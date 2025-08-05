"use client";

import BackButton from "@/components/BackButton";

type Props = {
  onBack: () => void;
};

export default function Settings({ onBack }: Props) {
  return (
    <div className="tw:flex tw:flex-col tw:gap-8 tw:h-full tw:w-full tw:py-2 tw:px-2">
      <BackButton onClick={onBack} />
    </div>
  );
}
