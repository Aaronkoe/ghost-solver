import json
import os

def build_solver_trie(word_list_path, output_path='trie.json', min_length=4):
    processed_words = []
    print("Reading file {word_list_path}.")
    
    # 1. Load, Suffix Logic, and Cleaning
    if not os.path.exists(word_list_path):
        print(f"Error: {word_list_path} not found.")
        return

    with open(word_list_path, 'r', encoding='utf-8') as f:
        for line in f:
            word = line.strip().lower()
            
            # Rule: Completely drop words suffixed with %
            if word.endswith('%'):
                continue
            
            # Rule: Include but remove the suffix for words with !
            if word.endswith('!'):
                word = word[:-1]
            
            # Basic cleanup and length filter
            if len(word) >= min_length and word.isalpha():
                processed_words.append(word)
    
    # 2. Prefix Pruning (Ghost Rule: Game ends at the first complete word)
    processed_words.sort()
    pruned_words = []
    for word in processed_words:
        # If the current word starts with a word we've already locked in, skip it.
        # Example: if 'cat' is in, we never reach 'catalog'
        if not any(word.startswith(p) for p in pruned_words):
            pruned_words.append(word)

    print("Pruned word list.")

    # 3. Build Trie Structure
    trie = {"c": {}, "e": False}
    for word in pruned_words:
        node = trie
        for char in word:
            if char not in node["c"]:
                node["c"][char] = {"c": {}, "e": False}
            node = node["c"][char]
        node["e"] = True 

    print("Built trie.")

    # 4. Recursive Minimax (Win/Loss) & Probability calculation
    def evaluate(node):
        if node["e"]:
            # If this node is a word, the player who just moved LOST.
            # So this state is a "Loss" (0) for the next player.
            node["v"] = 0 
            node["p"] = 0
            return 0

        child_results = []
        for char in node["c"]:
            # Recurse: Get value from perspective of the next player, then invert
            opponent_win_val = evaluate(node["c"][char])
            my_win_val = 1 - opponent_win_val
            child_results.append(my_win_val)

        # v: 1 if there's at least one move that makes the opponent lose
        node["v"] = 1 if any(v == 1 for v in child_results) else 0
        
        # p: Probability of choosing a winning move at random from this node
        node["p"] = round(sum(child_results) / len(child_results), 2) if child_results else 0
        
        return node["v"]

    print("Evaluating")
    evaluate(trie)

    # 5. Export to Public Folder
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(trie, f, separators=(',', ':')) # Compact JSON
    
    print(f"Success! {len(pruned_words)} words processed into {output_path}")

# Usage
build_solver_trie('2of12.txt')
