import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  AppBar,
  Toolbar,
  Container,
  Paper,
  Link,
  Divider,
} from '@mui/material';
import { Google as GoogleIcon, Twitter as TwitterIcon } from '@mui/icons-material';
import KotoPigLogo from '../components/KotoPigLogo';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, loginWithTwitter, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTwitterLogin = async () => {
    try {
      await loginWithTwitter();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fcf8f9' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', borderBottom: '1px solid #f3e7ea' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 5, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#1b0e10' }}>
            <KotoPigLogo sx={{ fontSize: 24 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              KotoPig
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Link component={RouterLink} to="/" color="#1b0e10" sx={{ textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Home</Link>
            <Link href="#" color="#1b0e10" sx={{ textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>About</Link>
            <Link href="#" color="#1b0e10" sx={{ textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Contact</Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: '16px', bgcolor: 'white', maxWidth: '480px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <KotoPigLogo sx={{ fontSize: 40, color: '#e72b4d', mb: 1.5 }} />
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', color: '#1b0e10' }}>
              KotoPig
            </Typography>
            <Typography variant="body2" sx={{ color: '#974e5b', mt: 0.5 }}>
              Master Japanese words efficiently
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <TextField
              type="email"
              label="Email or Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
            <Box sx={{ textAlign: 'right', mb: 2 }}>
              <Link href="#" variant="body2" sx={{ color: '#974e5b', textDecoration: 'underline' }}>
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                bgcolor: '#e72b4d',
                color: 'white',
                borderRadius: '999px',
                textTransform: 'none',
                fontWeight: 'semibold',
                fontSize: '16px',
                '&:hover': { bgcolor: '#c92140' },
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>

          <Divider sx={{ my: 3, color: '#974e5b', fontSize: '14px' }}>Or login with</Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{
                py: 1,
                borderRadius: '999px',
                borderColor: 'grey.300',
                color: 'black',
                textTransform: 'none',
                fontWeight: 'semibold',
                fontSize: '16px',
                '&:hover': { bgcolor: 'grey.50', borderColor: 'grey.400' },
              }}
            >
              Login with Google
            </Button>
            <Button
              fullWidth
              variant="contained"
              startIcon={<TwitterIcon />}
              onClick={handleTwitterLogin}
              sx={{
                py: 1,
                borderRadius: '999px',
                bgcolor: '#1DA1F2', // Twitter Blue
                color: 'white',
                textTransform: 'none',
                fontWeight: 'semibold',
                fontSize: '16px',
                '&:hover': { bgcolor: '#1a91da' },
              }}
            >
              Login with Twitter
            </Button>
          </Box>

          <Typography variant="body2" sx={{ color: '#974e5b', textAlign: 'center', mt: 3 }}>
            Don’t have an account?{' '}
            <Link component={RouterLink} to="/register" sx={{ color: '#e72b4d', fontWeight: 'medium', textDecoration: 'underline' }}>
              Register
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
