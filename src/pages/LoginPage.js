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
  Divider,
  SvgIcon,
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

const KotoPigLogo = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <path
      d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
    />
  </SvgIcon>
);

const AppleIcon = (props) => (
    <SvgIcon {...props} viewBox="0 0 24 24">
        <path
            d="M19.664 13.852c-.098-2.495 2.045-3.686 2.137-3.742-1.163-1.699-2.968-1.931-3.608-1.953-1.533-.155-2.993.902-3.771.902-.776 0-1.971-.878-3.243-.854-1.671.025-3.223.977-4.084 2.482-1.741 3.016-.445 7.476 1.25 9.92.833 1.182 1.822 2.505 3.116 2.456 1.244-.05 1.713-.793 3.217-.793 1.503 0 1.923.793 3.245.77 1.344-.025 2.192-1.184 3.003-2.373.94-1.376 1.326-2.717 1.348-2.788-.03-.014-2.575-1.017-2.616-4.027zm-3.038-7.473c.688-.835 1.154-2.01 1.027-3.179-1.007.04-2.223.675-2.945 1.51-.64.728-1.204 1.899-1.055 3.015 1.115.086 2.286-.565 2.973-1.346z"
        />
    </SvgIcon>
);


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
              Koto-Pig
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
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px #fcf8f9 inset',
                  WebkitTextFillColor: '#1b0e10',
                  transition: 'background-color 5000s ease-in-out 0s',
                  caretColor: '#1b0e10',
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
              startIcon={<AppleIcon />}
              sx={{
                py: 1,
                borderRadius: '999px',
                bgcolor: 'black',
                color: 'white',
                textTransform: 'none',
                fontWeight: 'semibold',
                fontSize: '16px',
                '&:hover': { bgcolor: '#333' },
              }}
            >
              Login with Apple
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