import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

const WordContext = createContext();

const PAGE_SIZE = 50; // Define how many words to fetch per page

export const WordProvider = ({ children }) => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false); // New state for fetching more data
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // Current page number
  const [hasMore, setHasMore] = useState(true); // Whether there's more data to load

  const fetchWords = async (currentPage, searchTerm = '', partOfSpeechFilter = 'All', reset = false) => {
    if (reset) {
      setWords([]);
      setPage(0);
      setHasMore(true);
    }

    if (currentPage === 0) {
      setLoading(true);
    } else {
      setFetchingMore(true);
    }
    setError(null);

    try {
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('verbs')
        .select('id, japanese, english, furigana, part_of_speech, jlpt_level');

      if (searchTerm) {
        query = query.or(
          `japanese.ilike.%${searchTerm}%,english.ilike.%${searchTerm}%,furigana.ilike.%${searchTerm}%`
        );
      }

      if (partOfSpeechFilter !== 'All') {
        query = query.filter('part_of_speech', 'ilike', `%${partOfSpeechFilter}%`);
      }

      const { data, error } = await query.range(from, to);

      if (error) {
        throw error;
      }

      if (reset) {
        setWords(data || []);
      } else {
        setWords((prevWords) => {
          const newWords = (data || []).filter(newItem => 
            !prevWords.some(existingItem => existingItem.id === newItem.id)
          );
          return [...prevWords, ...newWords];
        });
      }

      setHasMore((data || []).length === PAGE_SIZE); // If less than PAGE_SIZE, no more data
      setPage(currentPage + 1);

    } catch (err) {
      console.error("Error fetching words from Supabase:", err);
      setError(err);
      setHasMore(false); // Stop trying to fetch more on error
    } finally {
      if (currentPage === 0) {
        setLoading(false);
      } else {
        setFetchingMore(false);
      }
    }
  };

  useEffect(() => {
    fetchWords(0); // Fetch initial words on component mount
  }, []);

  const fetchMoreWords = (currentSearchTerm, currentPartOfSpeechFilter) => {
    if (fetchingMore || !hasMore) return; // Prevent multiple simultaneous fetches or if no more data
    fetchWords(page, currentSearchTerm, currentPartOfSpeechFilter);
  };

  const searchWords = (term, partOfSpeech) => {
    fetchWords(0, term, partOfSpeech, true); // Reset and fetch with new search term and part of speech
  };

  const value = {
    words,
    loading,
    fetchingMore,
    error,
    hasMore,
    fetchMoreWords,
    searchWords,
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