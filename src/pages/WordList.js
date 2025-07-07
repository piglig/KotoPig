import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useWordContext } from '../contexts/WordContext';
import WordCard from '../components/WordCard';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

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
    <Container className="py-4">
      <div className="filter-card">
        <div className="row g-4 align-items-end">
          <div className="col-lg-4 col-md-6">
            <label htmlFor="searchTerm" className="filter-label">搜索</label>
            <div className="input-group filter-input-group">
              <span className="input-group-text"><i className="bi bi-search text-primary"></i></span>
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
          <div className="col-lg-3 col-md-6">
            <label htmlFor="selectType" className="filter-label">筛选类型</label>
            <div className="input-group filter-input-group">
              <span className="input-group-text"><i className="bi bi-tag-fill text-primary"></i></span>
              <select className="form-select" id="selectType" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                <option value="">所有类型</option>
                {types.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <label htmlFor="sortBy" className="filter-label">排序方式</label>
            <div className="input-group filter-input-group">
              <span className="input-group-text"><i className="bi bi-sort-alpha-down text-primary"></i></span>
              <select className="form-select" id="sortBy" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="word">按词汇</option>
                <option value="reading">按读音</option>
                <option value="type">按类型</option>
              </select>
            </div>
          </div>
          <div className="col-lg-2 col-md-6 d-grid">
            <button className="btn w-100 filter-clear-btn" onClick={() => {
              setSearchTerm('');
              setSelectedType('');
              setSortBy('word');
            }}>
              <i className="bi bi-x-circle me-2"></i>清除筛选
            </button>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12 text-center">
            <p className="text-muted mb-0 fs-5">
              <span className="badge bg-primary-subtle text-primary me-2">{sortedAndFilteredWords.length}</span> 个词汇匹配当前筛选条件。
            </p>
          </div>
        </div>
      </div>

      {/* Word List */}
      <div className="row">
        {sortedAndFilteredWords.slice(0, displayCount).map(word => (
          <div className="col-xl-3 col-lg-4 col-md-6 mb-4" key={word.word}>
            <WordCard word={word} onSelect={handleSelectWord} isLearned={!!progress[word.word]} />
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      {displayCount < sortedAndFilteredWords.length && (
        <div ref={loadingRef} className="text-center my-5 p-4 bg-light rounded-4 shadow-sm">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mb-0 fs-5">加载更多词汇...</p>
        </div>
      )}

      {displayCount >= sortedAndFilteredWords.length && sortedAndFilteredWords.length > 0 && (
        <div className="text-center my-5 p-4 bg-light rounded-4 shadow-sm">
          <p className="text-muted mb-0 fs-5"><i className="bi bi-check-circle-fill text-success me-2 fs-4 align-middle"></i>所有词汇已加载。</p>
        </div>
      )}

      {sortedAndFilteredWords.length === 0 && (
        <div className="text-center my-5 p-4 bg-light rounded-4 shadow-sm">
          <p className="text-muted mb-0 fs-5"><i className="bi bi-info-circle-fill text-info me-2 fs-4 align-middle"></i>没有找到匹配的词汇。</p>
        </div>
      )}
    </Container>
  );
};

export default WordList;