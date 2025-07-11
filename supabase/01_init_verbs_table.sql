-- Create the main table for vocabulary
CREATE TABLE public.verbs (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    -- Core vocabulary information
    japanese TEXT NOT NULL,
    english TEXT NOT NULL,
    
    -- Reading and type information
    furigana TEXT,
    jlpt_level VARCHAR(3), -- e.g., "N5", "N4"
    
    -- Part of speech (e.g., "Verb", "Noun", "Adjective")
    part_of_speech TEXT,
    
    -- Verb-specific details (can be NULL for non-verbs)
    conjugations JSONB, -- To store all conjugations as a JSON object
    
    -- Unique constraint based on the word and its reading
    CONSTRAINT verbs_japanese_furigana_unique UNIQUE (japanese, furigana)
);

-- Add comments to describe the table and columns for clarity
COMMENT ON TABLE public.verbs IS 'Stores Japanese vocabulary words, including verbs, nouns, adjectives, etc. This is a public, shared table.';
COMMENT ON COLUMN public.verbs.japanese IS 'The word in Japanese, often including Kanji.';
COMMENT ON COLUMN public.verbs.english IS 'The English definition(s) of the word.';
COMMENT ON COLUMN public.verbs.furigana IS 'The hiragana or katakana reading of the Japanese word.';
COMMENT ON COLUMN public.verbs.jlpt_level IS 'The JLPT level associated with the word (e.g., N5, N4, N3, N2, N1).';
COMMENT ON COLUMN public.verbs.part_of_speech IS 'The grammatical part of speech of the word.';
COMMENT ON COLUMN public.verbs.conjugations IS 'A JSON object containing various verb conjugations (e.g., masu, te, nai forms).';


-- Create indexes on frequently queried columns to improve performance
CREATE INDEX idx_verbs_japanese ON public.verbs(japanese);
CREATE INDEX idx_verbs_jlpt_level ON public.verbs(jlpt_level);

-- Enable Row Level Security (RLS) on the new table
-- This is a crucial security step in Supabase. By default, no one can access the table.
ALTER TABLE public.verbs ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone (logged in or not) to READ data from the table.
-- This is suitable for a public dictionary.
CREATE POLICY "Allow public read access"
ON public.verbs
FOR SELECT
USING (true);
