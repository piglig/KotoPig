import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

const WordCard = ({ word, isSelected, onClick }) => {
  // This is a placeholder. In a real app, you'd have a more robust way
  // to determine the tag, likely from the data itself.
  const getTag = () => {
    if (!word || !word.part_of_speech) return null;
    if (word.part_of_speech.includes('v5u')) return 'UPC';
    if (word.part_of_speech.includes('v1')) return 'UPC';
    if (word.part_of_speech.includes('adj-i')) return 'I';
    if (word.part_of_speech.includes('adv')) return 'ADV';
    if (word.part_of_speech.includes('n')) return 'H';
    return 'UPC'; // Default
  };

  const tag = getTag();

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        cursor: 'pointer',
        backgroundColor: isSelected ? '#FBEBEE' : '#fff',
        border: '1px solid',
        borderColor: isSelected ? '#E57373' : '#e8e8e8',
        borderRadius: '12px',
        mb: 1,
        transition: 'background-color 150ms ease-in-out, border-color 150ms ease-in-out',
        '&:hover': {
          backgroundColor: isSelected ? '#F8E5E7' : '#fafafa',
          borderColor: isSelected ? '#E57373' : '#d0d0d0',
        },
      }}
    >
      <Box>
        <Typography
          component="p"
          sx={{
            color: isSelected ? '#c62828' : '#111518',
            fontSize: '1rem',
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {word.japanese}
        </Typography>
        <Typography
          component="p"
          sx={{
            color: '#637988',
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: '1.25rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mt: 0.5,
          }}
        >
          {word.english.split(';')[0]}
        </Typography>
      </Box>
      {tag && (
        <Chip 
          label={tag}
          size="small"
          sx={{
            ml: 2,
            fontWeight: 'bold',
            color: isSelected ? '#c62828' : '#555',
            backgroundColor: isSelected ? 'rgba(229, 115, 115, 0.2)' : '#e0e0e0',
          }}
        />
      )}
    </Box>
  );
};

export default WordCard;