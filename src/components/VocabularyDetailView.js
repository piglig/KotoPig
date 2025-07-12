import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Chip,
  Paper,
  Tab,
  Tabs,
  Avatar,
  TextField,
  Divider,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  VolumeUp as VolumeUpIcon,
  Edit as EditIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Reply as ReplyIcon,
  AccessTime as AccessTimeIcon,
  Whatshot as WhatshotIcon
} from '@mui/icons-material';

const VocabularyDetailView = ({ word }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [commentSortOrder, setCommentSortOrder] = useState('popular'); // 'popular' or 'latest'

  useEffect(() => {
    setActiveTab(0); // Reset to details tab when word changes
  }, [word]);

  const speak = (text) => {
    if (!text || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    speechSynthesis.speak(utterance);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCommentSubmit = () => {
    console.log('Submit comment:', commentText);
    setCommentText('');
  };

  const handleSortChange = () => {
    setCommentSortOrder(prev => prev === 'popular' ? 'latest' : 'popular');
  };

  const mockComments = [
    {
      id: 1,
      author: '田中 健',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI9ANJUuXZFNDAnYz4DohwECNXnh2r6ZiNoPDWpuXIRcnbVshQ8E6RiBtb5Udw4Q9iOqAGD5GprC1Yym-rtykjYV77UKR2UKo071RVHdSGlJcuDQNnOKLaNeS1KL6lelzcy3VhgEUt4eksBecHGX_hw-U8Ou0ZlE9D6ST6nbQSyqfWe8oDfTkHQrtXZerAEQ7hcda9uR3zpfuRyIYpe-ew4AWZHeYQizUJGcrmo4sBALx7OltcNZ1esQRPLGlqdaJW1C-TDVnEcg',
      time: '2 小时前',
      content: '这个解释太棒了！终于弄懂了「あっという間に」的用法。',
      likes: 12,
      dislikes: 1,
      replies: [
        {
          id: 11,
          author: '佐藤 美咲',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVe3AKMRRKLjPLHDAdsDhUUK9IP01KXSOtgoMcV6Mj93qylUyvey2ZQQY-tWDWoBqycOpU4j8zi7zHWTb3hLZfOvBHONe55WyF2MN0pW86UbTXobnFRRMbsWtCPv7-p_FtBnlsZENO6SDNLkbcoFRIWUDryTc_CAA5R9SdL23prk-Ela_3zWXBKYc9J-nF2V37up-9SxM9S2Y1Xhgc7qyavWTYMwh4beYtFS-fBIfltYRzI1M4oyrBkrgoZVw3Jtt56kUKB8R8qA',
          content: '同意！例句也很有帮助。',
          likes: 3
        }
      ]
    },
    {
      id: 2,
      author: '铃木 恵子',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHNDEfWGl0UAfZ-HkzetNjqYxzcaPpvAHDhtKGOAePr1Lm0DuXi6UET4OrIMyb9k9XI2ylkJ_OkSCodCw7lgU1Mi9XLWXUdRiPfgE1Dd9n6DtYx9oPFBZ5fSQt3vWMDySPGNfpBEd2vC7kfruYGCN16zA4CDOVBlJy7F-u0YLWQWTolmNcCoS8STU47i0eJwh1fKwrLeaciJOT4BpCGYegci0iR5vlymut9ePO0rkzuEG9yDoTfzAOEYzVAVNMiXN14s3hD7nYVw',
      time: '5 小时前',
      content: '我一直把它和「すぐに」搞混，现在清楚多了。',
      likes: 8,
      dislikes: 0,
      replies: []
    }
  ];

  const sortedComments = [...mockComments].sort((a, b) => {
    if (commentSortOrder === 'popular') {
      return b.likes - a.likes; // Sort by likes (descending)
    } else {
      // For 'latest', we'll assume 'time' can be parsed or use a simple ID sort for mock data
      // In a real app, 'time' would be Date objects for accurate sorting.
      return b.id - a.id; // Simple sort by ID for mock 'latest'
    }
  });

  const mockExamples = [
    {
      japanese: `夏休みは${word?.japanese || 'あっという間に'}終わった。`,
      translation: '暑假一眨眼就结束了。'
    },
    {
      japanese: `彼は${word?.japanese || 'あっという間に'}仕事を終えた。`,
      translation: '他一瞬间就完成了工作。'
    }
  ];

  if (!word) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        bgcolor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <Typography variant="h6" color="text.secondary">
          Select a word to see details
        </Typography>
      </Box>
    );
  }

  const renderDetailsTab = () => (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '2.5rem', md: '3rem' }, 
                fontWeight: 'bold', 
                color: '#111827' 
              }}
            >
              {word.japanese}
            </Typography>
            {word.furigana && (
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '1.25rem', 
                  color: '#6b7280', 
                  mt: -1, 
                  mb: 1 
                }}
              >
                {word.furigana}
              </Typography>
            )}
            <IconButton 
              onClick={() => speak(word.furigana || word.japanese)} 
              sx={{ color: '#e72b4d', '&:hover': { color: '#c92140' } }}
            >
              <VolumeUpIcon sx={{ fontSize: '1.875rem' }} />
            </IconButton>
          </Box>
          <Typography variant="body1" sx={{ fontSize: '1.125rem', color: '#6b7280' }}>
            {word.english}
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          startIcon={<EditIcon />} 
          sx={{ 
            textTransform: 'none', 
            color: '#e72b4d', 
            borderColor: '#f3e7ea',
            bgcolor: '#f3e7ea',
            '&:hover': { bgcolor: '#fcf8f9' },
            borderRadius: '8px',
            px: 2,
            py: 1,
            fontSize: '0.875rem',
            fontWeight: 500
          }}
        >
          Edit
        </Button>
      </Box>

      {/* Examples Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
          Examples
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {mockExamples.map((example, index) => (
            <Paper 
              key={index}
              elevation={0}
              sx={{ 
                p: 2, 
                bgcolor: '#f9fafb', 
                borderRadius: '8px' 
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: '1.125rem', 
                  color: '#111827', 
                  mb: 0.5,
                  '& .highlight': {
                    fontWeight: 'bold',
                    color: '#e72b4d'
                  }
                }}
                dangerouslySetInnerHTML={{
                  __html: example.japanese.replace(
                    word.japanese, 
                    `<span class="highlight">${word.japanese}</span>`
                  )
                }}
              />
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {example.translation}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Related Grammar Section */}
      <Box>
        <Typography variant="h3" sx={{ fontSize: '1rem', fontWeight: 600, color: '#111827', mb: 2 }}>
          Related Grammar
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label="Adverb" 
            sx={{ 
              bgcolor: '#dcfce7', 
              color: '#166534', 
              fontSize: '0.875rem', 
              fontWeight: 500,
              borderRadius: '9999px'
            }} 
          />
          <Chip 
            label="N2" 
            sx={{ 
              bgcolor: '#fef3f2', 
              color: '#c92140', 
              fontSize: '0.875rem', 
              fontWeight: 500,
              borderRadius: '9999px'
            }} 
          />
        </Box>
      </Box>
    </Box>
  );

  const renderCommentsTab = () => (
    <Box sx={{ p: 3 }}>
      {/* Comments Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h3" sx={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>
          Comments (23)
        </Typography>
        <Tooltip title={commentSortOrder === 'popular' ? 'Sort by time' : 'Sort by popularity'}>
          <ToggleButtonGroup
            value={commentSortOrder}
            exclusive
            onChange={handleSortChange}
            sx={{
              bgcolor: '#f3f4f6',
              borderRadius: '8px',
              '& .MuiToggleButton-root': {
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#6b7280',
                borderColor: 'transparent',
                '&.Mui-selected': {
                  bgcolor: '#e72b4d',
                  color: 'white',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#c92140' },
                },
                '&:hover': { bgcolor: '#e5e7eb' },
              },
            }}
          >
            <ToggleButton value={commentSortOrder}>
              {commentSortOrder === 'popular' ? <WhatshotIcon /> : <AccessTimeIcon />}
            </ToggleButton>
          </ToggleButtonGroup>
        </Tooltip>
      </Box>

      {/* Comment Input */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Avatar 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsw9vogSVSwFNMyKxsh1G1Pncxrzm1fMYC0iNSJ10t9Zc758lcwTGWbQ1U8Usbw7oX7IeOO2Sv3KYklM_xg8kLzZmEsLsxz08Y2gO6oAVfEVuSyDH1towuoXNtpHuCKSol82TOmi6d56ILFVjdSUWlxs9-rVc6LdIhxccKssE6Pd1DKtiqd1GLRUbWPob24WkYxQ2mov4pdYWWuvbx6-AnKnGVirW7F0tUQezFcNT0gFt2ZHsnUSbLv1OMBSYhxKmU2thlPxOqnw"
          sx={{ width: 40, height: 40 }}
        />
        <Box sx={{ flex: 1 }}>
          <TextField
            multiline
            rows={3}
            fullWidth
            placeholder="Share your thoughts..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&:hover fieldset': { borderColor: '#e72b4d' },
                '&.Mui-focused fieldset': { borderColor: '#e72b4d' }
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button 
              variant="contained"
              onClick={handleCommentSubmit}
              disabled={!commentText.trim()}
              sx={{ 
                bgcolor: '#e72b4d', 
                '&:hover': { bgcolor: '#c92140' },
                textTransform: 'none',
                borderRadius: '8px',
                px: 3,
                py: 1,
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            >
              Post
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Comments List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {sortedComments.map((comment) => (
          <Box key={comment.id}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Avatar src={comment.avatar} sx={{ width: 40, height: 40 }} />
              <Box sx={{ flex: 1 }}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    bgcolor: '#f3f4f6', 
                    p: 2, 
                    borderRadius: '8px',
                    borderTopLeftRadius: 0
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#111827' }}>
                      {comment.author}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>
                      {comment.time}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#374151' }}>
                    {comment.content}
                  </Typography>
                </Paper>
                
                {/* Comment Actions */}
                <Box sx={{ display: 'flex', gap: 2, mt: 1, ml: 1 }}>
                  <Button 
                    size="small" 
                    startIcon={<ThumbUpIcon sx={{ fontSize: '1rem' }} />}
                    sx={{ 
                      color: '#6b7280', 
                      minWidth: 'auto',
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      '&:hover': { color: '#e72b4d' }
                    }}
                  >
                    {comment.likes}
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<ThumbDownIcon sx={{ fontSize: '1rem' }} />}
                    sx={{ 
                      color: '#6b7280', 
                      minWidth: 'auto',
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      '&:hover': { color: '#ef4444' }
                    }}
                  >
                    {comment.dislikes || ''}
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<ReplyIcon sx={{ fontSize: '1rem' }} />}
                    sx={{ 
                      color: '#6b7280', 
                      minWidth: 'auto',
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': { color: '#111827' }
                    }}
                  >
                    Reply
                  </Button>
                </Box>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <Box sx={{ ml: 4, mt: 2 }}>
                    {comment.replies.map((reply) => (
                      <Box key={reply.id} sx={{ display: 'flex', gap: 2 }}>
                        <Avatar src={reply.avatar} sx={{ width: 32, height: 32 }} />
                        <Box sx={{ flex: 1 }}>
                          <Paper 
                            elevation={0}
                            sx={{ 
                              bgcolor: '#f3f4f6', 
                              p: 1.5, 
                              borderRadius: '8px',
                              borderTopLeftRadius: 0
                            }}
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#111827', fontSize: '0.875rem' }}>
                              {reply.author}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#374151', fontSize: '0.875rem', mt: 0.5 }}>
                              {reply.content}
                            </Typography>
                          </Paper>
                          <Box sx={{ display: 'flex', gap: 2, mt: 1, ml: 1 }}>
                            <Button 
                              size="small" 
                              startIcon={<ThumbUpIcon sx={{ fontSize: '0.875rem' }} />}
                              sx={{ 
                                color: '#6b7280', 
                                minWidth: 'auto',
                                fontSize: '0.75rem',
                                textTransform: 'none',
                                '&:hover': { color: '#e72b4d' }
                              }}
                            >
                              {reply.likes}
                            </Button>
                            <Button 
                              size="small" 
                              startIcon={<ReplyIcon sx={{ fontSize: '0.875rem' }} />}
                              sx={{ 
                                color: '#6b7280', 
                                minWidth: 'auto',
                                fontSize: '0.75rem',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { color: '#111827' }
                              }}
                            >
                              Reply
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
            {comment.id !== mockComments[mockComments.length - 1].id && (
              <Divider sx={{ my: 3 }} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Paper 
      elevation={0}
      sx={{ 
        borderRadius: '12px', 
        border: '1px solid #f3e7ea',
        bgcolor: 'white',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Tab Navigation */}
      <Box sx={{ borderBottom: '1px solid #e5e7eb' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            px: 3,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#6b7280',
              '&.Mui-selected': {
                color: '#e72b4d',
                fontWeight: 600
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#e72b4d'
            }
          }}
        >
          <Tab label="Details" />
          <Tab label="Comments" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 0 && renderDetailsTab()}
        {activeTab === 1 && renderCommentsTab()}
      </Box>
    </Paper>
  );
};

export default VocabularyDetailView;