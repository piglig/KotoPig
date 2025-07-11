import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Grid, InputBase, Typography, CircularProgress, Paper, Select, MenuItem, FormControl, InputLabel, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, IconButton, Button } from '@mui/material';
import { Search as SearchIcon, VolumeUp as VolumeUpIcon, Edit as EditIcon } from '@mui/icons-material';

import WordCard from '../components/WordCard';
import { useWordContext } from '../contexts/WordContext';

// Reusable SectionTitle component to match the design
const SectionTitle = ({ children }) => (
  <Typography 
    variant="h3" 
    sx={{ 
      fontSize: '1.25rem', // text-xl
      fontWeight: 'semibold', 
      color: '#111518', 
      mb: 1.5 
    }}
  >
    {children}
  </Typography>
);

// Reusable ExampleCard component
const ExampleCard = ({ japanese, translation }) => (
  <Box 
    sx={{ 
      bgcolor: '#f7f8fa', 
      p: 2, 
      borderRadius: '8px', 
      mb: 1.5 
    }}
  >
    <Typography variant="body1" sx={{ fontSize: '1.125rem', color: '#111518', mb: 0.5 }}>{japanese}</Typography>
    <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#637988' }}>{translation}</Typography>
  </Box>
);

// Reusable TableCell component for consistent styling
const StyledTableCell = ({ children, header = false }) => (
  <TableCell 
    sx={{
      px: 2, 
      py: 1.5,
      fontSize: '0.875rem', // text-sm
      color: header ? '#637988' : '#111518',
      fontWeight: header ? 'medium' : 'normal',
      textTransform: 'uppercase',
      bgcolor: header ? '#f7f8fa' : 'white',
      borderBottom: header ? '1px solid #e0e0e0' : 'none',
      '&:first-of-type': { borderRadius: header ? '8px 0 0 0' : '0' },
      '&:last-of-type': { borderRadius: header ? '0 8px 0 0' : '0' },
    }}
  >
    {children}
  </TableCell>
);

