import { useState, useEffect, useMemo } from 'react';
import { getExampleWord } from './utils/trieHelpers';

export default function App() {
  const [trie, setTrie] = useState<any>(null);
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('/trie.json')
      .then(res => res.json())
      .then(data => setTrie(data))
      .catch(err => console.error("Dictionary load failed:", err));
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [showModal]);

  const gameState = useMemo(() => {
    if (!trie) return { node: null, type: 'loading' };
    let node = trie;
    let path = "";
    for (const char of input.toLowerCase()) {
      if (node.c && node.c[char]) {
        node = node.c[char];
        path += char;
        if (node.e && path.length < input.length) return { node, type: 'pruned', word: path };
      } else {
        return { node: null, type: 'bluff' };
      }
    }
    if (node.e) return { node, type: 'end' };
    return { node, type: 'active' };
  }, [trie, input]);

  const isPlayerOneTurn = input.length % 2 === 0;

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

  if (!trie) return <div className="min-h-screen flex items-center justify-center bg-stone-50 font-black uppercase italic animate-pulse">Loading 2of12 Dictionary...</div>;

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-12 text-stone-900 font-sans relative">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">Ghost (Word Game) Solver</h1>
          <div className="flex justify-center gap-4 mt-4 font-mono text-xs uppercase font-bold">
            <span className="bg-black text-white px-2 py-1">2of12 Expert Mode</span>
            <button onClick={() => setShowModal(true)} className="bg-yellow-300 border-2 border-black px-2 py-1 hover:bg-black hover:text-white transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">What is this?</button>
          </div>
        </header>

        {/* Player Turns */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className={`px-6 py-2 border-4 border-black font-black uppercase transition-all ${isPlayerOneTurn ? 'bg-black text-white scale-105 shadow-[6px_6px_0px_0px_rgba(253,224,71,1)]' : 'bg-white opacity-30'}`}>Player 1</div>
          <div className="h-1 w-8 bg-black"></div>
          <div className={`px-6 py-2 border-4 border-black font-black uppercase transition-all ${!isPlayerOneTurn ? 'bg-black text-white scale-105 shadow-[6px_6px_0px_0px_rgba(253,224,71,1)]' : 'bg-white opacity-30'}`}>Player 2</div>
        </div>

        {/* Main Input */}
        <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] mb-12">
          <input autoFocus className="w-full text-5xl md:text-8xl font-black text-center uppercase outline-none border-b-8 border-stone-100 focus:border-black transition-all pb-4 placeholder:opacity-10" value={input} onChange={(e) => setInput(e.target.value.replace(/[^a-zA-Z]/g, ""))} placeholder="TYPE..." />
          <div className="flex justify-between items-center mt-6">
            <button onClick={() => setInput("")} className="px-6 py-2 border-4 border-black font-black hover:bg-black hover:text-white transition-all uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Reset</button>
            <div className="text-right"><div className="font-black text-2xl leading-none">{input.length}</div><div className="font-bold text-[10px] uppercase opacity-50">Characters</div></div>
          </div>
        </div>

        {/* State Messages */}
        {gameState.type === 'bluff' && <div className="text-center p-16 border-8 border-dashed border-red-500 bg-red-50 rounded-3xl"><h2 className="text-red-500 font-black text-4xl uppercase italic underline decoration-red-500 decoration-8">Bluff Detected!</h2><p className="font-black text-red-700 mt-2 uppercase italic tracking-widest text-xl">Zero words start with "{input}"</p></div>}
        {gameState.type === 'pruned' && <div className="text-center p-16 border-8 border-black bg-orange-400 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"><h2 className="font-black text-5xl uppercase italic">Wait! Word Found Earlier</h2><p className="text-xl font-bold mt-4 uppercase">You typed "{input}", but the game ended at <span className="bg-black text-white px-3 py-1 ml-1 leading-loose">"{gameState.word}"</span>.</p></div>}
        {gameState.type === 'end' && <div className="text-center p-16 bg-red-600 text-white border-8 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"><h2 className="font-black text-6xl uppercase italic">Ghost!</h2><p className="text-2xl font-bold mt-4 uppercase italic">{isPlayerOneTurn ? "Player 2" : "Player 1"} finished: "{input}"</p></div>}

        {/* Letter Grid */}
        {gameState.type === 'active' && gameState.node && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-20">
            {Object.entries(gameState.node.c).map(([char, data]: [string, any]) => {
              const { color, icon, label } = getVisuals(data);
              const winWord = getExampleWord(data, input + char, true);
              const lossWord = getExampleWord(data, input + char, false);
              return (
                <div key={char} className="bg-white border-4 border-black p-4 flex flex-col items-center relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] transition-transform">
                  <div className="absolute -top-3 -right-3 bg-yellow-300 border-2 border-black px-2 py-0.5 text-[10px] font-black italic shadow-[2px_2px_0_rgba(0,0,0,1)]">{data.n} WORDS</div>
                  <div style={{ backgroundColor: color }} className="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center text-4xl font-black text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]">{char.toUpperCase()}</div>
                  <div className="mt-4 w-full"><div className="flex justify-between items-center mb-1"><span className="font-black text-xs uppercase">{icon} {label}</span></div><div className="w-full h-2 bg-stone-100 border-2 border-black overflow-hidden"><div className="h-full transition-all duration-500" style={{ width: `${data.p * 100}%`, backgroundColor: color }} /></div></div>
                  <div className="mt-4 w-full space-y-1 pt-2 border-t-2 border-stone-200"><div className="text-[10px] font-black uppercase text-green-600 truncate underline decoration-green-600/30 decoration-2">W: {winWord}</div><div className="text-[10px] font-black uppercase text-red-600 truncate underline decoration-red-600/30 decoration-2">L: {lossWord}</div></div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal - Ensure this is the last item in the main div */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white border-8 border-black p-8 max-w-2xl w-full shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] relative animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 font-black text-3xl hover:rotate-90 transition-transform">✕</button>
            <h2 className="text-5xl font-black uppercase italic mb-6 underline decoration-yellow-400 decoration-8">What is Ghost?</h2>
            <div className="space-y-4 font-bold text-lg leading-snug">
              <p>Ghost is a game of word fragments. Players take turns adding a letter to a string.</p>
              <p className="bg-yellow-200 px-2 inline-block italic">If you complete a word of 4+ letters, YOU LOSE.</p>
              <p>You must always have a valid word in mind. If you are challenged and cannot name a word, or if you bluff, you lose.</p>
              <div className="p-4 bg-stone-100 border-4 border-black mt-6 space-y-2">
                <p className="text-sm">THE SOLVER:</p>
                <p className="text-sm italic">This engine uses Minimax logic to predict every possible outcome based on the 2of12 English dictionary.</p>
                <a href="https://www.petertheobald.com/tech/ghost-game-solver/" target="_blank" className="text-blue-600 underline text-xs block mt-2">ALGORITHM SOURCE</a>
              </div>
            </div>
            <button onClick={() => setShowModal(false)} className="w-full mt-8 py-4 bg-black text-white font-black uppercase hover:bg-yellow-300 hover:text-black transition-all border-4 border-black text-xl shadow-[8px_8px_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1">Close & Play</button>
          </div>
        </div>
      )}
    </div>
  );
}