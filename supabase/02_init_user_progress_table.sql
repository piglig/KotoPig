-- Create the user-specific vocabulary progress table
CREATE TABLE public.user_vocabulary_progress (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    
    -- Foreign key to the user table in the auth schema
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Foreign key to the shared vocabulary table
    verb_id BIGINT NOT NULL REFERENCES public.verbs(id) ON DELETE CASCADE,
    
    -- User-specific learning status fields
    is_learned BOOLEAN DEFAULT FALSE NOT NULL,
    last_reviewed_at TIMESTAMPTZ,
    review_interval_days INTEGER DEFAULT 1 NOT NULL,
    
    -- Other potential user-specific fields
    -- notes TEXT,
    -- mastery_level SMALLINT DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    -- A user can only have one progress entry per word
    CONSTRAINT user_vocabulary_progress_user_id_verb_id_unique UNIQUE (user_id, verb_id)
);

-- Add comments for clarity
COMMENT ON TABLE public.user_vocabulary_progress IS 'Tracks the learning progress of each user for each vocabulary word.';
COMMENT ON COLUMN public.user_vocabulary_progress.user_id IS 'A reference to the user in the auth.users table.';
COMMENT ON COLUMN public.user_vocabulary_progress.verb_id IS 'A reference to the word in the public.verbs table.';
COMMENT ON COLUMN public.user_vocabulary_progress.is_learned IS 'True if the user has marked the word as learned.';
COMMENT ON COLUMN public.user_vocabulary_progress.last_reviewed_at IS 'The timestamp of the last review session for this word by the user.';
COMMENT ON COLUMN public.user_vocabulary_progress.review_interval_days IS 'The interval in days for the next spaced repetition review.';

-- Create indexes for faster lookups
CREATE INDEX idx_user_vocabulary_progress_user_id ON public.user_vocabulary_progress(user_id);
CREATE INDEX idx_user_vocabulary_progress_verb_id ON public.user_vocabulary_progress(verb_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_vocabulary_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_vocabulary_progress

-- 1. Users can view their own progress.
CREATE POLICY "Users can view their own progress" 
ON public.user_vocabulary_progress
FOR SELECT USING (auth.uid() = user_id);

-- 2. Users can create their own progress entries.
CREATE POLICY "Users can create their own progress" 
ON public.user_vocabulary_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own progress.
CREATE POLICY "Users can update their own progress" 
ON public.user_vocabulary_progress
FOR UPDATE USING (auth.uid() = user_id);

-- 4. Users can delete their own progress entries.
CREATE POLICY "Users can delete their own progress"
ON public.user_vocabulary_progress
FOR DELETE USING (auth.uid() = user_id);
