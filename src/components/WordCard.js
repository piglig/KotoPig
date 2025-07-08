import React from 'react';
import { Card, CardContent, Typography, IconButton, Chip, Box } from '@mui/material';
import { VolumeUp } from '@mui/icons-material';
import { motion } from 'framer-motion';

const WordCard = ({ word, onSelect, isLearned }) => {
  const handlePlayAudio = (e) => {
    e.stopPropagation(); // Prevent card click from navigating
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
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        variant="outlined"
        sx={{
          height: '100%',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          borderColor: isLearned ? 'success.main' : 'grey.300',
          borderWidth: isLearned ? 2 : 1,
          boxShadow: isLearned ? '0px 0px 12px rgba(76, 175, 80, 0.6)' : '0px 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease-in-out',
          backgroundColor: isLearned ? '#e8f5e9' : 'inherit',
          '&:hover': {
            boxShadow: isLearned ? '0px 0px 16px rgba(76, 175, 80, 0.8)' : '0px 4px 8px rgba(0,0,0,0.2)',
            transform: 'translateY(-2px)',
          },
        }}
        onClick={() => onSelect(word)}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Typography variant={{ xs: 'h6', sm: 'h5' }} component="div" sx={{ fontWeight: 'bold' }}>
              {word.word}
              <Typography variant={{ xs: 'body2', sm: 'subtitle1' }} component="span" color="text.secondary" sx={{ ml: 1 }}>
                ({word.reading})
              </Typography>
              <IconButton size="small" onClick={handlePlayAudio} sx={{ ml: 1 }}>
                <VolumeUp fontSize="small" />
              </IconButton>
            </Typography>
            {isLearned && (
              <Chip label="已学习" color="success" size="small" sx={{ fontWeight: 'bold' }} />
            )}
          </Box>
          <Typography variant={{ xs: 'body1', sm: 'h6' }} color="text.primary" sx={{ mb: 2, lineHeight: 1.5 }}>
            {word.meaning}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto' }}>
            <Chip label={word.type} color={typeColor(word.type)} size="small" />
            {word.group && word.type !== 'noun' && (
              <Chip label={word.group} color="info" size="small" />
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WordCard;