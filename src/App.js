import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { WordProvider } from './contexts/WordContext';
import HomePage from './pages/HomePage';
import WordList from './pages/WordList';
import WordDetail from './pages/WordDetail';
import QuizView from './components/QuizView';
import ProgressView from './components/ProgressView';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar } from '@mui/material';
import { Bell } from 'phosphor-react';

function App() {
  return (
    <Router>
      <WordProvider>
        <AppBar position="static" sx={{ backgroundColor: '#fbf9f9', borderBottom: '1px solid #f1e9eb', color: '#191012' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_6_330)">
                      <path fillRule="evenodd" clipRule="evenodd" d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z" fill="currentColor"></path>
                  </g>
                  <defs><clipPath id="clip0_6_330"><rect width="48" height="48" fill="white"></rect></clipPath></defs>
              </svg>
              <Typography variant="h6" component={Link} to="/" sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
                Koto-Pig
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Button color="inherit" component={Link} to="/list" sx={{ textTransform: 'none' }}>Learn</Button>
              <Button color="inherit" component={Link} to="/quiz" sx={{ textTransform: 'none' }}>Review</Button>
              <Button color="inherit" component={Link} to="/progress" sx={{ textTransform: 'none' }}>Progress</Button>
              <IconButton sx={{ backgroundColor: '#f1e9eb' }}>
                <Bell size={20} />
              </IconButton>
              <Avatar alt="User Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN4EmvxM9fztLIfT-_TvUm8NwmAv1lWDZi5HqtbtEldQKNwFukUNkflBG691-zYU1E0X__sfe4xyBGH5L4cNqIN3G-qWsypFLCc9uvuBAkqjehSZxqI4M4-0ZsmuzMypvvwycL4vif89PFRPoenAAhU17xX1m_X13Jc7gCKU5XE5zNLp53WhM9P4L8dj4Tr9dnXcW-2Q-nzg4GA-dPMMHeg_4qnL67I1-2ELUd0k3aCnE2Gf_CrH6u1W09bZ1YYWMrk2LjS_Jgk6s" />
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ backgroundColor: '#fbf9f9', minHeight: 'calc(100vh - 65px)' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/list" element={<WordList />} />
            <Route path="/detail/:word" element={<WordDetail />} />
            <Route path="/quiz" element={<QuizView />} />
            <Route path="/progress" element={<ProgressView />} />
          </Routes>
        </Box>
      </WordProvider>
    </Router>
  );
}

export default App;
