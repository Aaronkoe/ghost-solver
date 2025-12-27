import LetterCard from './LetterCard';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONTENT = {
  intro: {
    heading: 'Computer analyzer for the spelling game Ghost.',
    body: "This website solves the word game Ghost. You may not know it by name, but it’s a staple of road trips and waiting rooms. I built this because I was surprised to find no web-based solver existed to help players perform post-game analyses or settle disputes over 'perfect' moves.",
  },
  rules: {
    label: 'HOW THE GAME WORKS',
    description:
      'Players take turns calling out letters to build a word fragment. Every letter must be the start of a real word, but the goal is not to be the one who actually completes it.',
    bullets: [
      'If you finish a word (minimum 4 letters), you lose the round.',
      "If you suspect your opponent is bluffing, you can challenge them. If they can't name a word, they lose.",
      "Lose five rounds, and you've spelled G-H-O-S-T. You're out.",
    ],
    wikiLink: 'Read the full rules on Wikipedia →',
    wikiUrl: 'https://en.wikipedia.org/wiki/Ghost_(game)',
  },
  guide: {
    label: 'READING THE SOLVER',
    letterDesc: 'The Letter: Shows your next possible move.',
    statusDesc:
      "The Status: A green 'Win' means that if you play perfectly from here, the other player is mathematically forced to lose.",
    countDesc:
      'The Word Count: Found in the top corner, this shows how many unique words are still reachable through this branch.',
    sampleDesc: 'Sample Words: A couple of sample words that could result from this letter.',
  },
  engine: {
    label: 'THE ENGINE',
    description:
      'This engine uses a Minimax algorithm to walk a 2of12 English dictionary trie. It treats Ghost as a zero-sum game of perfect information. You can explore the logic behind this implementation at',
    blogLink: "Peter Theobald's technical blog.",
    blogUrl: 'https://www.petertheobald.com/tech/ghost-game-solver/',
  },
  cta: 'Return to Solver',
};

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="bg-white border-2 border-slate-900 p-6 md:p-12 max-w-3xl w-full shadow-2xl relative overflow-y-auto max-h-[90vh] rounded-xl text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="fixed md:absolute top-6 right-8 text-slate-400 hover:text-slate-900 text-2xl transition-colors cursor-pointer"
        >
          ✕
        </button>

        <section className="space-y-8 leading-relaxed">
          {/* Introduction */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">
              {CONTENT.intro.heading}
            </h2>
            <p className="text-lg">{CONTENT.intro.body}</p>
          </div>

          <hr className="border-slate-100" />

          {/* Rules Section */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
              {CONTENT.rules.label}
            </h3>
            <div className="space-y-4 text-slate-600">
              <p>{CONTENT.rules.description}</p>
              <ul className="list-disc pl-5 space-y-2 italic">
                {CONTENT.rules.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
              <a
                href={CONTENT.rules.wikiUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-sm font-bold text-blue-600 hover:underline mt-2"
              >
                {CONTENT.rules.wikiLink}
              </a>
            </div>
          </div>

          {/* UI Guide with Real Component */}
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
              {CONTENT.guide.label}
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-40 shrink-0 pointer-events-none opacity-80">
                <LetterCard
                  char="q"
                  data={{ n: 12, v: 1, p: 1 }}
                  input="sample"
                  visuals={{ color: 'hsl(120, 85%, 40%)', icon: '✅', label: 'WIN' }}
                />
              </div>
              <div className="text-sm space-y-3">
                <p>
                  <strong>{CONTENT.guide.letterDesc.split(':')[0]}:</strong>
                  {CONTENT.guide.letterDesc.split(':')[1]}
                </p>
                <p>
                  <strong>{CONTENT.guide.statusDesc.split(':')[0]}:</strong>
                  {CONTENT.guide.statusDesc.split(':')[1]}
                </p>
                <p>
                  <strong>{CONTENT.guide.countDesc.split(':')[0]}:</strong>
                  {CONTENT.guide.countDesc.split(':')[1]}
                </p>
                <p>
                  <strong>{CONTENT.guide.sampleDesc.split(':')[0]}:</strong>
                  {CONTENT.guide.sampleDesc.split(':')[1]}
                </p>
              </div>
            </div>
          </div>

          {/* Algorithm Section */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
              {CONTENT.engine.label}
            </h3>
            <p className="text-sm text-slate-600 italic">
              {CONTENT.engine.description}{' '}
              <a
                href={CONTENT.engine.blogUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 font-bold underline"
              >
                {CONTENT.engine.blogLink}
              </a>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors cursor-pointer shadow-lg active:scale-[0.98]"
          >
            {CONTENT.cta}
          </button>
        </section>
      </div>
    </div>
  );
}
