import { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, useTheme, LinearProgress, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { createCategories, updateBrandStep } from '../../services/completeProfileService';
import { fetchCategories } from '../../services/creator.service';
import type { Category } from '../../Types/Creator';
import type { mediumStepProps } from '../../Types/Creator';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

interface CategoriesStepProps extends mediumStepProps {
  initialCategories: number[];
  onCategoriesChange: (categories: number[]) => void;
}

export default function CategoriesStep({
  userId,
  onContinue,
  onBack,
  initialCategories,
  onCategoriesChange,
}: CategoriesStepProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const categoryGridRef = useRef<HTMLDivElement>(null);
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const theme = useTheme();
  const { t, i18n } = useTranslation('brandSteps');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    async function fetchCategoriesFromApi() {
      try {
        const response = await fetchCategories();
        setCategories(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
    fetchCategoriesFromApi();
  }, []);

  const handleContinue = async () => {
    if (initialCategories.length === 0) return;
    try {
      if (user.role === 'brand') {
        await updateBrandStep(userId, { categoryIds: initialCategories });
      } else if (user.role === 'creator') {
        await createCategories(userId, initialCategories);
      }
      onContinue();
    } catch (error) {
      console.error('Failed to update categories:', error);
    }
  };

  const handleCategoryClick = (id: number) => {
    const updated = initialCategories.includes(id)
      ? initialCategories.filter((c) => c !== id)
      : [...initialCategories, id].slice(0, 3);

    onCategoriesChange(updated);
  };

  useEffect(() => {
    const grid = categoryGridRef.current;
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
    if (categoryGridRef.current) {
      const grid = categoryGridRef.current;
      const scrollAmount = 100;
      grid.scrollBy({
        top: direction === 'up' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: 800 },
        px: { xs: '20px', sm: '40px' },
        direction: direction,
        mt: { xs: 15, sm: 15 },
      }}
    >
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <LinearProgress
          variant="determinate"
          value={50}
          sx={{
            height: { xs: 4, sm: 6 },
            borderRadius: 10,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
        />
      </Box>

      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <IconButton
          onClick={onBack}
          sx={{
            backgroundColor: theme.palette.action.hover,
            borderRadius: '50%',
            p: { xs: 0.75, sm: 1 },
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" sx={{ color: theme.palette.text.primary }} />
        </IconButton>
      </Box>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={2}
        sx={{
          fontSize: { xs: '1.2rem', sm: '2rem' },
        }}
      >
        {user.role === 'brand' ? t('categoriesStep.brandTitle') : t('categoriesStep.creatorTitle')}
      </Typography>

      <Box sx={{ position: 'relative', mb: { xs: 3, sm: 4 } }}>
        <Box
          ref={categoryGridRef}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: { xs: 1.5, sm: 2 },
            maxHeight: { xs: '300px', sm: '400px' },
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: { xs: '6px', sm: '8px' },
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
          {(categories ?? []).map((category) => (
            <Button
              key={category.id}
              variant={initialCategories.includes(category.id) ? 'contained' : 'outlined'}
              onClick={() => handleCategoryClick(category.id)}
              sx={{
                textTransform: 'none',
                justifyContent: 'flex-start',
                borderColor: theme.palette.text.secondary,
                color: initialCategories.includes(category.id)
                  ? 'white'
                  : theme.palette.text.primary,
                backgroundColor: initialCategories.includes(category.id)
                  ? theme.palette.text.primary
                  : 'transparent',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                py: { xs: 1, sm: 1.5 },
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: initialCategories.includes(category.id)
                    ? theme.palette.text.primary
                    : 'transparent',
                },
              }}
            >
              {t(`categoriesStep.categories.${category.name}`)}
            </Button>
          ))}
        </Box>

        {showScrollUp && (
          <IconButton
            onClick={() => handleScroll('up')}
            sx={{
              position: 'absolute',
              top: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: theme.palette.action.hover,
              borderRadius: '50%',
              p: { xs: 0.4, sm: 0.5 },
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <KeyboardArrowUpIcon
              sx={{
                color: theme.palette.text.primary,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            />
          </IconButton>
        )}

        {showScrollDown && (
          <IconButton
            onClick={() => handleScroll('down')}
            sx={{
              position: 'absolute',
              bottom: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: theme.palette.action.hover,
              borderRadius: '50%',
              p: { xs: 0.4, sm: 0.5 },
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <KeyboardArrowDownIcon
              sx={{
                color: theme.palette.text.primary,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            />
          </IconButton>
        )}
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={handleContinue}
        sx={{
          py: { xs: '10px', sm: '12px' },
          backgroundColor: theme.palette.text.primary,
          color: 'white',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: { xs: '0.938rem', sm: '1rem' },
          borderRadius: { xs: '10px', sm: '12px' },
          boxShadow: 'none',
        }}
      >
        {t('common.continue')}
      </Button>
    </Box>
  );
}
