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
  startIndex: number,
): string | null => {
  if (node.e) {
    // Logic: startIndex is the turn index of the move currently being evaluated.
    // path.length - startIndex is how many turns from "now" the word ends.
    const turnsFromNow = path.length - startIndex;
    const isMyLoss = turnsFromNow % playerCount === 0;
    const isWin = !isMyLoss;

    if (isWin === targetWin) return path;
  }

  if (!node.c) return null;

  const shuffledKeys = shuffle(Object.keys(node.c));
  for (const char of shuffledKeys) {
    const result = findWordWithParity(
      node.c[char],
      path + char,
      targetWin,
      playerCount,
      startIndex,
    );
    if (result) return result;
  }

  return null;
};
