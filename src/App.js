import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { WordProvider } from './contexts/WordContext';
import HomePage from './pages/HomePage';
import WordList from './pages/WordList';
import WordDetail from './pages/WordDetail';
import QuizView from './components/QuizView';
import ProgressView from './components/ProgressView';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

function App() {
  return (
    <Router>
      <WordProvider>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Button color="inherit" component={Link} to="/">
                日语词汇学习工具
              </Button>
            </Typography>
            <Button color="inherit" component={Link} to="/list">
              词汇列表
            </Button>
            <Button color="inherit" component={Link} to="/quiz">
              开始复习
            </Button>
            <Button color="inherit" component={Link} to="/progress">
              我的进度
            </Button>
          </Toolbar>
        </AppBar>

        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/list" element={<WordList />} />
            <Route path="/detail/:word" element={<WordDetail />} />
            <Route path="/quiz" element={<QuizView />} />
            <Route path="/progress" element={<ProgressView />} />
          </Routes>
        </div>
      </WordProvider>
    </Router>
  );
}

export default App;