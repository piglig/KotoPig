import React from 'react';
import { useSpring, animated } from 'react-spring';

const WordStar = ({ word, onSelectWord, style }) => {
  const handleClick = () => {
    onSelectWord(word);
  };

  return (
    <animated.div
      style={{
        ...style,
        position: 'absolute',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        zIndex: 100,
      }}
      onClick={handleClick}
    >
      {word.word} ({word.reading})
    </animated.div>
  );
};

export default WordStar;