import React, { useState, useEffect } from 'react';
import { Box, Grid, InputBase, Typography, CircularProgress } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import VerbDetail from '../components/VerbDetail';
import WordCard from '../components/WordCard';
import { useWordContext } from '../contexts/WordContext';

const HomePage = () => {
  const { words, loading, error } = useWordContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);

  const filteredWords = words.filter(word => 
    (word.japanese && word.japanese.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (word.english && word.english.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    if (!loading && filteredWords.length > 0) {
      if (!selectedWord || !filteredWords.find(w => w.id === selectedWord.id)) {
        setSelectedWord(filteredWords[0]);
      }
    } else if (filteredWords.length === 0) {
      setSelectedWord(null);
    }
  }, [searchTerm, words, loading, selectedWord]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Navbar />
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="h6" color="error">
            Error loading vocabulary: {error.message}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#fff' }}>
      <Navbar />
      <Grid container sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {/* Left Column: Search and Word List */}
        <Grid item xs={12} md={3} lg={2} sx={{ display: 'flex', flexDirection: 'column', borderRight: { md: '1px solid #e8e8e8' } }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #e8e8e8' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f0f3f4', borderRadius: '999px', p: '4px 12px' }}>
              <SearchIcon sx={{ color: '#637988' }} />
              <InputBase
                placeholder="Search..."
                fullWidth
                sx={{ ml: 1 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
            {filteredWords.map((word) => (
              <WordCard 
                key={word.id} 
                word={word} 
                isSelected={selectedWord?.id === word.id}
                onClick={() => setSelectedWord(word)}
              />
            ))}
          </Box>
        </Grid>

        {/* Right Column: Word Details */}
        <Grid item xs={12} md={9} lg={10} sx={{ overflowY: 'auto', bgcolor: '#f7f8fa' }}>
          {selectedWord ? (
            <VerbDetail verb={selectedWord} />
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant="h6" color="text.secondary">
                {searchTerm ? 'No results found.' : 'Select a word to see details.'}
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;