"use client";

type Props = {
  onClick: () => void;
  className?: string;
};
function BackIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 6L4 12L10 18" />
      <path d="M4 12H20" />
    </svg>
  );
}

export default function BackButton({ onClick, className = "" }: Props) {
  return (
    <button
      onClick={onClick}
      className={`tw:btn-secondary tw:w-12 tw:h-10 tw:flex tw:items-center tw:justify-center tw:text-[color:var(--tw-color-button-text)] ${className}`}
      aria-label="Back"
    >
      <div>
        <BackIcon className="tw:w-4 tw:h-4" />
      </div>
    </button>
  );
}
