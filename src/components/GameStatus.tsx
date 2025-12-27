interface GameStatusProps {
  type: string;
  input: string;
  word?: string;
  isPlayerOneTurn: boolean;
}

export default function GameStatus({ type, input, word, isPlayerOneTurn }: GameStatusProps) {
  if (type === 'bluff') {
    return (
      <div className="text-center p-16 border-8 border-dashed border-red-500 bg-red-50 rounded-3xl">
        <h2 className="text-red-500 font-black text-4xl uppercase italic underline decoration-red-500 decoration-8">
          Bluff Detected!
        </h2>
        <p className="font-black text-red-700 mt-2 uppercase italic tracking-widest text-xl">
          Zero words start with "{input}"
        </p>
      </div>
    );
  }

  if (type === 'pruned') {
    return (
      <div className="text-center p-16 border-8 border-black bg-orange-400 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="font-black text-5xl uppercase italic">Wait! Word Found Earlier</h2>
        <p className="text-xl font-bold mt-4 uppercase">
          You typed "{input}", but the game ended at{' '}
          <span className="bg-black text-white px-3 py-1 ml-1 leading-loose">"{word}"</span>.
        </p>
      </div>
    );
  }

  if (type === 'end') {
    return (
      <div className="text-center p-16 bg-red-600 text-white border-8 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="font-black text-6xl uppercase italic">Ghost!</h2>
        <p className="text-2xl font-bold mt-4 uppercase italic">
          {isPlayerOneTurn ? 'Player 2' : 'Player 1'} finished: "{input}"
        </p>
      </div>
    );
  }

  return null;
}
