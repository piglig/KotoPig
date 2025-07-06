import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import MarqueeItem from './MarqueeItem';

const MarqueeRow = ({ rowContent, speed, onSelectWord }) => {
  const rowRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);

  // Duplicate content to create a seamless loop
  const duplicatedContent = [...rowContent, ...rowContent];

  useLayoutEffect(() => {
    if (rowRef.current) {
      // Measure the width of one set of content
      // We assume the first half of the duplicated content represents one full set
      setContentWidth(rowRef.current.scrollWidth / 2);
    }
  }, [duplicatedContent]);

  const [props, api] = useSpring(() => ({
    from: { x: 0 },
    config: { duration: speed * 1000, easing: (t) => t },
    loop: true,
    reset: true, // Crucial for seamless looping with `from` and `to`
  }));

  useEffect(() => {
    if (contentWidth === 0) {
      return;
    }
    api.start({
      from: { x: 0 },
      to: { x: -contentWidth },
      config: { duration: speed * 1000, easing: (t) => t },
      loop: true,
      reset: true,
    });
  }, [speed, contentWidth, api]);

  return (
    <animated.div
      ref={rowRef}
      className="marquee-row"
      style={{ transform: props.x.to(x => `translateX(${x}px)`) }}
      onMouseEnter={() => api.pause()}
      onMouseLeave={() => api.resume()}
    >
      {duplicatedContent.map((item, index) => (
        <MarqueeItem
          key={`${item.id}-${index}`} // Use a unique key for duplicated items
          text={item.text}
          word={item.word}
          onSelectWord={onSelectWord}
          targetOpacity={item.opacity}
          targetScale={item.scale}
        />
      ))}
    </animated.div>
  );
};

export default MarqueeRow;