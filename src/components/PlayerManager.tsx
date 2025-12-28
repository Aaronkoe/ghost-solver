interface PlayerManagerProps {
  playerCount: number;
  activePlayerIndex: number;
  setPlayerCount: (count: number | ((prev: number) => number)) => void;
  gameStarted: boolean;
  onAction: () => void; // For refocusing the input
}

export default function PlayerManager({
  playerCount,
  activePlayerIndex,
  setPlayerCount,
  gameStarted,
  onAction,
}: PlayerManagerProps) {
  // 1. Core Logic Functions
  const addPlayer = () => setPlayerCount((prev) => Math.min(prev + 1, 8));
  const removePlayer = () => setPlayerCount((prev) => Math.max(prev - 1, 2));

  // 2. Click Handler Wrappers (Logic + Refocus)
  const handleAddClick = () => {
    if (!gameStarted) {
      addPlayer();
      onAction();
    }
  };

  const handleRemoveClick = () => {
    if (!gameStarted) {
      removePlayer();
      onAction();
    }
  };

  const buttonClass = (disabled: boolean) => `
    w-10 h-10 flex items-center justify-center border-2 border-slate-900 font-bold rounded-full
    transition-all relative group
    ${
      disabled
        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
        : 'bg-yellow-300 hover:bg-black hover:text-white cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
    }
  `;

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 mb-10">
      {Array.from({ length: playerCount }).map((_, i) => (
        <div
          key={i}
          className={`
            px-5 py-2 border-2 font-black uppercase transition-all rounded-lg
            ${
              activePlayerIndex === i
                ? 'bg-slate-900 text-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(253,224,71,1)]'
                : 'bg-white text-slate-400 border-slate-200'
            }
          `}
        >
          P{i + 1}
        </div>
      ))}

      <div className="flex gap-2 ml-4">
        {/* Add Button - uses handleAddClick */}
        <button
          onClick={handleAddClick}
          disabled={gameStarted}
          className={buttonClass(gameStarted)}
        >
          +
          {gameStarted && (
            <span className="absolute bottom-full mb-2 hidden group-hover:block w-32 bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg pointer-events-none z-50">
              Reset game to add players
            </span>
          )}
        </button>

        {/* Remove Button - uses handleRemoveClick */}
        {playerCount > 2 && (
          <button
            onClick={handleRemoveClick}
            disabled={gameStarted}
            className={buttonClass(gameStarted)}
          >
            –
            {gameStarted && (
              <span className="absolute bottom-full mb-2 hidden group-hover:block w-34 bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg pointer-events-none z-50">
                Reset game to remove players
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
