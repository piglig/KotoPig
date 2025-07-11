import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip } from '@mui/material';
import { VolumeUp as VolumeUpIcon, Edit as EditIcon } from '@mui/icons-material';

const SectionTitle = ({ children }) => (
  <Typography 
    variant="h3" 
    sx={{ 
      fontSize: '1.25rem', // text-xl
      fontWeight: 'bold', 
      color: '#111518', 
      mt: 3, 
      mb: 1.5 
    }}
  >
    {children}
  </Typography>
);

const ExampleCard = ({ japanese, translation }) => (
  <Paper 
    variant="outlined"
    sx={{ 
      p: 2, 
      mb: 1.5, 
      bgcolor: '#f7f8fa', 
      border: '1px solid #e0e0e0', 
      borderRadius: '12px' 
    }}
  >
    <Typography variant="body1" sx={{ color: '#111518' }}>{japanese}</Typography>
    <Typography variant="body2" sx={{ color: '#637988', mt: 0.5 }}>{translation}</Typography>
  </Paper>
);

const VerbDetail = ({ verb }) => {

  const speak = (text) => {
    if (!text || !'speechSynthesis' in window) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    speechSynthesis.speak(utterance);
  };

  // Dummy data to match the design
  const examples = [
    { japanese: 'わたしは、日本語を学んでいます。', translation: 'I am learning Japanese.' },
    { japanese: '日本語は、とても難しいです。', translation: 'Japanese is very difficult.' },
  ];

  const conjugations = verb.conjugations || {
      "Present": { "positive": "行きます", "negative": "行きません" },
      "Past": { "positive": "行きました", "negative": "行きませんでした" },
      "Te-form": { "positive": "行って", "negative": "-" },
      "Potential": { "positive": "行けます", "negative": "行けません" },
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: '16px', m: 2, bgcolor: 'white' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* This is a placeholder for the symbol before the title */}
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>&#12540;</Typography> 
          <IconButton onClick={() => speak(verb.furigana)} sx={{ color: '#e72b4d' }}>
            <VolumeUpIcon />
          </IconButton>
        </Box>
        <Button variant="outlined" startIcon={<EditIcon />} sx={{ textTransform: 'none', color: '#111518', borderColor: '#e0e0e0', borderRadius: '8px' }}>
          Edit
        </Button>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {verb.english}
      </Typography>

      <SectionTitle>Pronunciation</SectionTitle>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button variant="contained" sx={{ bgcolor: '#e72b4d', '&:hover': { bgcolor: '#c92140' }, textTransform: 'none', borderRadius: '8px', boxShadow: 'none', px: 3 }}>Standard</Button>
        <Button variant="contained" sx={{ bgcolor: '#f0f3f4', color: '#111518', '&:hover': { bgcolor: '#e0e3e4' }, textTransform: 'none', borderRadius: '8px', boxShadow: 'none', px: 3 }}>Slow</Button>
      </Box>

      <SectionTitle>Examples</SectionTitle>
      <Box>
        {examples.map((ex, index) => <ExampleCard key={index} {...ex} />)}
      </Box>

      <SectionTitle>Verb Conjugation</SectionTitle>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '12px', borderColor: '#e0e0e0' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Form</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Positive</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Negative</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(conjugations).map(([form, values]) => (
              <TableRow key={form} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">{form}</TableCell>
                <TableCell>{values.positive || '-'}</TableCell>
                <TableCell>{values.negative || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <SectionTitle>Related Grammar</SectionTitle>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip label="ます" sx={{ bgcolor: '#e6f5ec', color: '#268c60', fontWeight: 500, borderRadius: '8px' }} />
        <Chip label="ません" sx={{ bgcolor: '#fcebea', color: '#c0392b', fontWeight: 500, borderRadius: '8px' }} />
      </Box>
    </Paper>
  );
};

export default VerbDetail;