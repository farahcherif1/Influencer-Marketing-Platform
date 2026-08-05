import { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, useTheme, LinearProgress } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { categories } from '../../enums/Creator-enums';
import { createContentTypes } from '../../services/completeProfileService';

interface ContentStepProps {
  creatorId: number;
  onContinue: () => void;
  onBack: () => void;
}

export default function ContentStep({ onContinue, onBack, creatorId }: ContentStepProps) {
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const contentGridRef = useRef<HTMLDivElement>(null);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (selectedContent.length < 1) return alert('Please select at least one content type');
    try {
      setLoading(true);
      await createContentTypes(creatorId, selectedContent);
      onContinue();
    } catch (error) {
      console.error('Failed to create content types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentClick = (value: string) => {
    setSelectedContent((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value].slice(0, 3),
    );
  };

  useEffect(() => {
    const grid = contentGridRef.current;
    if (grid) {
      const checkScroll = () => {
        setShowScrollUp(grid.scrollTop > 0);
        setShowScrollDown(grid.scrollTop < grid.scrollHeight - grid.clientHeight - 1);
      };
      checkScroll();
      grid.addEventListener('scroll', checkScroll);
      return () => grid.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const handleScroll = (direction: 'up' | 'down') => {
    if (contentGridRef.current) {
      const grid = contentGridRef.current;
      const scrollAmount = 100;
      grid.scrollBy({
        top: direction === 'up' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, px: '40px' }}>
      <Box sx={{ mb: 3 }}>
        <LinearProgress
          variant="determinate"
          value={60}
          sx={{
            height: 6,
            borderRadius: 10,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
        />
      </Box>
      <Box sx={{ mb: 3 }}>
        <IconButton
          onClick={onBack}
          sx={{
            backgroundColor: theme.palette.action.hover,
            borderRadius: '50%',
            p: 1,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" sx={{ color: theme.palette.text.primary }} />
        </IconButton>
      </Box>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        What kind of content do you post?
      </Typography>
      <Box sx={{ position: 'relative', mb: 4 }}>
        <Box
          ref={contentGridRef}
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
            maxHeight: '400px',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: theme.palette.background.default,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
            },
          }}
        >
          {categories.map(({ label, value }) => (
            <Button
              key={value}
              variant={selectedContent.includes(value) ? 'contained' : 'outlined'}
              onClick={() => handleContentClick(value)}
              sx={{
                textTransform: 'none',
                justifyContent: 'flex-start',
                borderColor: theme.palette.text.secondary,
                color: selectedContent.includes(value) ? 'white' : theme.palette.text.primary,
                backgroundColor: selectedContent.includes(value)
                  ? theme.palette.text.primary
                  : 'transparent',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: selectedContent.includes(value)
                    ? theme.palette.text.primary
                    : 'transparent',
                },
              }}
            >
              {label}
            </Button>
          ))}
        </Box>
        {showScrollUp && (
          <IconButton
            onClick={() => handleScroll('up')}
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: theme.palette.action.hover,
              borderRadius: '50%',
              p: 0.5,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <KeyboardArrowUpIcon sx={{ color: theme.palette.text.primary }} />
          </IconButton>
        )}
        {showScrollDown && (
          <IconButton
            onClick={() => handleScroll('down')}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: theme.palette.action.hover,
              borderRadius: '50%',
              p: 0.5,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <KeyboardArrowDownIcon sx={{ color: theme.palette.text.primary }} />
          </IconButton>
        )}
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={handleContinue}
        sx={{
          py: '12px',
          backgroundColor: theme.palette.text.primary,
          color: 'white',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          borderRadius: '12px',
          boxShadow: 'none',
        }}
      >
        {loading ? 'Saving…' : 'Continue'}
        Continue
      </Button>
    </Box>
  );
}
