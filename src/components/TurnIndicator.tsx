interface TurnIndicatorProps {
  isPlayerOneTurn: boolean;
}

export default function TurnIndicator({ isPlayerOneTurn }: TurnIndicatorProps) {
  return (
    <div className="flex justify-center items-center gap-4 mb-8">
      <div
        className={`px-6 py-2 border-4 border-black font-black uppercase transition-all
        ${isPlayerOneTurn ? 'bg-black text-white scale-105 shadow-[6px_6px_0px_0px_rgba(253,224,71,1)]' : 'bg-white opacity-30'}`}
      >
        Player 1
      </div>
      <div className="h-1 w-8 bg-black"></div>
      <div
        className={`px-6 py-2 border-4 border-black font-black uppercase transition-all
        ${!isPlayerOneTurn ? 'bg-black text-white scale-105 shadow-[6px_6px_0px_0px_rgba(253,224,71,1)]' : 'bg-white opacity-30'}`}
      >
        Player 2
      </div>
    </div>
  );
}
