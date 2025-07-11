

import json
from collections import defaultdict

def check_duplicates(json_file_path: str):
    """Checks for duplicate entries in the vocabulary JSON file based on (japanese, furigana) composite key."""
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            words = json.load(f)
    except FileNotFoundError:
        print(f"Error: The file {json_file_path} was not found.")
        return
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from the file {json_file_path}.")
        return

    seen = set()
    duplicates = []
    unique_words = []

    print(f"Starting to check for duplicates in {json_file_path}...")

    for word in words:
        # Create a unique key for each word based on its Japanese writing and furigana
        # Treat empty or missing furigana as a distinct value (e.g., for katakana words)
        furigana = word.get('furigana', '').strip()
        key = (word.get('japanese', '').strip(), furigana)

        if key in seen:
            duplicates.append(word)
        else:
            seen.add(key)
            unique_words.append(word)

    print("\n--- Duplicate Check Report ---")
    print(f"Total entries in file: {len(words)}")
    print(f"Number of unique words: {len(unique_words)}")
    print(f"Number of duplicate entries found: {len(duplicates)}")
    print("---------------------------------")

    if duplicates:
        print("\nFirst 10 duplicate entries found:")
        for i, dup in enumerate(duplicates[:10]):
            print(f"  {i+1}. Japanese: {dup.get('japanese')}, Furigana: {dup.get('furigana')}")

def main():
    """Main function to run the duplicate check."""
    json_file = 'jisho_vocabulary.json'
    check_duplicates(json_file)

if __name__ == '__main__':
    main()

