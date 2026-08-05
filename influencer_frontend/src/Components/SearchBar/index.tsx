import { useState, useRef, useEffect } from 'react';
import { Box, TextField, MenuItem, IconButton, Popover, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import { getPLatforms } from '../../services/creator.service';
import { fetchCategories } from '../../services/creator.service';
import { useNavigate } from 'react-router-dom';
import type { Category, SearchBarProps } from '../../Types/Creator';
import { useTheme, useMediaQuery, Divider } from '@mui/material';

export default function SearchBar({
  initialPlatform = 'All',
  onSearch,
}: SearchBarProps & { onSearch?: () => void }) {
  const { t } = useTranslation('searchBar');
  const [platformOptions, setPlatformOptions] = useState<string[]>([]);
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const services = await getPLatforms();
      setPlatformOptions(['All', ...services]);

      const categories = await fetchCategories();
      setCategorySuggestions(['All', ...categories.map((c: { name: string }) => c.name)]);
    };

    fetchData();
  }, []);

  const [platform, setPlatform] = useState<string>(initialPlatform || 'all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const categoryRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const handleCategoryFocus = () => {
    if (categoryRef.current) {
      setAnchorEl((prev) => (prev ? null : categoryRef.current));
    }
  };

  const handleCategoryClick = (suggestion: string) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.name === suggestion);
      if (exists) {
        return prev.filter((c) => c.name !== suggestion);
      } else {
        return [...prev, { name: suggestion } as Category];
      }
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'category-popover' : undefined;

  const handleSearch = () => {
    const chosenPlatform = platform === 'All' ? 'all' : platform;
    const chosenCategories =
      categories.length === 0
        ? 'all' // send enum key
        : categories.map((c) => c.name).join(','); // send raw keys

    navigate(`/search?p=${chosenPlatform}&c=${chosenCategories}`);
    if (onSearch) onSearch();
  };
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        backgroundColor: '#fff',
        borderRadius: { xs: '30px', sm: '300px' },
        boxShadow: '0 1px 8px rgba(0, 0, 0, 0.05)',
        py: 1,
        px: 3,
        width: '100%',
        maxWidth: { xs: '100%', sm: '900px', md: '1200px' },
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: { xs: 2, sm: 0 },
        margin: { xs: 3, sm: 1 },
        marginBottom: { xs: 2, sm: 1 },
      }}
    >
      {/* Platform Select */}
      <TextField
        select
        label={t('searchBar.platform')}
        value={platformOptions.includes(platform) ? platform : ''}
        onChange={(e) => {
          setPlatform(e.target.value);
          handleClose();
        }}
        variant="standard"
        fullWidth
        InputProps={{
          disableUnderline: true,
          sx: {
            color: 'grey',
          },
        }}
        InputLabelProps={{
          shrink: true,
          sx: {
            fontWeight: 'bold',
            color: 'black',
            '&.Mui-focused': { color: 'black' },
          },
        }}
        sx={{
          minWidth: 140,
          '& .MuiSelect-select': {
            textAlign: 'left',
          },
        }}
      >
        {platformOptions.map((option) => (
          <MenuItem key={option} value={option} sx={{ justifyContent: 'flex-start' }}>
            {t(`platformOptions.${option}`)}
          </MenuItem>
        ))}
      </TextField>

      {/* Divider */}
      <Divider
        orientation={isSmall ? 'horizontal' : 'vertical'}
        flexItem
        sx={{
          mx: { xs: 0, sm: 2 },
          my: { xs: 2, sm: 0 },
          height: { xs: '1px', sm: 40 },
          width: { xs: '100%', sm: '1px' },
          borderColor: '#ccc',
        }}
      />

      {/* Category Input */}
      <TextField
        label={t('searchBar.category')}
        placeholder={t('searchBar.placeholder')}
        variant="standard"
        value="" // input box stays empty (we only use chips)
        onFocus={handleCategoryFocus}
        inputRef={categoryRef}
        fullWidth
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <>
              {categories.map((cat) => (
                <Chip
                  key={cat.name}
                  label={t(`categorySuggestions.${cat.name}`)}
                  onDelete={() => setCategories((prev) => prev.filter((c) => c !== cat))}
                  sx={{
                    m: 0.5,
                    bgcolor: '#F1F1F1',
                  }}
                />
              ))}
            </>
          ),
          sx: { color: 'grey' },
        }}
        InputLabelProps={{
          shrink: true,
          sx: {
            fontWeight: 'bold',
            color: 'black',
            '&.Mui-focused': { color: 'black' },
          },
        }}
      />

      {/* Search Button */}
      <IconButton
        sx={{
          backgroundColor: '#1C1C1C',
          color: '#fff',
          width: { xs: '100%', sm: 50 },
          height: { xs: 50, sm: 50 },
          borderRadius: { xs: 3, sm: '60%' },
          ml: { xs: 0, sm: 0 },
          mt: { xs: 1, sm: 0 },
          cursor: 'pointer',
          alignSelf: { xs: 'center', sm: 'auto' },
          '&:hover': { backgroundColor: '#000' },
        }}
        onClick={handleSearch} // calls navigate + fetch
      >
        <SearchIcon />
      </IconButton>

      {/* Popover Suggestions */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableAutoFocus
        disableEnforceFocus
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            maxWidth: 600,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mt: 1,
          },
        }}
      >
        {categorySuggestions.map((item) => (
          <Chip
            key={item}
            label={t(`categorySuggestions.${item}`)}
            onClick={() => handleCategoryClick(item)}
            sx={{
              bgcolor: '#F1F1F1',
              '&:hover': { bgcolor: '#e0e0e0', cursor: 'pointer' },
            }}
          />
        ))}
      </Popover>
    </Box>
  );
}
