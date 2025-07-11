import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useWordContext } from '../contexts/WordContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import WordListItem from '../components/WordListItem';
import WordDetailDisplay from '../components/WordDetailDisplay';

const WORDS_PER_LOAD = 30; // Number of words to load at a time

const WordList = () => {
  const { words, progress } = useWordContext();
  const navigate = useNavigate();

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('word'); // New state for sorting
  const [selectedWord, setSelectedWord] = useState(null); // State to hold the selected word for detail view

  // Infinite Scroll State
  const [displayCount, setDisplayCount] = useState(WORDS_PER_LOAD);
  const loadingRef = useRef(null);

  const sortedAndFilteredWords = useMemo(() => {
    let filtered = words.filter(word => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const isSingleLetterSearch = lowerCaseSearchTerm.length === 1 && lowerCaseSearchTerm.match(/[a-z]/i);

      if (isSingleLetterSearch) {
        return word.reading.toLowerCase().startsWith(lowerCaseSearchTerm);
      } else {
        return (
          (word.word.includes(searchTerm) || word.reading.includes(searchTerm) || word.meaning.includes(searchTerm)) &&
          (selectedType === '' || word.type === selectedType)
        );
      }
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

  const handleSelectWord = (word) => {
    setSelectedWord(word);
  };

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
    <div className="bg-gray-50 text-gray-800">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900">Kato-Pig</h1>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <a className="text-gray-600 hover:text-gray-900" href="#">Home</a>
              <a className="text-gray-600 hover:text-gray-900" href="#">Lessons</a>
              <a className="text-gray-900 font-semibold border-b-2 border-indigo-500 pb-1" href="#">My List</a>
              <a className="text-gray-600 hover:text-gray-900" href="#">Progress</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
              <input className="bg-gray-100 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48" placeholder="Search..." type="text" />
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <span className="material-icons">notifications</span>
            </button>
            <button className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
              <img alt="User avatar" className="w-full h-full rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsw9vogSVSwFNMyKxsh1G1Pncxrzm1fMYC0iNSJ10t9Zc758lcwTGWbQ1U8Usbw7oX7IeOO2Sv3KYklM_xg8kLzZmEsLsxz08Y2gO6oAVfEVuSyDH1towuoXNtpHuCKSol82TOmi6d56ILFVjdSUWlxs9-rVc6LdIhxccKssE6Pd1DKtiqd1GLRUbWPob24WkYxQ2mov4pdYWWuvbx6-AnKnGVirW7F0tUQezFcNT0gFt2ZHsnUSbLv1OMBSYhxKmU2thlPxOqnw" />
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-1/3 xl:w-1/4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 h-full">
              <div className="relative mb-4">
                <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
                <input
                  className="bg-gray-100 rounded-lg w-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Search..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="verb-type">基本タイプ</label>
                <select
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  id="verb-type"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">所有</option>
                  {types.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-250px)] pr-2">
                {/* Word List Items will go here */}
                {sortedAndFilteredWords.slice(0, displayCount).map(word => (
                  <WordListItem key={word.word} word={word} onSelect={handleSelectWord} isLearned={!!progress[word.word]} />
                ))}
                {displayCount < sortedAndFilteredWords.length && (
                  <div ref={loadingRef} className="text-center py-4">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    <p className="text-sm text-gray-500 mt-2">加载更多词汇...</p>
                  </div>
                )}
                {displayCount >= sortedAndFilteredWords.length && sortedAndFilteredWords.length > 0 && (
                  <div className="text-center py-4 text-green-600">
                    <span className="material-icons align-middle mr-1">check_circle_outline</span>所有词汇已加载。
                  </div>
                )}
                {sortedAndFilteredWords.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <span className="material-icons align-middle mr-1">info_outlined</span>没有找到匹配的词汇。
                  </div>
                )}
              </div>
            </div>
          </aside>
          <section className="w-full lg:w-2/3 xl:w-3/4 h-full">
            <WordDetailDisplay word={selectedWord} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default WordList;
