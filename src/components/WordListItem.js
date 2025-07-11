import React from 'react';
import { motion } from 'framer-motion';

const WordListItem = ({ word, onSelect, isLearned }) => {
  const handlePlayAudio = (e) => {
    e.stopPropagation(); // Prevent list item click from navigating
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.reading);
      utterance.lang = 'ja-JP'; // Set language to Japanese
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported in this browser.');
    }
  };

  const typeColorClass = (type) => {
    switch (type) {
      case 'exp': return 'bg-gray-200 text-gray-700';
      case 'v1': return 'bg-green-100 text-green-800';
      case 'v5': return 'bg-blue-100 text-blue-800';
      case 'adv': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50 ${isLearned ? 'bg-green-50 border-l-4 border-green-500' : ''}`}
      onClick={() => onSelect(word)}
    >
      <div>
        <p className="font-medium text-gray-800">{word.word}</p>
        <p className="text-sm text-gray-500">{word.meaning}</p>
      </div>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColorClass(word.type)}`}>
        {word.type.toUpperCase()}
      </span>
    </motion.div>
  );
};

export default WordListItem;
