import { getExampleWord } from '../utils/trieHelpers';

interface LetterCardProps {
  char: string;
  data: any;
  input: string;
  // Visuals now contains two distinct colors
  visuals: { mainColor: string; safetyColor: string; icon: string; label: string };
  playerCount: number;
  safety: number; // The new 0-1 score we calculated
}

export default function LetterCard({ char, data, input, visuals, playerCount, safety }: LetterCardProps) {
  // input + char represents the state AFTER this letter is played
  const winWord = getExampleWord(data, input + char, true, playerCount);
  const lossWord = getExampleWord(data, input + char, false, playerCount);

  return (
    <div className="bg-white border-4 border-black p-4 flex flex-col items-center relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] transition-transform group">
      {/* Word Count Badge */}
      <div className="absolute -top-3 -right-3 bg-yellow-300 border-2 border-black px-2 py-0.5 text-[10px] font-black italic shadow-[2px_2px_0_rgba(0,0,0,1)] z-10">
        {data.n} WORDS
      </div>

      {/* Main Letter Circle - Uses Minimax Forced Outcome Color */}
      <div
        style={{ backgroundColor: visuals.mainColor }}
        className="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center text-4xl font-black text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)] mb-2"
      >
        {char.toUpperCase()}
      </div>

      {/* Status Label & Safety Score Bar */}
      <div className="mt-2 w-full">
        <div className="flex justify-between items-center mb-1">
          <span className="font-black text-[10px] uppercase tracking-tighter">
            {visuals.icon} {visuals.label}
          </span>
          <span className="font-bold text-[9px] opacity-60">
            {Math.round(safety * 100)}% SAFE
          </span>
        </div>

        {/* Progress Bar - Uses the Gradient Safety Color */}
        <div className="w-full h-2.5 bg-stone-100 border-2 border-black overflow-hidden rounded-sm">
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{
              width: `${safety * 100}%`,
              backgroundColor: visuals.safetyColor,
            }}
          />
        </div>
      </div>

      {/* Analysis Section (Example Words) */}
      <div className="mt-4 w-full space-y-1.5 pt-3 border-t-2 border-stone-200">
        {/* Win Example */}
        <div className="text-[10px] font-black uppercase truncate flex items-center gap-1">
          <span className="text-green-600 shrink-0">W:</span>
          <span className={winWord ? 'text-slate-900' : 'text-stone-300 italic font-normal'}>
            {winWord || 'No winning path'}
          </span>
        </div>

        {/* Loss Example */}
        <div className="text-[10px] font-black uppercase truncate flex items-center gap-1">
          <span className="text-red-600 shrink-0">L:</span>
          <span className={lossWord ? 'text-slate-900' : 'text-stone-300 italic font-normal'}>
            {lossWord || 'No losing path'}
          </span>
        </div>
      </div>

      {/* Subtle hover detail */}
      <div className="absolute bottom-1 right-2 text-[8px] font-bold text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity uppercase">
        {playerCount} Players
      </div>
    </div>
  );
}