
import React, { useState } from 'react';
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
  SvgIcon,
} from '@mui/material';

const KotoPigLogo = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <path
      d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
    />
  </SvgIcon>
);

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await register(email, password);
      setSuccess('Registration successful! Please check your email to verify your account.');
      setTimeout(() => navigate('/login'), 5000); // Redirect to login after 5s
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fcf8f9' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', borderBottom: '1px solid #f3e7ea' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: 5, py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#1b0e10' }}>
            <KotoPigLogo sx={{ fontSize: 24 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Koto-Pig
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Link component={RouterLink} to="/login" color="#1b0e10" sx={{ textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Login</Link>
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: '16px', bgcolor: 'white', maxWidth: '480px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', color: '#1b0e10' }}>
              Create an Account
            </Typography>
            <Typography variant="body2" sx={{ color: '#974e5b', mt: 0.5 }}>
              Start your Japanese learning journey
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2, width: '100%' }}>{success}</Alert>}
          
          <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
            <TextField
              type="email"
              label="Email Address"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              InputLabelProps={{
                sx: {
                  color: '#974e5b',
                  '&.Mui-focused': {
                    color: '#e72b4d',
                  },
                },
              }}
              inputProps={{
                sx: { color: '#1b0e10' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#fcf8f9',
                  '& fieldset': { borderColor: '#e7d0d4' },
                  '&:hover fieldset': { borderColor: '#e72b4d' },
                  '&.Mui-focused fieldset': { borderColor: '#e72b4d' },
                },
              }}
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
              InputLabelProps={{
                sx: {
                  color: '#974e5b',
                  '&.Mui-focused': {
                    color: '#e72b4d',
                  },
                },
              }}
              inputProps={{
                sx: { color: '#1b0e10' },
              }}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#fcf8f9',
                  '& fieldset': { borderColor: '#e7d0d4' },
                  '&:hover fieldset': { borderColor: '#e72b4d' },
                  '&.Mui-focused fieldset': { borderColor: '#e72b4d' },
                },
              }}
            />
            <TextField
              type="password"
              label="Confirm Password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              InputLabelProps={{
                sx: {
                  color: '#974e5b',
                  '&.Mui-focused': {
                    color: '#e72b4d',
                  },
                },
              }}
              inputProps={{
                sx: { color: '#1b0e10' },
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  backgroundColor: '#fcf8f9',
                  '& fieldset': { borderColor: '#e7d0d4' },
                  '&:hover fieldset': { borderColor: '#e72b4d' },
                  '&.Mui-focused fieldset': { borderColor: '#e72b4d' },
                },
              }}
            />

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
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ color: '#974e5b', textAlign: 'center', mt: 3 }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" sx={{ color: '#e72b4d', fontWeight: 'medium', textDecoration: 'underline' }}>
              Login
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
