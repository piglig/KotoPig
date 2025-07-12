import React from 'react';
import { Box, Container, Paper, Typography, AppBar, Toolbar, Link, List, ListItem, ListItemIcon, SvgIcon } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Circle } from '@mui/icons-material';

import KotoPigLogo from '../components/KotoPigLogo';

const Section = ({ title, children }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#1b0e10', mb: 2 }}>
      {title}
    </Typography>
    <Box sx={{ color: '#5c5c5c', '& p': { lineHeight: 1.7 } }}>
      {children}
    </Box>
  </Box>
);

const TermsOfServicePage = () => {
  return (
    <Box sx={{ bgcolor: '#fcf8f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', borderBottom: '1px solid #f3e7ea' }}>
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 5 }, py: 1.5 }}>
          <Link component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#1b0e10', textDecoration: 'none' }}>
            <KotoPigLogo sx={{ fontSize: 28 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              KotoPig
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: { xs: 3, sm: 6 }, flexGrow: 1 }}>
        <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: '16px' }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: '#e72b4d', textAlign: 'center', mb: 1 }}>
            Terms of Service
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 5 }}>
            Last updated: July 11, 2025
          </Typography>

          <Section title="1. Acceptance of Terms">
            <Typography paragraph>
              By accessing or using KotoPig (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service. This is a placeholder document and does not constitute legal advice.
            </Typography>
          </Section>

          <Section title="2. User Accounts">
            <Typography paragraph>
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
            </Typography>
          </Section>

          <Section title="3. User Conduct">
            <Typography paragraph component="div">
              You agree not to use the Service to:
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 28 }}><Circle sx={{ fontSize: 8, color: '#e72b4d' }} /></ListItemIcon>
                <Typography>violate any local, state, national, or international law;</Typography>
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 28 }}><Circle sx={{ fontSize: 8, color: '#e72b4d' }} /></ListItemIcon>
                <Typography>harass, abuse, or harm another person;</Typography>
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 28 }}><Circle sx={{ fontSize: 8, color: '#e72b4d' }} /></ListItemIcon>
                <Typography>impersonate any person or entity.</Typography>
              </ListItem>
            </List>
          </Section>

          <Section title="4. Termination">
            <Typography paragraph>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </Typography>
          </Section>

          <Section title="5. Disclaimer">
            <Typography paragraph>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied.
            </Typography>
          </Section>

          <Section title="6. Changes to Terms">
            <Typography paragraph>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect.
            </Typography>
          </Section>

          <Section title="7. Contact Us">
            <Typography paragraph>
              If you have any questions about these Terms, please contact us.
            </Typography>
          </Section>
        </Paper>
      </Container>

      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', textAlign: 'center', color: '#974e5b' }}>
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} KotoPig. All Rights Reserved.
        </Typography>
        <Link component={RouterLink} to="/" color="inherit" sx={{ ml: 1 }}>
          Return to Home
        </Link>
      </Box>
    </Box>
  );
};

export default TermsOfServicePage;