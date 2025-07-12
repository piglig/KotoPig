import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useWordContext } from '../contexts/WordContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import WordListItem from '../components/WordListItem';
import VocabularyDetailView from '../components/VocabularyDetailView';
import {
  Box,
  Button,
  TextField,
  Typography,
  AppBar,
  Toolbar,
  Container,
  Paper,
  Link,
  SvgIcon,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fcf8f9' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', borderBottom: '1px solid #f3e7ea' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 5, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#1b0e10' }}>
            <KotoPigLogo sx={{ fontSize: 24 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Koto-Pig
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Link component={RouterLink} to="/" color="#1b0e10" sx={{ textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Home</Link>
            <Link component={RouterLink} to="/lessons" color="#1b0e10" sx={{ textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Lessons</Link>
            <Link component={RouterLink} to="/mylist" color="#e72b4d" sx={{ textDecoration: 'none', fontSize: '14px', fontWeight: 500, borderBottom: '2px solid #e72b4d', pb: '3px' }}>My List</Link>
            <Link component={RouterLink} to="/progress" color="#1b0e10" sx={{ textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Progress</Link>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '999px',
                  backgroundColor: '#f3e7ea',
                  '& fieldset': { borderColor: 'transparent' },
                  '&:hover fieldset': { borderColor: '#e72b4d' },
                  '&.Mui-focused fieldset': { borderColor: '#e72b4d' },
                },
                '& input': {
                  color: '#1b0e10',
                  py: '8px',
                  pl: '10px',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#974e5b' }} />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton sx={{ color: '#974e5b' }}>
              <NotificationsIcon />
            </IconButton>
            <Button sx={{ width: 32, height: 32, borderRadius: '50%', p: 0, minWidth: 0 }}>
              <img alt="User avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsw9vogSVSwFNMyKxsh1G1Pncxrzm1fMYC0iNSJ10t9Zc758lcwTGWbQ1U8Usbw7oX7IeOO2Sv3KYklM_xg8kLzZmEsLsxz08Y2gO6oAVfEVuSyDH1towuoXNtpHuCKSol82TOmi6d56ILFVjdSUWlxs9-rVc6LdIhxccKssE6Pd1DKtiqd1GLRUbWPob24WkYxQ2mov4pdYWWuvbx6-AnKnGVirW7F0tUQezFcNT0gFt2ZHsnUSbLv1OMBSYhxKmU2thlPxOqnw" />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
          <Box sx={{ width: { xs: '100%', lg: '33.33%', xl: '25%' } }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: '16px', bgcolor: 'white', height: '100%' }}>
              <TextField
                variant="outlined"
                placeholder="Search..."
                fullWidth
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#fcf8f9',
                    border: '1px solid #e7d0d4', // Apply border directly to the root
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' }, // Make fieldset border transparent
                    '&:hover': {
                      borderColor: '#e72b4d', // Change root border on hover
                    },
                    '&.Mui-focused': {
                      borderColor: '#c92140', // Change root border on focus
                    },
                  },
                  '& input': {
                    color: '#1b0e10',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#974e5b' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="subtitle2" sx={{ color: '#974e5b', mb: 1, fontWeight: 'medium' }}>Basic Type</Typography>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                displayEmpty
                fullWidth
                size="small"
                sx={{
                  mb: 3,
                  borderRadius: '8px',
                  backgroundColor: '#fcf8f9',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e7d0d4' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#e72b4d' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#e72b4d' },
                  color: '#1b0e10',
                }}
              >
                <MenuItem value="">All</MenuItem>
                {types.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
              <Box sx={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto', pr: 1 }}>
                {sortedAndFilteredWords.slice(0, displayCount).map(word => (
                  <WordListItem key={word.word} word={word} onSelect={handleSelectWord} isLearned={!!progress[word.word]} />
                ))}
                {displayCount < sortedAndFilteredWords.length && (
                  <Box ref={loadingRef} sx={{ textAlign: 'center', py: 2 }}>
                    <CircularProgress size={24} sx={{ color: '#e72b4d' }} />
                    <Typography variant="body2" sx={{ color: '#974e5b', mt: 1 }}>Loading more words...</Typography>
                  </Box>
                )}
                {displayCount >= sortedAndFilteredWords.length && sortedAndFilteredWords.length > 0 && (
                  <Box sx={{ textAlign: 'center', py: 2, color: '#268c60' }}>
                    <CheckCircleOutlineIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    <Typography variant="body2" component="span">All words loaded.</Typography>
                  </Box>
                )}
                {sortedAndFilteredWords.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 2, color: '#974e5b' }}>
                    <InfoOutlinedIcon sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    <Typography variant="body2" component="span">No matching words found.</Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
          <Box sx={{ width: { xs: '100%', lg: '66.66%', xl: '75%' } }}>
            <VocabularyDetailView word={selectedWord} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WordList;
