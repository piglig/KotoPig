import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useWordContext } from '../contexts/WordContext';
import WordCard from '../components/WordCard';
import { useNavigate } from 'react-router-dom';

const WORDS_PER_LOAD = 30; // Number of words to load at a time

const WordList = () => {
  const { words, progress } = useWordContext();
  const navigate = useNavigate();

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('word'); // New state for sorting

  // Infinite Scroll State
  const [displayCount, setDisplayCount] = useState(WORDS_PER_LOAD);
  const loadingRef = useRef(null);

  const handleSelectWord = (word) => {
    navigate(`/detail/${word.word}`);
  };

  const sortedAndFilteredWords = useMemo(() => {
    let filtered = words.filter(word => {
      return (
        (word.word.includes(searchTerm) || word.reading.includes(searchTerm) || word.meaning.includes(searchTerm)) &&
        (selectedType === '' || word.type === selectedType)
      );
    });

    // Sorting logic
    filtered.sort((a, b) => {
      if (sortBy === 'word') {
        return a.word.localeCompare(b.word);
      } else if (sortBy === 'reading') {
        return a.reading.localeCompare(b.reading);
      } else if (sortBy === 'type') {
        return a.type.localeCompare(b.type);
      }
      return 0;
    });

    return filtered;
  }, [words, searchTerm, selectedType, sortBy]);

  const types = useMemo(() => [...new Set(words.map(w => w.type))], [words]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < sortedAndFilteredWords.length) {
          setDisplayCount(prevCount => prevCount + WORDS_PER_LOAD);
        }
      },
      { threshold: 1.0 } // Trigger when 100% of the target is visible
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => {
      if (loadingRef.current) {
        observer.unobserve(loadingRef.current);
      }
    };
  }, [displayCount, sortedAndFilteredWords.length]);

  // Reset displayCount when filters or sort change
  useEffect(() => {
    setDisplayCount(WORDS_PER_LOAD);
  }, [searchTerm, selectedType, sortBy]);

  return (
    <>
      {/* Search and Filter UI */}
      <div className="row mb-4 align-items-end">
        <div className="col-md-5 mb-3 mb-md-0">
          <label htmlFor="searchTerm" className="form-label visually-hidden">搜索</label>
          <div className="input-group input-group-lg">
            <span className="input-group-text"><i className="bi bi-search"></i></span>
            <input
              type="text"
              className="form-control"
              id="searchTerm"
              placeholder={`在 ${words.length} 个词汇中搜索...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4 mb-3 mb-md-0">
          <label htmlFor="selectType" className="form-label visually-hidden">筛选类型</label>
          <div className="input-group input-group-lg">
            <span className="input-group-text"><i className="bi bi-tag-fill"></i></span>
            <select className="form-select" id="selectType" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
              <option value="">所有类型</option>
              {types.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>
        <div className="col-md-3 mb-3 mb-md-0">
          <label htmlFor="sortBy" className="form-label visually-hidden">排序方式</label>
          <div className="input-group input-group-lg">
            <span className="input-group-text"><i className="bi bi-sort-alpha-down"></i></span>
            <select className="form-select" id="sortBy" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="word">按词汇</option>
              <option value="reading">按读音</option>
              <option value="type">按类型</option>
            </select>
          </div>
        </div>
      </div>

      {/* Word List */}
      <div className="row">
        {sortedAndFilteredWords.slice(0, displayCount).map(word => (
          <div className="col-md-4 mb-4" key={word.word}>
            <WordCard word={word} onSelect={handleSelectWord} isLearned={!!progress[word.word]} />
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      {displayCount < sortedAndFilteredWords.length && (
        <div ref={loadingRef} className="text-center my-4">
          <div className="spinner-grow text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-2">加载更多词汇...</p>
        </div>
      )}

      {displayCount >= sortedAndFilteredWords.length && sortedAndFilteredWords.length > 0 && (
        <p className="text-center text-muted my-4">所有词汇已加载。</p>
      )}

      {sortedAndFilteredWords.length === 0 && (
        <p className="text-center text-muted my-4">没有找到匹配的词汇。</p>
      )}
    </>
  );
};

export default WordList;