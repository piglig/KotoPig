import React from 'react';
import { Box, Typography } from '@mui/material';

const WordCard = ({ word, isSelected, onClick }) => {

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 1.5,
        cursor: 'pointer',
        backgroundColor: isSelected ? '#fef3f2' : 'transparent',
        borderLeft: isSelected ? '4px solid #e72b4d' : '4px solid transparent',
        borderRadius: '8px',
        mb: 0.5,
        transition: 'all 150ms ease-in-out',
        '&:hover': {
          backgroundColor: isSelected ? '#fcf8f9' : '#f9fafb',
        },
      }}
    >
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          component="p"
          sx={{
            color: isSelected ? '#e72b4d' : '#111827',
            fontSize: '1rem',
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            lineHeight: 1.5
          }}
        >
          {word.japanese}
        </Typography>
        <Typography
          component="p"
          sx={{
            color: isSelected ? '#c92140' : '#6b7280',
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: '1.25rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mt: 0.25,
          }}
        >
          {word.english.split(';')[0]}
        </Typography>
      </Box>
    </Box>
  );
};

export default WordCard;