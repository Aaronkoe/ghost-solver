import { useState, useEffect, useMemo } from 'react';
import AboutModal from './components/AboutModal';
import LetterCard from './components/LetterCard';
import TurnIndicator from './components/TurnIndicator';
import GameStatus from './components/GameStatus';

export default function App() {
  const [trie, setTrie] = useState<any>(null);
  const [input, setInput] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('/trie.json')
      .then((res) => res.json())
      .then(setTrie);
  }, []);

  const gameState = useMemo(() => {
    if (!trie) return { node: null, type: 'loading' };
    let node = trie;
    let path = '';
    for (const char of input.toLowerCase()) {
      if (node.c?.[char]) {
        node = node.c[char];
        path += char;
        if (node.e && path.length < input.length) return { node, type: 'pruned', word: path };
      } else return { node: null, type: 'bluff' };
    }
    return { node, type: node.e ? 'end' : 'active' };
  }, [trie, input]);

  const getVisuals = (node: any) => {
    const isGuaranteedWin = node.v === 1;
    const isGuaranteedLoss = node.v === 0 && node.p === 0;
    let hue = isGuaranteedWin ? 120 : isGuaranteedLoss ? 0 : 20 + node.p * 75;
    return {
      color: `hsl(${hue}, 85%, 40%)`,
      icon: isGuaranteedWin ? '✅' : isGuaranteedLoss ? '❌' : '⚠️',
      label: isGuaranteedWin ? 'WIN' : isGuaranteedLoss ? 'LOSS' : `${Math.round(node.p * 100)}%`,
    };
  };

  if (!trie)
    return (
      <div className="min-h-screen flex items-center justify-center font-black uppercase italic animate-pulse">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-12 text-stone-900 font-sans relative">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Ghost Solver (Hi Nina hehe)
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 bg-yellow-300 border-2 border-black px-2 py-1 font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            What is this?
          </button>
        </header>

        <TurnIndicator isPlayerOneTurn={input.length % 2 === 0} />

        {/* Input Card */}
        <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] mb-12">
          <input
            autoFocus
            className="w-full text-5xl md:text-8xl font-black text-center uppercase outline-none border-b-8 border-stone-100 focus:border-black transition-all pb-4"
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/[^a-zA-Z]/g, ''))}
            placeholder="TYPE..."
          />
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setInput('')}
              className="px-6 py-2 border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white"
            >
              Reset
            </button>
            <div className="text-right font-black text-2xl uppercase opacity-50">
              {input.length} Chars
            </div>
          </div>
        </div>

        {/* Modular Status Area */}
        <GameStatus
          type={gameState.type}
          input={input}
          word={gameState.word}
          isPlayerOneTurn={input.length % 2 === 0}
        />

        {/* Modular Grid Area */}
        {gameState.type === 'active' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-20">
            {Object.entries(gameState.node.c).map(([char, data]: [string, any]) => (
              <LetterCard
                key={char}
                char={char}
                data={data}
                input={input}
                visuals={getVisuals(data)}
              />
            ))}
          </div>
        )}
      </div>

      <AboutModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
