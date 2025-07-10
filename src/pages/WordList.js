import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useWordContext } from '../contexts/WordContext';
import VerbCard from '../components/VerbCard';
import { useNavigate } from 'react-router-dom';

import { Container, TextField, InputAdornment, IconButton, Select, MenuItem, FormControl, InputLabel, Button, Paper, ToggleButton, ToggleButtonGroup, Box, Grid, Typography, CircularProgress } from '@mui/material';
import { Search, ViewList, ViewModule, CheckCircleOutline, InfoOutlined, Clear } from '@mui/icons-material';
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
      <Box
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 4,
          borderRadius: 3,
          background: (theme) => `linear-gradient(145deg, ${theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100]}, ${theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[200]})`,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* 搜索框区域 */}
          <Grid item xs={12} md={5}>
            <TextField
              variant="filled"
              fullWidth
              placeholder={`在 ${words.length} 个词汇中搜索...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {searchTerm && (
                      <IconButton onClick={() => setSearchTerm('')}>
                        <Clear />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
                disableUnderline: true,
                sx: { borderRadius: 2, bgcolor: 'background.paper' }
              }}
            />
          </Grid>

          {/* 筛选与排序 */}
          <Grid item xs={6} md={2.5}>
            <FormControl fullWidth variant="filled" sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
              <InputLabel>类型</InputLabel>
              <Select value={selectedType} label="类型" onChange={(e) => setSelectedType(e.target.value)} disableUnderline>
                <MenuItem value=""><em>所有</em></MenuItem>
                {types.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={2.5}>
            <FormControl fullWidth variant="filled" sx={{ borderRadius: 2, bgcolor: 'background.paper' }}>
              <InputLabel>排序</InputLabel>
              <Select value={sortBy} label="排序" onChange={(e) => setSortBy(e.target.value)} disableUnderline>
                <MenuItem value="word">按词汇</MenuItem>
                <MenuItem value="reading">按读音</MenuItem>
                <MenuItem value="type">按类型</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* 视图切换 */}
          <Grid item xs={12} md={2} container justifyContent="flex-end">
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              aria-label="view mode"
            >
              <ToggleButton value="grid" aria-label="grid view">
                <ViewModule />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ViewList />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
        
        {/* 匹配提示 */}
        <Box mt={2} textAlign="center">
          <Typography variant="caption" color="text.secondary">
            {sortedAndFilteredWords.length > 0
              ? `找到 ${sortedAndFilteredWords.length} 个匹配结果`
              : '没有找到匹配的词汇'}
          </Typography>
        </Box>
      </Box>


      {/* Word List */}
      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <motion.div
            key="grid-view"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
              hidden: {},
            }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              {sortedAndFilteredWords.slice(0, displayCount).map(word => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={word.word}>
                  <motion.div variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}>
                    <VerbCard word={word} onSelect={handleSelectWord} isLearned={!!progress[word.word]} />
                  </motion.div>
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