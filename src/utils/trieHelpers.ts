export const getExampleWord = (node: any, currentPath: string, targetWin: boolean): string => {
  // Base case: we hit a terminal node (a word)
  if (node.e) return currentPath;

  // Try to find a branch that aligns with our goal
  // If targetWin is true, we want a path where the opponent eventually loses (v=0 for them)
  const branches = Object.entries(node.c);

  for (const [char, child]: [string, any] of branches) {
    if (child.v === (targetWin ? 1 : 0)) {
      return getExampleWord(child, currentPath + char, targetWin);
    }
  }

  // Fallback: If no perfect path, just show the first available word
  if (branches.length > 0) {
    const [char, child]: [string, any] = branches[0];
    return getExampleWord(child, currentPath + char, targetWin);
  }

  return currentPath;
};