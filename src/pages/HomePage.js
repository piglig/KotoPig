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
    <div style={{ width: '100%', height: '100vh' }}> {/* Adjust height based on navbar height */}
      <WordCloud words={words} onSelectWord={handleSelectWord} />
    </div>
  );
};

export default HomePage;