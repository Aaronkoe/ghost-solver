interface GameStatusProps {
  type: string;
  input: string;
  word?: string;
  playerCount: number; // New prop
}

export default function GameStatus({ type, input, word, playerCount }: GameStatusProps) {
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
    // Math logic: We need to know who typed the last letter of the PRUNED word
    const losingPlayerIndex = (word!.length - 1) % playerCount;

    return (
      <div className="text-center p-16 border-8 border-black bg-orange-400 rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="font-black text-5xl uppercase italic">Wait! Word Found Earlier</h2>
        <p className="text-xl font-bold mt-4 uppercase">
          The game actually ended at{' '}
          <span className="bg-black text-white px-3 py-1 ml-1 leading-loose">"{word}"</span>.
        </p>
        <p className="mt-2 font-black uppercase text-sm">
          Player {losingPlayerIndex + 1} loses this round.
        </p>
      </div>
    );
  }

  if (type === 'end') {
    // Math logic: The person who typed the last letter in the input box is the loser
    const losingPlayerIndex = (input.length - 1) % playerCount;

    return (
      <div className="text-center p-16 bg-red-600 text-white border-8 border-black rounded-3xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="font-black text-6xl uppercase italic">Ghost!</h2>
        <p className="text-2xl font-bold mt-4 uppercase italic">
          Player {losingPlayerIndex + 1} finished: "{input}"
        </p>
        <p className="text-sm font-bold opacity-80 uppercase mt-2">
          They take a letter toward G-H-O-S-T
        </p>
      </div>
    );
  }

  return null;
}
