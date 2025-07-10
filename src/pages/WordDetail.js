import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWordContext } from '../contexts/WordContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
  Chip,
  Tabs,
  Tab,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { ArrowBack, VolumeUp, OpenInNew } from '@mui/icons-material';
import { motion } from 'framer-motion';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`word-tabpanel-${index}`}
      aria-labelledby={`word-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const WordDetail = () => {
  const { word: wordParam } = useParams();
  const navigate = useNavigate();
  const { words, learnWord, progress } = useWordContext();
  const [word, setWord] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (words.length > 0 && wordParam) {
      const foundWord = words.find(w => w.word === wordParam);
      setWord(foundWord);
    }
  }, [words, wordParam]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const speak = (text, e) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('您的浏览器不支持语音朗读功能。');
    }
  };

  if (!word) {
    return <Container sx={{ py: 4 }}><Typography>加载中或未找到词汇...</Typography></Container>;
  }

  const isLearned = !!progress[word.word];
  const hasForms = word.forms && Object.keys(word.forms).length > 0;
  const hasExamples = word.examples && word.examples.length > 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Container sx={{ py: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          返回列表
        </Button>

        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
                  {word.word}
                </Typography>
                <Typography variant="h5" component="span" sx={{ opacity: 0.8 }}>
                  {word.reading}
                </Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={(e) => speak(word.reading, e)} sx={{ color: 'primary.contrastText', backgroundColor: 'rgba(255,255,255,0.2)', '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } }}>
                  <VolumeUp />
                </IconButton>
              </Grid>
            </Grid>
            <Typography variant="h6" sx={{ mt: 2 }}>{word.meaning}</Typography>
          </Box>

          <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Chip label={word.type} color="secondary" />
              </Grid>
              {word.group && <Grid item><Chip label={`Group: ${word.group}`} /></Grid>}
              {word.jlpt_level && <Grid item><Chip label={`JLPT: ${word.jlpt_level}`} /></Grid>}
              <Grid item xs />
              <Grid item>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => learnWord(word)}
                  disabled={isLearned}
                >
                  {isLearned ? '已在学习计划' : '加入学习计划'}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  href={`https://jisho.org/search/${word.word}`}
                  target="_blank"
                  endIcon={<OpenInNew />}
                >
                  Jisho
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="word details tabs" variant="fullWidth">
              {hasForms && <Tab label="活用形" />}
              {hasExamples && <Tab label="例句" />}
            </Tabs>
          </Box>

          {hasForms && (
            <TabPanel value={tabValue} index={0}>
              <List>
                {Object.entries(word.forms).map(([name, form]) => (
                  <React.Fragment key={name}>
                    <ListItem>
                      <ListItemText primary={form} secondary={name.replace(/_/g, ' ')} />
                      <IconButton onClick={(e) => speak(form, e)} size="small">
                        <VolumeUp fontSize="inherit" />
                      </IconButton>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </TabPanel>
          )}

          {hasExamples && (
            <TabPanel value={tabValue} index={hasForms ? 1 : 0}>
              <List>
                {word.examples.map((ex, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start" sx={{ flexDirection: 'column' }}>
                      <Typography variant="body1">{ex.japanese}</Typography>
                      <Typography variant="caption" color="text.secondary">{ex.reading}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{ex.translation}</Typography>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </TabPanel>
          )}
        </Paper>
      </Container>
    </motion.div>
  );
};

export default WordDetail;