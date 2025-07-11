
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient'; // Import the Supabase client

const WordContext = createContext();

export const WordProvider = ({ children }) => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      try {
        // Fetch data from the 'verbs' table in Supabase
        const { data, error } = await supabase
          .from('verbs')
          .select('id, japanese, english, furigana, part_of_speech, jlpt_level') // Select specific columns
          .limit(2000); // Limit the initial load for performance

        if (error) {
          throw error;
        }

        setWords(data || []);
      } catch (err) {
        console.error("Error fetching words from Supabase:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  // The old progress logic will be replaced later with a database-driven system.
  // For now, we provide a simplified context.

  const value = {
    words,
    loading,
    error,
    // Placeholder functions for future implementation
    learnWord: (word) => console.log("Learn word (not implemented):", word),
    updateReviewProgress: (word, isCorrect) => console.log("Update progress (not implemented):", word, isCorrect),
    getWordsToReview: () => [],
  };

  return (
    <WordContext.Provider value={value}>
      {children}
    </WordContext.Provider>
  );
};

export const useWordContext = () => useContext(WordContext);
