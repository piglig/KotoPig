import React from 'react';
import { ListItem, ListItemText, IconButton, Typography, Box, Chip } from '@mui/material';
import { VolumeUp } from '@mui/icons-material';
import { motion } from 'framer-motion';

const WordListItem = ({ word, onSelect, isLearned }) => {
  const handlePlayAudio = (e) => {
    e.stopPropagation(); // Prevent list item click from navigating
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.reading);
      utterance.lang = 'ja-JP'; // Set language to Japanese
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported in this browser.');
    }
  };

  const typeColor = (type) => {
    switch (type) {
      case 'verb': return 'primary';
      case 'noun': return 'success';
      case 'adjective': return 'warning';
      default: return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ListItem
        button
        onClick={() => onSelect(word)}
        sx={{
          borderBottom: '1px solid #ddd',
          '&:last-child': { borderBottom: 'none' },
          backgroundColor: isLearned ? '#e8f5e9' : 'inherit',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: isLearned ? '#dcedc8' : '#f0f0f0',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)',
          },
          py: 1.5, // Add some vertical padding
        }}
      >
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant={{ xs: 'body1', sm: 'h6' }} component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
                {word.word}
              </Typography>
              <Typography variant={{ xs: 'body2', sm: 'subtitle1' }} component="span" color="text.secondary">
                ({word.reading})
              </Typography>
              <IconButton size="small" onClick={handlePlayAudio} sx={{ ml: 1 }}>
                <VolumeUp fontSize="small" />
              </IconButton>
            </Box>
          }
          secondary={
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant={{ xs: 'body2', sm: 'body1' }} color="text.primary">
                {word.meaning}
              </Typography>
              <Chip label={word.type} color={typeColor(word.type)} size="small" />
              {word.group && word.type !== 'noun' && (
                <Chip label={word.group} color="info" size="small" />
              )}
            </Box>
          }
        />
      </ListItem>
    </motion.div>
  );
};

export default WordListItem;