import { useState, useEffect, useMemo } from 'react';
import { getExampleWord } from './utils/trieHelpers';

export default function App() {
  const [trie, setTrie] = useState<any>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch('/trie.json')
      .then(res => res.json())
      .then(data => setTrie(data))
      .catch(err => console.error("Dictionary load failed:", err));
  }, []);

  const currentNode = useMemo(() => {
    if (!trie) return null;
    let node = trie;
    for (const char of input.toLowerCase()) {
      if (node.c && node.c[char]) {
        node = node.c[char];
      } else {
        return { error: "Not in dictionary" };
      }
    }
    return node;
  }, [trie, input]);

  const getVisuals = (node: any) => {
    const isGuaranteedWin = node.v === 1;
    const isGuaranteedLoss = node.v === 0 && node.p === 0;
    let hue = isGuaranteedWin ? 120 : (isGuaranteedLoss ? 0 : 20 + (node.p * 75));

    return {
      color: `hsl(${hue}, 85%, 40%)`,
      icon: isGuaranteedWin ? "✅" : (isGuaranteedLoss ? "❌" : "⚠️"),
      label: isGuaranteedWin ? "WIN" : (isGuaranteedLoss ? "LOSS" : `${Math.round(node.p * 100)}%`)
    };
  };

  if (!trie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-2xl font-black animate-pulse">LOADING DICTIONARY...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-12 text-stone-900 font-sans">
      <div className="max-w-6xl mx-auto">

        <header className="mb-12 text-center">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
            Ghost Solver
          </h1>
          <div className="flex justify-center gap-4 mt-4 font-mono text-xs uppercase font-bold">
            <span className="bg-black text-white px-2 py-1">Mode: Perfect Play</span>
            <span className="bg-stone-200 px-2 py-1">Dictionary: 12dicts-6of12</span>
          </div>
        </header>

        {/* Input Card - Rotation removed */}
        <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] mb-12">
          <input
            autoFocus
            className="w-full text-5xl md:text-8xl font-black text-center uppercase outline-none border-b-8 border-stone-100 focus:border-black transition-all pb-4 placeholder:opacity-10"
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/[^a-zA-Z]/g, ""))}
            placeholder="TYPE..."
          />
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setInput("")}
              className="px-6 py-2 border-4 border-black font-black hover:bg-black hover:text-white transition-all uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              Reset Game
            </button>
            <div className="text-right">
              <div className="font-black text-2xl leading-none">{input.length}</div>
              <div className="font-bold text-[10px] uppercase opacity-50 tracking-widest">Letters Typed</div>
            </div>
          </div>
        </div>

        {currentNode?.error ? (
          <div className="text-center p-16 border-8 border-dashed border-red-500 rounded-3xl">
            <h2 className="text-red-500 font-black text-4xl uppercase italic">Bluff Detected!</h2>
            <p className="font-bold text-red-400 mt-2">"{input}" is not a prefix of any valid word.</p>
          </div>
        ) : currentNode?.e ? (
          <div className="text-center p-16 bg-red-600 text-white border-8 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-black text-6xl uppercase italic">Game Over</h2>
            <p className="text-2xl font-bold mt-4">"{input.toUpperCase()}" is a complete word.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {currentNode && Object.entries(currentNode.c).map(([char, data]: [string, any]) => {
              const { color, icon, label } = getVisuals(data);
              const winWord = getExampleWord(data, input + char, true);
              const lossWord = getExampleWord(data, input + char, false);

              return (
                <div
                  key={char}
                  className="bg-white border-4 border-black p-4 flex flex-col items-center relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] transition-transform group"
                >
                  <div className="absolute -top-3 -right-3 bg-yellow-300 border-2 border-black px-2 py-0.5 text-[10px] font-black italic shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {data.n} WORDS
                  </div>

                  <div
                    style={{ backgroundColor: color }}
                    className="w-20 h-20 rounded-full border-4 border-black flex items-center justify-center text-4xl font-black text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]"
                  >
                    {char.toUpperCase()}
                  </div>

                  <div className="mt-4 w-full">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-xs uppercase">{icon} {label}</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 border-2 border-black overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${data.p * 100}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 w-full space-y-1 pt-2 border-t-2 border-stone-100">
                    <div className="text-[10px] font-black uppercase text-green-600 truncate">
                      <span className="opacity-50 mr-1">W:</span> {winWord}
                    </div>
                    <div className="text-[10px] font-black uppercase text-red-600 truncate">
                      <span className="opacity-50 mr-1">L:</span> {lossWord}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer className="mt-20 text-center opacity-30 font-black uppercase text-[10px] tracking-[0.2em]">
        Perfect Information Engine // No Bluffing Allowed
      </footer>
    </div>
  );
}