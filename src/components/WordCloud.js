import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimate } from 'framer-motion';
import './WordCloud.css';

const MAX_DISPLAY_WORDS = 50; // Limit the number of words displayed for performance

const WordCloud = ({ words = [], onSelectWord }) => {
  console.log('WordCloud component rendering');
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [activeWords, setActiveWords] = useState([]);
  const [scope, animate] = useAnimate();

  useEffect(() => {
    const updateSize = () => {
      if (scope.current) { // Use scope.current instead of containerRef.current
        const newSize = {
          width: scope.current.offsetWidth,
          height: scope.current.offsetHeight,
        };
        setContainerSize(newSize);
        console.log('WordCloud: Container size updated:', newSize);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (words.length === 0 || containerSize.width === 0 || containerSize.height === 0) {
      console.log('WordCloud: Not ready to generate words. Words length:', words.length, 'Container size:', containerSize);
      return;
    }

    let wordCounter = 0;
    const generateWord = () => {
      if (wordCounter >= words.length) {
        wordCounter = 0; // Loop through words if we run out
      }
      const wordData = words[wordCounter];
      wordCounter++;

      const id = `${wordData.word}-${Date.now()}`;
      const fontSize = Math.random() * (3.0 - 1.5) + 1.5; // 1.5em to 3.0em for better readability
      const rotation = Math.random() * 20 - 10; // -10deg to 10deg
      const startY = Math.random() * (containerSize.height - 50); // Random Y position within container
      const duration = (Math.random() * 60 + 30); // 30s to 90s for X movement
      const yFloatAmplitude = Math.random() * 30 + 20; // 20px to 50px for Y float
      const yFloatDuration = (Math.random() * 5 + 3); // 3s to 8s for Y float

      const newWord = {
        id,
        word: wordData,
        fontSize,
        rotation,
        startY,
        duration,
        yFloatAmplitude,
        yFloatDuration,
      };

      setActiveWords(prevWords => [...prevWords, newWord]);
      console.log('WordCloud: Added new word to activeWords:', newWord.word.word);

      // Start animation for the new word
      // We need to wait for the element to be rendered in the DOM
      // before we can animate it. A small timeout can help.
      setTimeout(() => {
        const currentScope = scope.current;
        if (!currentScope) {
          console.warn('WordCloud: Scope is null, component unmounted before animation could start.');
          return; // Component unmounted, do not proceed
        }
        const element = currentScope.querySelector(`[data-word-id="${id}"]`);
        console.log('WordCloud: Attempting to animate word:', newWord.word.word, 'Element found:', !!element, 'offsetWidth:', element ? element.offsetWidth : 'N/A');
        if (element) {
          console.log('DEBUG: containerSize.width:', containerSize.width);
          console.log('DEBUG: element.offsetWidth:', element.offsetWidth);
          console.log('DEBUG: Animation target x:', -element.offsetWidth - 200);
          // Initial setup for rotation
          animate(element, { rotate: rotation }, { duration: 0 });

          // X-axis movement and opacity (single pass)
          animate(element,
            {
              x: [0, -containerSize.width - element.offsetWidth], // Move from right to left, fully off-screen
              opacity: [0, 0.5, 1, 0.3, 0], // Fade in, brightest in middle, fade out
            },
            {
              duration: duration,
              ease: "linear",
              times: [0, 0.1, 0.5, 0.9, 1], // Fade in quickly, brightest at 50% of journey, fade out
              onComplete: () => {
                // Remove word from activeWords after it leaves screen
                setActiveWords(prevWords => prevWords.filter(w => w.id !== id));
                console.log('WordCloud: X-animation complete and word removed:', newWord.word.word);
              },
            }
          );

          // Y-axis floating movement (looping independently)
          animate(element,
            {
              y: [startY, startY + yFloatAmplitude, startY],
            },
            {
              duration: yFloatDuration,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }
          );

        } else {
          console.warn('WordCloud: Element not found for animation:', newWord.word.word);
        }
      }, 500); // Increased delay to 500ms to allow element to render and get offsetWidth
    };

    const interval = setInterval(generateWord, Math.random() * 1000 + 500); // Generate new word every 0.5s to 1.5s

    return () => clearInterval(interval);
  }, [words, containerSize, animate, scope]);

  return (
    <div className="word-cloud-container" ref={scope}> {/* Use scope ref here */}
      {activeWords.map(item => (
        <motion.div
          key={item.id}
          data-word-id={item.id} // Used to target element with useAnimate
          className="word-cloud-item"
          style={{
            position: 'absolute',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            zIndex: 100,
            fontSize: `${item.fontSize}em`,
            top: item.startY, // Initial Y position
            left: containerSize.width, // Initial X position (off-screen right)
          }}
          onClick={() => onSelectWord(item.word)}
        >
          {item.word.word} ({item.word.reading})
        </motion.div>
      ))}
    </div>
  );
};

export default WordCloud;