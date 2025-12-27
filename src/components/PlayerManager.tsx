interface PlayerManagerProps {
  playerCount: number;
  activePlayerIndex: number;
  setPlayerCount: (count: number | ((prev: number) => number)) => void;
}

export default function PlayerManager({
  playerCount,
  activePlayerIndex,
  setPlayerCount,
}: PlayerManagerProps) {
  const addPlayer = () => setPlayerCount((prev) => Math.min(prev + 1, 8)); // Max 8 players
  const removePlayer = () => setPlayerCount((prev) => Math.max(prev - 1, 2)); // Min 2 players

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 mb-10">
      {/* Player Chips */}
      {Array.from({ length: playerCount }).map((_, i) => (
        <div
          key={i}
          className={`
            px-5 py-2 border-2 font-black uppercase transition-all rounded-lg
            ${
              activePlayerIndex === i
                ? 'bg-slate-900 text-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(253,224,71,1)] scale-105'
                : 'bg-white text-slate-400 border-slate-200'
            }
          `}
        >
          P{i + 1}
        </div>
      ))}

      {/* Control Buttons */}
      <div className="flex gap-2 ml-4">
        <button
          onClick={addPlayer}
          className="w-10 h-10 flex items-center justify-center border-2 border-slate-900 bg-yellow-300 font-bold rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer"
          title="Add Player"
        >
          +
        </button>

        {playerCount > 2 && (
          <button
            onClick={removePlayer}
            className="w-10 h-10 flex items-center justify-center border-2 border-slate-900 bg-white font-bold rounded-full hover:bg-red-500 hover:text-white transition-colors cursor-pointer text-slate-900"
            title="Remove Player"
          >
            –
          </button>
        )}
      </div>
    </div>
  );
}
