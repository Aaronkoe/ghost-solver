import { useState, useEffect, useMemo, useRef } from 'react';
import AboutModal from './components/AboutModal';
import LetterCard from './components/LetterCard';
import PlayerManager from './components/PlayerManager';
import GameStatus from './components/GameStatus';

export default function App() {
  // --- State ---
  const [trie, setTrie] = useState<any>(null);
  const [input, setInput] = useState('');
  const [playerCount, setPlayerCount] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  // --- Data Loading ---
  useEffect(() => {
    fetch('/trie.json')
      .then((res) => res.json())
      .then((data) => setTrie(data))
      .catch((err) => console.error('Dictionary load failed:', err));
  }, []);

  // --- Game Engine Logic ---
  const gameState = useMemo(() => {
    if (!trie) return { node: null, type: 'loading' };

    let node = trie;
    let path = '';

    for (const char of input.toLowerCase()) {
      if (node.c && node.c[char]) {
        node = node.c[char];
        path += char;
        // Check if a word was completed earlier than what the user typed
        if (node.e && path.length < input.length) {
          return { node, type: 'pruned', word: path };
        }
      } else {
        return { node: null, type: 'bluff' };
      }
    }

    if (node.e) return { node, type: 'end' };
    return { node, type: 'active' };
  }, [trie, input]);

  // --- Derived State ---
  const activePlayerIndex = input.length % playerCount;

  const getVisuals = (node: any) => {
    const isGuaranteedWin = node.v === 1;
    const isGuaranteedLoss = node.v === 0 && node.p === 0;

    // HSL: 120 is Green, 0 is Red. p (probability) slides between them.
    let hue = isGuaranteedWin ? 120 : isGuaranteedLoss ? 0 : 20 + node.p * 75;

    return {
      color: `hsl(${hue}, 85%, 40%)`,
      icon: isGuaranteedWin ? '✅' : isGuaranteedLoss ? '❌' : '⚠️',
      label: isGuaranteedWin ? 'WIN' : isGuaranteedLoss ? 'LOSS' : `${Math.round(node.p * 100)}%`,
    };
  };

  if (!trie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 font-black uppercase italic animate-pulse">
        Loading 2of12 Dictionary...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-12 text-stone-900 font-sans relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
            Ghost (Word Game) Solver
          </h1>
          <div className="flex justify-center gap-4 mt-4 font-mono text-xs uppercase font-bold">
            <span className="bg-black text-white px-2 py-1 tracking-widest">2of12 Expert Mode</span>
            <button
              onClick={() => setShowModal(true)}
              className="bg-yellow-300 border-2 border-black px-2 py-1 hover:bg-black hover:text-white transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              What is this?
            </button>
          </div>
        </header>

        {/* Dynamic Player Management */}
        <PlayerManager
          playerCount={playerCount}
          activePlayerIndex={activePlayerIndex}
          setPlayerCount={setPlayerCount}
          gameStarted={input.length > 0}
          inputRefocuser={focusInput}
        />

        {/* Central Input Card */}
        <div className="bg-white border-4 border-black p-6 md:p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] mb-12">
          <input
            ref={inputRef}
            autoFocus
            className="w-full text-5xl md:text-8xl font-black text-center uppercase outline-none border-b-8 border-stone-100 focus:border-black transition-all pb-4 placeholder:opacity-10"
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/[^a-zA-Z]/g, ''))}
            placeholder="TYPE..."
          />
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => {
                setInput('');
                focusInput(); // This ensures the cursor stays in the box after clearing
              }}
              className="px-6 py-2 border-4 border-black font-black hover:bg-black hover:text-white transition-all uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              Reset
            </button>
            <div className="text-right">
              <div className="font-black text-2xl leading-none">{input.length}</div>
              <div className="font-bold text-[10px] uppercase opacity-50 tracking-tighter">
                Characters
              </div>
            </div>
          </div>
        </div>

        {/* Results / Feedback Area */}
        <GameStatus
          type={gameState.type}
          input={input}
          word={gameState.word}
          playerCount={playerCount}
        />

        {gameState.type === 'active' && gameState.node && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-20">
            {Object.entries(gameState.node.c).map(([char, data]: [string, any]) => (
              <LetterCard
                key={char}
                char={char}
                data={data}
                input={input}
                visuals={getVisuals(data)}
                playerCount={playerCount}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modular Modal */}
      <AboutModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
