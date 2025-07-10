import React, { useState } from 'react';
import { Card, CardContent, CardActions, Typography, Chip, Box, Button, Collapse, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { AddCircleOutline, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const VerbCard = ({ word, onSelect, isLearned }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = (e) => {
    e.stopPropagation(); // Prevent card's onSelect from firing
    setExpanded(!expanded);
  };

  const handleAddToList = (e) => {
    e.stopPropagation();
    // Placeholder for add to list functionality
    console.log(`Added ${word.word} to list.`);
    alert(`“${word.word}” 已添加到我的词表`);
  };

  const typeColor = {
    verb: 'primary',
    noun: 'success',
    adjective: 'warning',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <Card
        sx={{
          borderLeft: 5,
          borderColor: `${typeColor[word.type]}.main`,
          position: 'relative',
          boxShadow: 3,
          '&:hover': {
            boxShadow: 6,
          },
        }}
      >
        {isLearned && (
          <Chip
            label="已学习"
            color="success"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontWeight: 'bold',
            }}
          />
        )}
        <CardContent onClick={() => onSelect(word)} sx={{ cursor: 'pointer' }}>
          <Typography variant="h5" component="div">
            {word.word}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {word.reading}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {word.meaning}
          </Typography>
          <Box>
            <Chip label={word.type} color={typeColor[word.type] || 'default'} size="small" />
            {word.group && <Chip label={`Group ${word.group}`} size="small" sx={{ ml: 1 }} />}
          </Box>
        </CardContent>
        <CardActions disableSpacing>
          <Button
            size="small"
            startIcon={<AddCircleOutline />}
            onClick={handleAddToList}
          >
            添加到词表
          </Button>
          {word.type === 'verb' && word.forms && Object.keys(word.forms).length > 0 && (
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show conjugations"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          )}
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent sx={{ pt: 0 }}>
            <Typography variant="subtitle2">活用形:</Typography>
            <List dense>
              {Object.entries(word.forms).map(([name, form]) => (
                <ListItem key={name} disablePadding>
                  <ListItemText primary={form} secondary={name} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Collapse>
      </Card>
    </motion.div>
  );
};

export default VerbCard;