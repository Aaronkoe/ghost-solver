export const getExampleWord = (node: any, currentPath: string, targetWin: boolean): string => {
  // Base case: we hit a terminal node (a word)
  if (node.e) return currentPath;

  // Convert entries to an array
  const branches = Object.entries(node.c || {});

  if (branches.length === 0) return currentPath;

  // Search for a branch that matches our win/loss goal
  for (const entry of branches) {
    const char = entry[0];
    const child = entry[1] as any; // Explicitly cast here instead of in the for-loop head

    if (child.v === (targetWin ? 1 : 0)) {
      return getExampleWord(child, currentPath + char, targetWin);
    }
  }

  // Fallback: If no perfect path, follow the first available character
  const [firstChar, firstChild] = branches[0];
  return getExampleWord(firstChild, currentPath + firstChar, targetWin);
};
