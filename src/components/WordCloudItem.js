import React from 'react';
import { motion } from 'framer-motion';

const WordCloudItem = ({ word, onSelectWord }) => {
  const handleClick = () => {
    onSelectWord(word);
  };

  return (
    <motion.div
      className="word-cloud-item"
      onClick={handleClick}
      // Framer Motion will animate this element via useAnimate in parent
      // No need for initial, animate, transition props here
    >
      {word.word} ({word.reading})
    </motion.div>
  );
};

export default WordCloudItem;