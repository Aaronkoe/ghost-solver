interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border-8 border-black p-8 max-w-2xl w-full shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 font-black text-3xl hover:rotate-90 transition-transform cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-5xl font-black uppercase italic mb-6 underline decoration-yellow-400 decoration-8">
          What is Ghost?
        </h2>

        <div className="space-y-4 font-bold text-lg leading-snug">
          <p>Ghost is a game of word fragments. Players take turns adding a letter to a string.</p>
          <p className="bg-yellow-200 px-2 inline-block italic">
            If you complete a word of 4+ letters, YOU LOSE.
          </p>
          <p>
            You must always have a valid word in mind. If you are challenged and cannot name a word,
            or if you bluff, you lose.
          </p>

          <div className="p-4 bg-stone-100 border-4 border-black mt-6 space-y-2">
            <p className="text-sm">THE SOLVER:</p>
            <p className="text-sm italic">
              This engine uses Minimax logic to predict outcomes based on the 2of12 English
              dictionary.
            </p>
            <a
              href="https://www.petertheobald.com/tech/ghost-game-solver/"
              target="_blank"
              className="text-blue-600 underline text-xs block mt-2"
            >
              ALGORITHM SOURCE
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-4 bg-black text-white font-black uppercase hover:bg-yellow-300 hover:text-black transition-all border-4 border-black text-xl shadow-[8px_8px_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 cursor-pointer"
        >
          Close & Play
        </button>
      </div>
    </div>
  );
}
