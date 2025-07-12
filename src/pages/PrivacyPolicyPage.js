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
    <Box sx={{ color: '#5c5c5c', '& p': { lineHeight: 1.7 }, '& ul': { pl: 2 } }}>
      {children}
    </Box>
  </Box>
);

const PrivacyPolicyPage = () => {
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
            Privacy Policy
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 5 }}>
            Last updated: July 11, 2025
          </Typography>

          <Section title="Introduction">
            <Typography paragraph>
              Welcome to KotoPig. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and disclose your information. This is a placeholder document and does not constitute legal advice.
            </Typography>
          </Section>

          <Section title="1. Information We Collect">
            <Typography paragraph component="div">
              We collect information that you provide directly to us when you create an account. The types of information we may collect include:
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 28 }}><Circle sx={{ fontSize: 8, color: '#e72b4d' }} /></ListItemIcon>
                <Typography>Your email address</Typography>
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 28 }}><Circle sx={{ fontSize: 8, color: '#e72b4d' }} /></ListItemIcon>
                <Typography>Your password (which is encrypted and we cannot see)</Typography>
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 28 }}><Circle sx={{ fontSize: 8, color: '#e72b4d' }} /></ListItemIcon>
                <Typography>Information provided by third-party authentication providers, such as your name and profile picture.</Typography>
              </ListItem>
            </List>
          </Section>

          <Section title="2. How We Use Your Information">
             <Typography paragraph component="div">
              We use the information we collect to:
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 28 }}><Circle sx={{ fontSize: 8, color: '#e72b4d' }} /></ListItemIcon>
                <Typography>Provide, maintain, and improve our Service.</Typography>
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 28 }}><Circle sx={{ fontSize: 8, color: '#e72b4d' }} /></ListItemIcon>
                <Typography>Create and manage your account.</Typography>
              </ListItem>
              <ListItem sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 28 }}><Circle sx={{ fontSize: 8, color: '#e72b4d' }} /></ListItemIcon>
                <Typography>Communicate with you about your account or our Service.</Typography>
              </ListItem>
            </List>
          </Section>

          <Section title="3. Third-Party Services">
            <Typography paragraph component="div">
              Our Service is built using third-party services for authentication and backend infrastructure. By using our Service, you also agree to the policies of these providers:
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ py: 0.5, display: 'list-item' }}>
                  <strong>Supabase:</strong> Used for our database and authentication backend. You can view their privacy policy at <Link href="https://supabase.com/privacy" target="_blank" rel="noopener">supabase.com/privacy</Link>.
              </ListItem>
              <ListItem sx={{ py: 0.5, display: 'list-item' }}>
                  <strong>Google (for Google Login):</strong> If you sign in with Google, we will receive information from your Google account as per their policies. You can view their privacy policy at <Link href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com/privacy</Link>.
              </ListItem>
              <ListItem sx={{ py: 0.5, display: 'list-item' }}>
                  <strong>Twitter (X) (for Twitter Login):</strong> If you sign in with Twitter, we will receive your email address and public profile information. You can view their privacy policy at <Link href="https://twitter.com/en/privacy" target="_blank" rel="noopener">twitter.com/en/privacy</Link>.
              </ListItem>
            </List>
          </Section>

          <Section title="4. Data Security">
            <Typography paragraph>
              We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. Our authentication is handled securely by Supabase.
            </Typography>
          </Section>

          <Section title="5. Changes to This Policy">
            <Typography paragraph>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
            </Typography>
          </Section>

          <Section title="6. Contact Us">
            <Typography paragraph>
              If you have any questions about this Privacy Policy, please contact us.
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

export default PrivacyPolicyPage;