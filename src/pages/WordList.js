import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useWordContext } from '../contexts/WordContext';
import WordCard from '../components/WordCard';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { TextField, InputAdornment, IconButton, Select, MenuItem, FormControl, InputLabel, Button, Paper, ToggleButton, ToggleButtonGroup, Box, Grid, Typography, CircularProgress } from '@mui/material';
import { Search, ViewList, ViewModule, CheckCircleOutline, InfoOutlined } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { FixedSizeList as List } from 'react-window';
import WordListItem from '../components/WordListItem';

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

  const [view, setView] = useState('grid'); // 'grid' or 'list'

  const handleViewChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
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

  const listRef = useRef();
  const alphabetIndex = useMemo(() => {
    const index = {};
    sortedAndFilteredWords.forEach((word, i) => {
      const letter = word.reading.charAt(0).toUpperCase();
      if (!index[letter]) {
        index[letter] = i;
      }
    });
    return index;
  }, [sortedAndFilteredWords]);

  const handleLetterJump = (letter) => {
    if (listRef.current && alphabetIndex[letter]) {
      listRef.current.scrollToItem(alphabetIndex[letter], 'start');
    }
  };

  const handleSelectWord = (word) => {
    navigate(`/detail/${word.word}`);
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
    <Container className="py-4">
      <Paper elevation={3} className="p-3 mb-4">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <TextField
                id="searchTerm"
                variant="outlined"
                fullWidth
                placeholder={`在 ${words.length} 个词汇中搜索...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel id="select-type-label">筛选类型</InputLabel>
              <Select
                labelId="select-type-label"
                id="selectType"
                value={selectedType}
                label="筛选类型"
                onChange={e => setSelectedType(e.target.value)}
              >
                <MenuItem value=""><em>所有类型</em></MenuItem>
                {types.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel id="sort-by-label">排序方式</InputLabel>
              <Select
                labelId="sort-by-label"
                id="sortBy"
                value={sortBy}
                label="排序方式"
                onChange={e => setSortBy(e.target.value)}
              >
                <MenuItem value="word">按词汇</MenuItem>
                <MenuItem value="reading">按读音</MenuItem>
                <MenuItem value="type">按类型</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button variant="outlined" fullWidth onClick={() => {
              setSearchTerm('');
              setSelectedType('');
              setSortBy('word');
            }}>
              清除筛选
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ToggleButtonGroup value={view} exclusive onChange={handleViewChange}>
              <ToggleButton value="grid" aria-label="grid view">
                <ViewModule />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ViewList />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        <div className="row mt-3">
          <div className="col-12 text-center">
            <p className="text-muted mb-0 fs-6">
              <span className="badge bg-primary-subtle text-primary me-2">{sortedAndFilteredWords.length}</span> 个词汇匹配当前筛选条件。
            </p>
          </div>
        </div>
      </Paper>

      {/* Word List */}
      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              {sortedAndFilteredWords.slice(0, displayCount).map(word => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={word.word}>
                  <WordCard word={word} onSelect={handleSelectWord} isLearned={!!progress[word.word]} />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        ) : (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <>
              <List
                ref={listRef}
                height={600} // Adjust height as needed
                itemCount={sortedAndFilteredWords.length}
                itemSize={72} // Adjusted item size for WordListItem
                width={'100%'}
              >
                {({ index, style }) => {
                  const word = sortedAndFilteredWords[index];
                  return (
                    <div style={style} key={word.word}>
                      <WordListItem word={word} onSelect={handleSelectWord} isLearned={!!progress[word.word]} />
                    </div>
                  );
                }}
              </List>
              <Box sx={{
                position: 'fixed',
                top: '50%',
                right: { xs: '10px', md: '20px' }, // Adjust right position for different screen sizes
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                zIndex: 1000, // Ensure it's above other content
                backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
                borderRadius: '8px',
                p: 1,
                boxShadow: 3,
              }}>
                {Object.keys(alphabetIndex).sort().map(letter => (
                  <Button key={letter} size="small" onClick={() => handleLetterJump(letter)}>
                    {letter}
                  </Button>
                ))}
              </Box>
            </>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Indicator */}
      {displayCount < sortedAndFilteredWords.length && (
        <Box ref={loadingRef} sx={{ textAlign: 'center', my: 5, p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <CircularProgress color="primary" size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">加载更多词汇...</Typography>
        </Box>
      )}

      {displayCount >= sortedAndFilteredWords.length && sortedAndFilteredWords.length > 0 && (
        <Box sx={{ textAlign: 'center', my: 5, p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" color="success.main"><CheckCircleOutline sx={{ verticalAlign: 'middle', mr: 1 }} />所有词汇已加载。</Typography>
        </Box>
      )}

      {sortedAndFilteredWords.length === 0 && (
        <Box sx={{ textAlign: 'center', my: 5, p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" color="info.main"><InfoOutlined sx={{ verticalAlign: 'middle', mr: 1 }} />没有找到匹配的词汇。</Typography>
        </Box>
      )}
    </Container>
  );
};

export default WordList;