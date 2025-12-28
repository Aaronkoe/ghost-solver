const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// Main helper
export const getExampleWord = (
  node: any,
  currentPath: string,
  targetWin: boolean,
  playerCount: number,
): string | null => {
  const branches = Object.entries(node.c || {});
  if (branches.length === 0) {
    // Check the current node itself if it's a word
    if (node.e) {
      const lettersAdded = 0; // We are at the end
      const isWin = lettersAdded % playerCount !== 0;
      return isWin === targetWin ? currentPath : null;
    }
    return null;
  }

  const shuffledBranches = shuffle(branches);

  for (const [char, child] of shuffledBranches as [string, any][]) {
    const word = findWordWithParity(
      child,
      currentPath + char,
      targetWin,
      playerCount,
      currentPath.length, // The index of the letter the player is currently choosing
    );
    if (word) return word;
  }

  return null; // Return null if no word with this parity exists
};

const findWordWithParity = (
  node: any,
  path: string,
  targetWin: boolean,
  playerCount: number,
  currentFragmentLength: number, // Length of the string BEFORE this search
): string | null => {
  if (node.e) {
    // A player loses if: (wordLength % playerCount) matches the current player's turn index.
    // Let's use absolute indices to keep it simple.
    // If input.length is 4, it is Player 1's turn (4 % 3 = 1).
    // Player 1 will lose on any word where wordLength % 3 === 1.

    // Standard Ghost Rule: The person who says the last letter of a 4+ word loses.
    // Let's refine the math to be bulletproof:
    const loser = path.length % playerCount;
    // If loser is 0, it means Player 3 (in a 3-man game) lost.
    const actualLoser = loser === 0 ? playerCount : loser;
    const currentPlayer = (currentFragmentLength % playerCount) + 1;

    const isWin = actualLoser !== currentPlayer;
    return isWin === targetWin ? path : null;
  }

  if (!node.c) return null;

  const shuffledKeys = shuffle(Object.keys(node.c));
  for (const char of shuffledKeys) {
    const result = findWordWithParity(
      node.c[char],
      path + char,
      targetWin,
      playerCount,
      currentFragmentLength,
    );
    if (result) return result;
  }

  return null;
};
