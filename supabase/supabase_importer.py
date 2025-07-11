

import os
import json
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_supabase_client():
    """Initializes and returns the Supabase client using credentials from .env."""
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_KEY") # Use the service role key for admin-level access

    if not url or not key:
        raise ValueError("Supabase URL and Service Key must be set in the .env file.")

    supabase: Client = create_client(url, key)
    return supabase

def import_vocabulary(supabase: Client, json_file_path: str):
    """Reads vocabulary from a JSON file and inserts it into the Supabase 'verbs' table in batches."""
    try:
        with open(json_file_path, 'r', encoding='utf-8') as f:
            words = json.load(f)
    except FileNotFoundError:
        print(f"Error: The file {json_file_path} was not found.")
        return
    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from the file {json_file_path}.")
        return

    print(f"Found {len(words)} words to import from {json_file_path}.")

    batch_size = 100
    for i in range(0, len(words), batch_size):
        batch = words[i:i + batch_size]
        print(f"Processing batch {i // batch_size + 1}/{(len(words) + batch_size - 1) // batch_size}...")
        
        try:
            # Use upsert with on_conflict to avoid errors with duplicate data
            # This will insert new words and ignore duplicates based on the (japanese, furigana) unique constraint.
            data, error = supabase.table('verbs').upsert(batch, on_conflict="japanese,furigana").execute()
            
            if error:
                # The library returns a tuple (data, error)
                # We check the second element for errors.
                print(f"Error inserting batch: {error}")
            else:
                print(f"Successfully inserted batch of {len(batch)} words.")

        except Exception as e:
            print(f"An unexpected error occurred during insertion: {e}")

    print("\nVocabulary import process finished.")

def main():
    """Main function to run the importer."""
    supabase_client = get_supabase_client()
    json_file = 'vocabulary_final.json'
    import_vocabulary(supabase_client, json_file)

if __name__ == '__main__':
    main()

