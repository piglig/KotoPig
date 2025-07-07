import React from 'react';
import { useWordContext } from '../contexts/WordContext';
import WordCloud from '../components/WordCloud';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { words } = useWordContext();
  const navigate = useNavigate();

  const handleSelectWord = (word) => {
    navigate(`/detail/${word.word}`);
  };

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 56px)' }}> {/* Adjust height based on navbar height */}
      <WordCloud words={words} onSelectWord={handleSelectWord} />
    </div>
  );
};

export default HomePage;