import React from 'react';
import { useSpring, animated } from 'react-spring';

const MarqueeItem = ({ text, word, onSelectWord, targetOpacity, targetScale }) => {
  const [props] = useSpring(() => ({
    from: { opacity: 0, scale: 0.5 },
    to: { opacity: targetOpacity, scale: targetScale },
    config: { duration: 500 }, // Animation duration for appearance
    delay: Math.random() * 1000, // Staggered appearance
  }));

  return (
    <animated.span
      className="marquee-item"
      style={{
        opacity: props.opacity,
        transform: props.scale.to(s => `scale(${s})`),
      }}
      onClick={() => onSelectWord(word)}
    >
      {text}
    </animated.span>
  );
};

export default MarqueeItem;