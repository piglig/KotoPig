import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WordProvider } from './contexts/WordContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ProgressPage from './pages/ProgressPage';
import LessonsPage from './pages/LessonsPage';
import MyListPage from './pages/MyListPage';
import Navbar from './components/Navbar';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';

// A wrapper for protected routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <WordProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route 
                path="/progress"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <ProgressPage />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/lessons"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <LessonsPage />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/mylist"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <MyListPage />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <HomePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </WordProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;