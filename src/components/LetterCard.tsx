import { getExampleWord } from '../utils/trieHelpers';

interface LetterCardProps {
  char: string;
  data: any;
  input: string;
  visuals: { color: string; icon: string; label: string };
}

export default function LetterCard({ char, data, input, visuals }: LetterCardProps) {
  const winWord = getExampleWord(data, input + char, true);
  const lossWord = getExampleWord(data, input + char, false);

  return (
    <div className="bg-white border-4 border-black p-4 flex flex-col items-center relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] transition-transform">
      <div className="absolute -top-3 -right-3 bg-yellow-300 border-2 border-black px-2 py-0.5 text-[10px] font-black italic shadow-[2px_2px_0_rgba(0,0,0,1)]">
        {data.n} WORDS
      </div>
      <div
        style={{ backgroundColor: visuals.color }}
        className="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center text-4xl font-black text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]"
      >
        {char.toUpperCase()}
      </div>
      <div className="mt-4 w-full">
        <div className="flex justify-between items-center mb-1">
          <span className="font-black text-xs uppercase">
            {visuals.icon} {visuals.label}
          </span>
        </div>
        <div className="w-full h-2 bg-stone-100 border-2 border-black overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${data.p * 100}%`, backgroundColor: visuals.color }}
          />
        </div>
      </div>
      <div className="mt-4 w-full space-y-1 pt-2 border-t-2 border-stone-200">
        <div className="text-[10px] font-black uppercase text-green-600 truncate underline decoration-green-600/30 decoration-2">
          W: {winWord}
        </div>
        <div className="text-[10px] font-black uppercase text-red-600 truncate underline decoration-red-600/30 decoration-2">
          L: {lossWord}
        </div>
      </div>
    </div>
  );
}
