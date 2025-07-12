import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Grid, InputBase, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import WordCard from '../components/WordCard';
import VocabularyDetailView from '../components/VocabularyDetailView';
import { useWordContext } from '../contexts/WordContext';


const HomePage = () => {
  const { words, loading, fetchingMore, error, hasMore, fetchMoreWords, searchWords } = useWordContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);
  const [partOfSpeechFilter, setPartOfSpeechFilter] = useState('All');
  const scrollContainerRef = useRef(null);


    const uniquePartsOfSpeech = useMemo(() => {
    const allParts = words.map(word => word.part_of_speech).filter(Boolean).flatMap(pos => pos.split(', '));
    return ['All', ...new Set(allParts)].sort();
  }, [words]);

  useEffect(() => {
    if (!loading && words.length > 0) {
      if (!selectedWord || !words.find(w => w.id === selectedWord.id)) {
        setSelectedWord(words[0]);
      }
    } else if (words.length === 0) {
      setSelectedWord(null);
    }
  }, [words, loading, selectedWord]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !fetchingMore) {
        fetchMoreWords(searchTerm, partOfSpeechFilter);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [hasMore, fetchingMore, fetchMoreWords, searchTerm, partOfSpeechFilter]);

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    searchWords(newSearchTerm, partOfSpeechFilter);
  };

  const handlePartOfSpeechChange = (e) => {
    const newFilter = e.target.value;
    setPartOfSpeechFilter(newFilter);
    searchWords(searchTerm, newFilter);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="h6" color="error">
            Error loading vocabulary: {error.message}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box 
      component="main" 
      sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' }, 
        gap: 3, 
        p: 3, 
        height: '100vh',
        bgcolor: '#fcf8f9',
        overflow: 'hidden'
      }}
    >
      {/* Left Sidebar: Search and Word List */}
      <Box 
        sx={{ 
          width: { xs: '100%', lg: '33.333333%', xl: '25%' },
          height: { xs: 'auto', lg: '100%' },
          maxHeight: { xs: '40vh', lg: '100%' }
        }}
      >
        <Box 
          sx={{ 
            bgcolor: 'white', 
            borderRadius: '12px', 
            border: '1px solid #f3e7ea', 
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', 
            p: 2, 
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Search Input */}
          <Box sx={{ position: 'relative', mb: 2 }}>
            <SearchIcon 
              sx={{ 
                position: 'absolute', 
                left: 12, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#9ca3af' 
              }} 
            />
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#a87783' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                bgcolor: '#f3e7ea',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#f3e7ea',
                  '& fieldset': {
                    borderColor: '#f3e7ea',
                  },
                  '&:hover fieldset': {
                    borderColor: '#e0c8cc',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#e9c4cc',
                    boxShadow: '0 0 0 3px rgba(233, 196, 204, 0.4)',
                  },
                },
                '& input': {
                  fontSize: '0.875rem',
                  color: '#4b3b40',
                },
                '& input::placeholder': {
                  opacity: 0.6,
                }
              }}
            />


          </Box>

          {/* Part of Speech Filter */}
          <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
            <InputLabel>Part of Speech</InputLabel>
            <Select
              value={partOfSpeechFilter}
              onChange={handlePartOfSpeechChange}
              label="Part of Speech"
              sx={{
                bgcolor: 'white',
                border: '1px solid #f3e7ea',
                borderRadius: '8px',
                fontSize: '0.875rem',
                '&:focus-within': { 
                  borderColor: '#e72b4d'
                }
              }}
            >
              {uniquePartsOfSpeech.map((pos) => (
                <MenuItem key={pos} value={pos}>
                  {pos}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Word List */}
          <Box 
            ref={scrollContainerRef} 
            sx={{ 
              flex: 1,
              overflowY: 'auto', 
              pr: 1,
              '&::-webkit-scrollbar': {
                width: '6px'
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f5f9'
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#cbd5e1',
                borderRadius: '3px'
              }
            }}
          >
            {words.map((word) => (
              <WordCard 
                key={word.id} 
                word={word} 
                isSelected={selectedWord?.id === word.id}
                onClick={() => setSelectedWord(word)}
              />
            ))}
            {fetchingMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={24} sx={{ color: '#e72b4d' }} />
              </Box>
            )}
            {!hasMore && !fetchingMore && words.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No more words.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Right Content: Vocabulary Detail View */}
      <Box 
        sx={{ 
          flex: 1,
          height: { xs: 'auto', lg: '100%' },
          minHeight: { xs: '60vh', lg: 'auto' }
        }}
      >
        <VocabularyDetailView word={selectedWord} />
      </Box>
    </Box>
  );
};

export default HomePage;