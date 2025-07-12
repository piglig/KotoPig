import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
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
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        margin: 'normal',
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#fcf8f9',
          '& fieldset': {
            borderColor: '#e7d0d4',
          },
          '&:hover fieldset': {
            borderColor: '#e72b4d',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#e72b4d',
          },
          '&.Mui-error fieldset': {
            borderColor: '#e72b4d',
          },
        },
        input: {
          color: '#1b0e10',
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px #fcf8f9 inset',
            WebkitTextFillColor: '#1b0e10',
            caretColor: '#1b0e10',
            transition: 'background-color 5000s ease-in-out 0s',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#974e5b',
          '&.Mui-focused': {
            color: '#e72b4d',
          },
        },
      },
    },
  },
});

export default theme;
