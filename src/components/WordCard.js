import React from 'react';
import { Box, Typography } from '@mui/material';

const WordCard = ({ word, isSelected, onClick }) => {
  // This is a placeholder. In a real app, you'd have a more robust way
  // to determine the tag, likely from the data itself.
  const getTag = () => {
    if (!word || !word.part_of_speech) return null;
    if (word.part_of_speech.includes('v5u')) return 'U';
    if (word.part_of_speech.includes('v1')) return 'RU';
    if (word.part_of_speech.includes('adj-i')) return 'I';
    if (word.part_of_speech.includes('adv')) return 'ADV';
    return 'N'; // Default to Noun
  };

  const tag = getTag();

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '72px',
        px: 2,
        py: 1,
        cursor: 'pointer',
        backgroundColor: isSelected ? '#FBEBEE' : '#fff',
        border: '2px solid',
        borderColor: isSelected ? '#E57373' : 'transparent',
        borderRadius: '12px',
        m: 1,
        transition: 'background-color 150ms ease-in-out, border-color 150ms ease-in-out',
        '&:hover': {
          backgroundColor: isSelected ? '#F8E5E7' : '#F7F7F7',
        },
      }}
    >
      <Box>
        <Typography
          component="p"
          sx={{
            color: '#111518',
            fontSize: '1rem', // text-base
            fontWeight: 500, // font-medium
            lineHeight: '1.5rem', // leading-normal
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
            fontSize: '0.875rem', // text-sm
            fontWeight: 400, // font-normal
            lineHeight: '1.25rem', // leading-normal
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {word.english.split(';')[0]}
        </Typography>
      </Box>
      {tag && (
        <Box
          sx={{
            ml: 2,
            minWidth: 24, // size-6
            height: 24, // size-6
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e0e0e0', // A neutral gray
            color: '#424242',
            fontWeight: 'bold',
            fontSize: '0.75rem',
          }}
        >
          {tag}
        </Box>
      )}
    </Box>
  );
};

export default WordCard;