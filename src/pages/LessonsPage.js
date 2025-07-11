import React from 'react';
import { Box, Typography } from '@mui/material';

const LessonsPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h4" color="text.secondary">Lessons Page - Coming Soon!</Typography>
      </Box>
    </Box>
  );
};

export default LessonsPage;