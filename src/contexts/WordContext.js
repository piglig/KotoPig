import React, { createContext, useState, useEffect, useContext } from 'react';

const WordContext = createContext();

// Ebbinghaus intervals in days
const reviewIntervals = [1, 2, 4, 8, 15, 30, 60];

export const WordProvider = ({ children }) => {
  const [words, setWords] = useState([]);
  const [progress, setProgress] = useState({});

  // Load initial data
  useEffect(() => {
    fetch('/words.json')
      .then(response => response.json())
      .then(data => {
        console.log('Loaded words:', data);
        setWords(data);
      });

    const savedProgress = localStorage.getItem('wordProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const saveProgress = (newProgress) => {
    setProgress(newProgress);
    localStorage.setItem('wordProgress', JSON.stringify(newProgress));
  };

  const learnWord = (word) => {
    const newProgress = {
      ...progress,
      [word.word]: {
        level: 0,
        lastReviewed: new Date().toISOString(),
        due: new Date().toISOString()
      }
    };
    saveProgress(newProgress);
    alert(`${word.word} 已加入学习计划!`);
  };

  const updateReviewProgress = (word, isCorrect) => {
    const wordProgress = progress[word.word];
    let newLevel = wordProgress.level;
    if (isCorrect) {
      newLevel = Math.min(newLevel + 1, reviewIntervals.length - 1);
    } else {
      newLevel = Math.max(0, newLevel - 1); // Go back one step on failure
    }
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + reviewIntervals[newLevel]);

    const newProgress = {
      ...progress,
      [word.word]: {
        ...wordProgress,
        level: newLevel,
        lastReviewed: new Date().toISOString(),
        due: dueDate.toISOString()
      }
    };
    saveProgress(newProgress);
  };

  const getWordsToReview = () => {
    const now = new Date();
    return words.filter(word => {
      const p = progress[word.word];
      return p && new Date(p.due) <= now;
    });
  };

  return (
    <WordContext.Provider value={{
      words,
      progress,
      learnWord,
      updateReviewProgress,
      getWordsToReview
    }}>
      {children}
    </WordContext.Provider>
  );
};

export const useWordContext = () => useContext(WordContext);