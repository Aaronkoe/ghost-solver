import json

def explore_trie(json_path):
    try:
        with open(json_path, 'r') as f:
            trie = json.load(f)
    except FileNotFoundError:
        print(f"Error: {json_path} not found. Run your preprocessing script first!")
        return

    print("--- Ghost Trie Explorer ---")
    print("Commands: 'exit' to quit, 'clear' to reset fragment.")
    
    current_path = ""
    current_node = trie

    while True:
        prompt = f"\nCurrent Fragment: '{current_path}'"
        print(prompt)
        print("-" * len(prompt))
        
        # 1. Display Node Info
        if current_node:
            status = "WINNABLE" if current_node.get("v") == 1 else "LOSING"
            prob = current_node.get("p", 0) * 100
            print(f"Status: {status} | Win Probability: {prob:.0f}%")
            
            # Find the best move (a child that leads to an opponent's loss)
            best_moves = [char for char, child in current_node["c"].items() if child.get("v") == 0]
            print(f"Available Letters: {', '.join(current_node['c'].keys())}")
            if best_moves:
                print(f"⭐ Recommended Moves: {', '.join(best_moves)}")
            elif current_node["c"]:
                print("⚠️ No winning moves! Opponent can force a win.")
        
        # 2. User Input
        cmd = input("\nType a letter to append (or command): ").strip().lower()

        if cmd == 'exit':
            break
        elif cmd == 'clear':
            current_path = ""
            current_node = trie
            continue
        elif len(cmd) == 1 and cmd.isalpha():
            if cmd in current_node["c"]:
                current_path += cmd
                current_node = current_node["c"][cmd]
                
                if current_node.get("e"):
                    print(f"\n!!! GAME OVER !!! '{current_path}' is a complete word.")
                    current_path = ""
                    current_node = trie
            else:
                print(f"\n❌ '{cmd}' is not a valid continuation of '{current_path}'.")
        else:
            print("Please enter a single letter.")

if __name__ == "__main__":
    explore_trie('trie.json')
