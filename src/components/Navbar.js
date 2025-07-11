
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, InputBase, IconButton, Avatar, Menu, MenuItem, Link, SvgIcon, Divider } from '@mui/material';
import { Search as SearchIcon, Notifications as NotificationsIcon, Logout as LogoutIcon, AccountCircle as AccountCircleIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const KotoPigLogo = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48" fill="none">
    <g clipPath="url(#clip0_6_330)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
        fill="currentColor"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_6_330"><rect width="48" height="48" fill="white"></rect></clipPath>
    </defs>
  </SvgIcon>
);

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navbar = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'white', color: '#111518', borderBottom: '1px solid #f0f3f4' }} elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#111518', textDecoration: 'none' }}>
            <KotoPigLogo sx={{ fontSize: 28 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}>
              Koto-Pig
            </Typography>
          </Link>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            <Link component={RouterLink} to="/" color="inherit" sx={{ textDecoration: 'none', fontWeight: 500 }}>Home</Link>
            <Link href="#" color="inherit" sx={{ textDecoration: 'none', fontWeight: 500 }}>Lessons</Link>
            <Link href="#" color="inherit" sx={{ textDecoration: 'none', fontWeight: 500 }}>My List</Link>
            <Link component={RouterLink} to="/progress" color="inherit" sx={{ textDecoration: 'none', fontWeight: 500 }}>Progress</Link>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <IconButton size="large" color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton size="large" edge="end" color="inherit" onClick={handleMenuOpen}>
            <Avatar sx={{ width: 32, height: 32 }} src={user?.user_metadata?.avatar_url} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email.split('@')[0]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleMenuClose}>
              <AccountCircleIcon sx={{ mr: 1.5 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <SettingsIcon sx={{ mr: 1.5 }} /> Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1.5 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
