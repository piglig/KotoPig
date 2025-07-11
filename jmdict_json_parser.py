

import json
import time

def parse_jmdict_json(input_path: str, output_path: str):
    """Parses a JSON version of the JMdict dictionary to a simplified format."""
    print(f"Loading JMdict data from {input_path}...")
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: Input file not found at {input_path}")
        return
    except json.JSONDecodeError:
        print(f"Error: Failed to decode JSON from {input_path}")
        return

    words_to_process = data.get('words', [])
    total_words = len(words_to_process)
    print(f"Found {total_words} entries to process.")

    processed_words = []
    seen_keys = set()
    start_time = time.time()

    for i, entry in enumerate(words_to_process):
        # Get the most common Japanese writing (usually the first kanji form)
        japanese = ""
        if entry.get('kanji'):
            japanese = entry['kanji'][0].get('text', '')

        # Get the most common reading (usually the first kana form)
        furigana = ""
        if entry.get('kana'):
            furigana = entry['kana'][0].get('text', '')

        # If there is no kanji form, the kana form is the main representation
        if not japanese:
            japanese = furigana
            furigana = "" # Furigana is not needed if it's the same as the main word

        # Skip entries without a primary Japanese representation
        if not japanese:
            continue

        # --- Deduplication Logic ---
        key = (japanese, furigana)
        if key in seen_keys:
            continue
        seen_keys.add(key)

        # --- Sense and Definition Processing ---
        senses = entry.get('sense', [])
        if not senses:
            continue

        # For simplicity, we'll take the parts of speech from the first sense
        part_of_speech = ", ".join(senses[0].get('partOfSpeech', []))

        # Aggregate all English glossaries from all senses
        all_glosses = []
        for sense in senses:
            for gloss in sense.get('gloss', []):
                gloss_text = gloss.get('text')
                if gloss_text:
                    all_glosses.append(gloss_text)
        
        english = "; ".join(all_glosses)

        if not english:
            continue

        # Assemble the final object for our database
        processed_word = {
            "japanese": japanese,
            "furigana": furigana,
            "english": english,
            "jlpt_level": None,  # JMdict does not contain JLPT levels
            "part_of_speech": part_of_speech,
            "conjugations": None
        }
        processed_words.append(processed_word)

        # Print progress
        if (i + 1) % 5000 == 0:
            print(f"Processed {i + 1}/{total_words} entries...")

    end_time = time.time()
    print(f"\nFinished processing all entries in {end_time - start_time:.2f} seconds.")

    # Save the cleaned and processed data to the output file
    print(f"Saving {len(processed_words)} unique words to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(processed_words, f, ensure_ascii=False, indent=2)

    print("\n--- Parsing Report ---")
    print(f"Total entries in source file: {total_words}")
    print(f"Total unique words processed and saved: {len(processed_words)}")
    print("------------------------")

def main():
    """Main function to run the parser."""
    input_file = 'jmdict-eng-3.6.1.json'
    output_file = 'vocabulary_final.json'
    parse_jmdict_json(input_file, output_file)

if __name__ == '__main__':
    main()

