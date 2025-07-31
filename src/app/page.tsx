import Game from "@/components/Game";

export default function Page() {
  return (
    <div
      className="tw:min-h-[calc(100vh-4rem)] 
    tw:flex tw:flex-col tw:justify-center tw:items-center  tw:md:justify-center tw:md:items-center tw:bg-bg"
    >
      <Game />
    </div>
  );
}
