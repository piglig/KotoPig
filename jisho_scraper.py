

import requests
from bs4 import BeautifulSoup
import json
import time

def get_jisho_words_by_jlpt(level):
    """Fetches all words for a given JLPT level from Jisho.org."""
    words = []
    page = 1
    print(f"Starting to scrape JLPT {level}...")

    while True:
        url = f"https://jisho.org/search/%23jlpt-{level}?page={page}"
        try:
            response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
            response.raise_for_status() # Raise an exception for bad status codes
        except requests.exceptions.RequestException as e:
            print(f"Error fetching page {page} for {level}: {e}")
            break

        soup = BeautifulSoup(response.content, 'html.parser')

        # Find all the word blocks
        word_blocks = soup.find_all('div', class_='concept_light')

        if not word_blocks:
            print(f"No more words found for {level} on page {page}. Finished level.")
            break

        for block in word_blocks:
            japanese_block = block.find('div', class_='concept_light-representation')
            english_block = block.find('div', class_='concept_light-meanings')

            if not japanese_block or not english_block:
                continue

            furigana = ' '.join(f.get_text(strip=True) for f in japanese_block.find_all('span', class_='furigana'))
            japanese_word = japanese_block.find('span', class_='text').get_text(strip=True)
            
            # Combine furigana and japanese word if furigana exists
            full_japanese = f"{japanese_word} ({furigana})" if furigana else japanese_word

            meanings = english_block.find_all('div', class_='meanings-wrapper')
            english_senses = []
            for meaning in meanings:
                sense = meaning.find('span', class_='meaning-meaning').get_text(strip=True)
                english_senses.append(sense)
            
            english_definition = "; ".join(english_senses)

            word_data = {
                'japanese': japanese_word,
                'furigana': furigana,
                'english': english_definition,
                'jlpt_level': level.upper(),
                'part_of_speech': ", ".join(tag.get_text(strip=True) for tag in english_block.find_all('span', class_='meaning-tags'))
            }
            words.append(word_data)

        print(f"Scraped page {page} for {level}, found {len(word_blocks)} words. Total words for level: {len(words)}.")
        page += 1
        time.sleep(1) # Be respectful to the server

    return words

def main():
    """Main function to scrape all levels and save to a file."""
    all_words = []
    jlpt_levels = ['n5', 'n4', 'n3', 'n2', 'n1']

    for level in jlpt_levels:
        words_for_level = get_jisho_words_by_jlpt(level)
        all_words.extend(words_for_level)
        print(f"Finished scraping for {level}. Total words so far: {len(all_words)}\n")

    # Save to a JSON file
    output_filename = 'jisho_vocabulary.json'
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(all_words, f, ensure_ascii=False, indent=2)

    print(f"Successfully scraped all levels. Total words: {len(all_words)}.")
    print(f"Data saved to {output_filename}")

if __name__ == '__main__':
    main()

