
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem, Link, Divider } from '@mui/material';
import { Notifications as NotificationsIcon, Logout as LogoutIcon, AccountCircle as AccountCircleIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import KotoPigLogo from './KotoPigLogo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Lessons', path: '/lessons' }, // Assuming a lessons page
    { name: 'My List', path: '/mylist' },   // Assuming a mylist page
    { name: 'Progress', path: '/progress' },
  ];

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
            {navLinks.map((link) => (
              <Link
                component={RouterLink}
                to={link.path}
                key={link.name}
                color="inherit"
                sx={{
                  textDecoration: 'none',
                  fontWeight: 500,
                  position: 'relative',
                  '&:hover': {
                    color: 'primary.main',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    transform: 'scaleX(0)',
                    height: '2px',
                    bottom: '-5px',
                    left: 0,
                    backgroundColor: 'primary.main',
                    transformOrigin: 'bottom right',
                    transition: 'transform 0.25s ease-out',
                  },
                  '&:hover::after': {
                    transform: 'scaleX(1)',
                    transformOrigin: 'bottom left',
                  },
                  ...(location.pathname === link.path && {
                    color: 'primary.main',
                    '&::after': {
                      transform: 'scaleX(1)',
                      transformOrigin: 'bottom left',
                    },
                  }),
                }}
              >
                {link.name}
              </Link>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
