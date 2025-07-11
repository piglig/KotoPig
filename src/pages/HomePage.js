import React from 'react';
import { Box, Container, Grid, Typography, List, ListItem, ListItemText, Divider, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Trophy, Star, Fire } from 'phosphor-react';
import Navbar from '../components/Navbar'; // Import the Navbar component

// Styled components
const HeroImage = styled('div')({
  backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCtFqVll_BYMwPIv5TWqnRbLOdJaUHugB41gPlceqvM9O8CaUrtDVBqOc-o4V0GARaG25orqV9fagV3tSsi8_wyTA9-nLT02fHt1iaR9e3u3Bgv3tkghVSzuQqyWemdNzGv25KsDLJ0yb0GdcmXzxG9LThZRmrWcc2tKvfITRMPMgDXFjuIOL3KCqrGfTMZ3MH8wCenyitVEcXzE8JR7e62HSvW-JOTSK0nuUEBb7O9j8Y3PLYsm6MHRXedRaNK6ecxggmFzIAZzFg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: 320,
  borderRadius: '12px',
  marginBottom: '16px',
});

const StatCard = ({ title, value }) => (
  <Box sx={{
    backgroundColor: '#f1e9eb',
    borderRadius: '12px',
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    height: '100%'
  }}>
    <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: '#191012' }}>
      {title}
    </Typography>
    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#191012', lineHeight: 1.25 }}>
      {value}
    </Typography>
  </Box>
);

const ProgressChart = () => (
  <svg width="100%" height="148" viewBox="-3 0 478 150" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z" fill="url(#paint0_linear_1131_5935)"></path>
    <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#8c5a63" strokeWidth="3" strokeLinecap="round"></path>
    <defs>
      <linearGradient id="paint0_linear_1131_5935" x1="236" y1="1" x2="236" y2="149" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f1e9eb"></stop>
        <stop offset="1" stopColor="#f1e9eb" stopOpacity="0"></stop>
      </linearGradient>
    </defs>
  </svg>
);

const milestones = [
  { icon: <Trophy size={24} />, title: "First 100 Words", date: "Reached on Oct 15, 2024" },
  { icon: <Star size={24} />, title: "Completed Level 1", date: "Completed on Nov 1, 2024" },
  { icon: <Fire size={24} />, title: "30-Day Streak", date: "Achieved on Nov 15, 2024" },
];

const ChallengingWordRow = ({ word, difficulty }) => (
  <ListItem sx={{ py: 1 }}>
    <ListItemText primary={<Typography sx={{ fontSize: '0.875rem', color: '#191012' }}>{word}</Typography>} />
    <Paper sx={{ backgroundColor: '#f1e9eb', color: '#191012', borderRadius: '999px', px: 2, py: 0.5, minWidth: '84px', textAlign: 'center' }}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>{difficulty}</Typography>
    </Paper>
  </ListItem>
);

const HomePage = () => {
  return (
    <Box sx={{ backgroundColor: '#fff', color: '#191012' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <HeroImage />
        <Typography variant="h4" sx={{ fontWeight: 'bold', my: 3, letterSpacing: '-0.033em' }}>
          Your Learning Journey
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4, display: 'flex' }}>
          <Grid item sx={{ flex: 1 }}>
            <StatCard title="Words Learned" value="300" />
          </Grid>
          <Grid item sx={{ flex: 1 }}>
            <StatCard title="Review Streak" value="75" />
          </Grid>
        </Grid>



        <Box sx={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e3d3d6', p: 3, mb: 4 }}>
          <CardContent>
            <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>Progress Over Time</Typography>
            <Typography sx={{ fontSize: '2rem', fontWeight: 700 }}>+20%</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Typography sx={{ fontSize: '1rem', color: '#8c5a63' }}>Last 30 Days</Typography>
              <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: '#07885b' }}>+20%</Typography>
            </Box>
            <Box sx={{ minHeight: 180, py: 2 }}>
              <ProgressChart />
            </Box>
            <Grid container justifyContent="space-around">
              {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map(week => (
                <Grid item key={week}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#8c5a63' }}>{week}</Typography>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 5, mb: 2 }}>
          Milestones
        </Typography>
        <Box>
          {milestones.map((milestone, index) => (
            <Grid container key={index} sx={{ alignItems: 'stretch' }}>
              <Grid item sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2 }}>
                <Box sx={{ color: '#191012', py: 1 }}>
                  {milestone.icon}
                </Box>
                {index < milestones.length - 1 && (
                  <Box sx={{ width: '2px', flexGrow: 1, backgroundColor: '#e3d3d6' }} />
                )}
              </Grid>
              <Grid item sx={{ pb: index < milestones.length - 1 ? 3 : 0, pt: 1 }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: '#191012' }}>
                  {milestone.title}
                </Typography>
                <Typography sx={{ fontSize: '1rem', color: '#8c5a63' }}>
                  {milestone.date}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 5, mb: 2 }}>
          Challenging Words
        </Typography>
        <Box sx={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e3d3d6' }}>
          <List sx={{ p: 0 }}>
            <ListItem sx={{ py: 1.5 }}>
              <ListItemText><Typography sx={{ fontWeight: 'medium' }}>Word</Typography></ListItemText>
              <ListItemText sx={{ textAlign: 'left' }}><Typography sx={{ fontWeight: 'medium' }}>Difficulty</Typography></ListItemText>
            </ListItem>
            <Divider component="li" />
            <ChallengingWordRow word="日本" difficulty="High" />
            <Divider component="li" />
            <ChallengingWordRow word="こんにちは" difficulty="Medium" />
            <Divider component="li" />
            <ChallengingWordRow word="ありがとう" difficulty="Low" />
            <Divider component="li" />
            <ChallengingWordRow word="さようなら" difficulty="Medium" />
            <Divider component="li" />
            <ChallengingWordRow word="またね" difficulty="High" />
          </List>
        </Box>

      </Container>
    </Box>
  );
};

export default HomePage;