const HomePage = () => {
  const { words, loading, fetchingMore, error, hasMore, fetchMoreWords, searchWords } = useWordContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);
  const [partOfSpeechFilter, setPartOfSpeechFilter] = useState('All');
  const scrollContainerRef = useRef(null);

  const speak = (text) => {
    if (!text || !'speechSynthesis' in window) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    speechSynthesis.speak(utterance);
  };

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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#f8f9fa' }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={3}>
          {/* Left Column: Search and Word List */}
          <Grid item xs={12} lg={4} xl={3}>
            <Box sx={{ bgcolor: 'white', borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', p: 2, height: '100%' }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <SearchIcon sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9e9e9e' }} />
                <InputBase
                  placeholder="Search..."
                  fullWidth
                  sx={{
                    bgcolor: '#f0f3f4',
                    borderRadius: '8px',
                    py: 1,
                    pl: 5,
                    pr: 2,
                    fontSize: '0.875rem', // text-sm
                    border: '1px solid #e0e0e0',
                    '&:focus': { outline: 'none', ring: '2px', ringColor: '#e72b4d' }
                  }}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </Box>
              <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
                <InputLabel>Part of Speech</InputLabel>
                <Select
                  value={partOfSpeechFilter}
                  onChange={handlePartOfSpeechChange}
                  label="Part of Speech"
                  sx={{
                    bgcolor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '0.875rem', // text-sm
                    '&:focus': { outline: 'none', ring: '2px', ringColor: '#e72b4d' }
                  }}
                >
                  {uniquePartsOfSpeech.map((pos) => (
                    <MenuItem key={pos} value={pos}>
                      {pos}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box ref={scrollContainerRef} sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 250px)', pr: 1 }}>
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
                    <CircularProgress size={24} />
                  </Box>
                )}
                {!hasMore && !fetchingMore && words.length > 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No more words.
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Word Details */}
          <Grid item xs={12} lg={8} xl={9}>
            <Box sx={{ bgcolor: 'white', borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', p: 4, height: '100%' }}>
              {selectedWord ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h1" sx={{ fontSize: '3rem', fontWeight: 'bold', color: '#111518' }}>{selectedWord.japanese}</Typography>
                        <IconButton onClick={() => speak(selectedWord.furigana)} sx={{ color: '#e72b4d' }}>
                          <VolumeUpIcon sx={{ fontSize: '2rem' }} />
                        </IconButton>
                      </Box>
                      <Typography variant="body1" sx={{ fontSize: '1.125rem', color: '#637988' }}>{selectedWord.english}</Typography>
                    </Box>
                    <Button variant="outlined" startIcon={<EditIcon />} sx={{ textTransform: 'none', color: '#637988', borderColor: '#e0e0e0', borderRadius: '8px', px: 2, py: 1, fontSize: '0.875rem' }}>
                      Edit
                    </Button>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <SectionTitle>Pronunciation</SectionTitle>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button variant="contained" sx={{ bgcolor: '#e72b4d', color: 'white', '&:hover': { bgcolor: '#c92140' }, textTransform: 'none', borderRadius: '8px', boxShadow: 'none', px: 3, py: 1.5, fontSize: '0.875rem', fontWeight: 'medium' }}>Standard</Button>
                      <Button variant="contained" sx={{ bgcolor: '#f0f3f4', color: '#637988', '&:hover': { bgcolor: '#e0e3e4' }, textTransform: 'none', borderRadius: '8px', boxShadow: 'none', px: 3, py: 1.5, fontSize: '0.875rem', fontWeight: 'medium' }}>Slow</Button>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <SectionTitle>Examples</SectionTitle>
                    <Box>
                      {/* Dummy examples for now */}
                      <ExampleCard japanese="わたしは、日本語を学んでいます。" translation="I am learning Japanese." />
                      <ExampleCard japanese="日本語は、とても難しいです。" translation="Japanese is very difficult." />
                    </Box>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <SectionTitle>Verb Conjugation</SectionTitle>
                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                      <Table sx={{ minWidth: 650 }}>
                        <TableHead sx={{ bgcolor: '#f7f8fa' }}>
                          <TableRow>
                            <StyledTableCell header>Form</StyledTableCell>
                            <StyledTableCell header>Positive</StyledTableCell>
                            <StyledTableCell header>Negative</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* Dummy conjugations for now */}
                          <TableRow>
                            <StyledTableCell>Present</StyledTableCell>
                            <StyledTableCell>行きます</StyledTableCell>
                            <StyledTableCell>行きません</StyledTableCell>
                          </TableRow>
                          <TableRow>
                            <StyledTableCell>Past</StyledTableCell>
                            <StyledTableCell>行きました</StyledTableCell>
                            <StyledTableCell>行きませんでした</StyledTableCell>
                          </TableRow>
                          <TableRow>
                            <StyledTableCell>Te-form</StyledTableCell>
                            <StyledTableCell>行って</StyledTableCell>
                            <StyledTableCell>-</StyledTableCell>
                          </TableRow>
                          <TableRow>
                            <StyledTableCell>Potential</StyledTableCell>
                            <StyledTableCell>行けます</StyledTableCell>
                            <StyledTableCell>行けません</StyledTableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                  <Box>
                    <SectionTitle>Related Grammar</SectionTitle>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button variant="contained" sx={{ bgcolor: '#e6f5ec', color: '#268c60', textTransform: 'none', borderRadius: '999px', boxShadow: 'none', px: 2, py: 1, fontSize: '0.875rem', fontWeight: 'medium' }}>ます</Button>
                      <Button variant="contained" sx={{ bgcolor: '#fcebea', color: '#c0392b', textTransform: 'none', borderRadius: '999px', boxShadow: 'none', px: 2, py: 1, fontSize: '0.875rem', fontWeight: 'medium' }}>ません</Button>
                    </Box>
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography variant="h6" color="text.secondary">
                    {searchTerm ? 'No results found.' : 'Select a word to see details.'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;