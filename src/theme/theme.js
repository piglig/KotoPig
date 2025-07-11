import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
  palette: {
    mode: 'light', // Change to light mode to match the login page design
    primary: {
      main: '#e72b4d',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#fcf8f9',
      paper: '#ffffff',
    },
    info: {
      main: '#974e5b',
      light: '#f3e7ea',
    },
    success: {
      main: '#268c60',
      light: '#e6f5ec',
    },
    error: {
      main: '#c0392b',
      light: '#fcebea',
    },
  },
  typography: {
    fontFamily: [
      'Plus Jakarta Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: '8px',
          ...(ownerState.severity === 'info' && {
            backgroundColor: '#f3e7ea',
            color: '#974e5b',
          }),
          ...(ownerState.severity === 'success' && {
            backgroundColor: '#e6f5ec',
            color: '#268c60',
          }),
          ...(ownerState.severity === 'error' && {
            backgroundColor: '#fcebea',
            color: '#c0392b',
          }),
        }),
        icon: ({ ownerState }) => ({
          ...(ownerState.severity === 'info' && {
            color: '#974e5b',
          }),
          ...(ownerState.severity === 'success' && {
            color: '#268c60',
          }),
          ...(ownerState.severity === 'error' && {
            color: '#c0392b',
          }),
        }),
      },
    },
  },
});

export default theme;
