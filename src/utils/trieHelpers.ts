const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const findWordWithParity = (
  node: any,
  path: string,
  targetWin: boolean,
  playerCount: number,
  actorIndex: number,
): string | null => {
  // If this node represents a completed word
  if (node.e) {
    // The player who typed the last letter loses.
    // Index of the last letter is (length - 1)
    const loserIndex = (path.length - 1) % playerCount;

    // The actor wins if they are NOT the loser
    const isWin = loserIndex !== actorIndex;
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
      actorIndex
    );
    if (result) return result;
  }

  return null;
};

export const getExampleWord = (
  node: any,
  currentPath: string,
  targetWin: boolean,
  playerCount: number,
): string | null => {
  // The "actor" is the person who just played the letter that created currentPath.
  // Their move is at the last index of currentPath.
  const actorIndex = (currentPath.length - 1) % playerCount;

  return findWordWithParity(node, currentPath, targetWin, playerCount, actorIndex);
};

export const calculateSafety = (node: any, currentPath: string, playerCount: number): number => {
  let totalWords = 0;
  let actorLosses = 0;
  const actorIndex = (currentPath.length - 1) % playerCount;

  const traverse = (n: any, path: string) => {
    if (n.e) {
      totalWords++;
      const loserIndex = (path.length - 1) % playerCount;
      if (loserIndex === actorIndex) {
        actorLosses++;
      }
    }
    if (n.c) {
      for (const char in n.c) {
        traverse(n.c[char], path + char);
      }
    }
  };

  traverse(node, currentPath);
  return totalWords === 0 ? 0 : 1 - actorLosses / totalWords;
};