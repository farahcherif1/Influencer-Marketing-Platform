import { useState, useEffect, useCallback } from 'react';
import {
  Stack,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Autocomplete,
  CircularProgress,
  Alert,
  Chip,
  useTheme,
} from '@mui/material';
import { fetchLocationSuggestions } from '../../../services/locationService';
import type { Category, CreatorDetails } from '../../../Types/Creator';
import { fetchCreatorProfile, updateCreatorProfile } from '../../../services/creator.service';
import { fetchBrandProfile, updateBrandProfile } from '../../../services/brandService';
import { fetchCategories } from '../../../services/creator.service';
import type { detailsTab } from '../../../entities/Brand';

type Role = 'creator' | 'brand';
interface DetailsTabProps {
  role: Role;
}
type FormData = CreatorDetails | detailsTab;

export function DetailsTab({ role }: DetailsTabProps) {
  const isCreator = role === 'creator';
  const theme = useTheme();
  const defaultCreatorDetails: CreatorDetails = {
    name: '',
    location: '',
    title: '',
    description: '',
    gender: '',
  };
  const defaultBrandDetails = {
    location: '',
    description: '',
    categories: [] as number[],
  };

  const [formData, setFormData] = useState<FormData>(
    isCreator ? defaultCreatorDetails : defaultBrandDetails,
  );
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [locationOptions, setLocationOptions] = useState<string[]>([]);
  const [locationQuery, setLocationQuery] = useState('');
  const [categoriesOptions, setCategoriesOptions] = useState<Category[]>([]);

  // Fetch categories if brand
  useEffect(() => {
    if (!isCreator) {
      const fetchCats = async () => {
        const cats = await fetchCategories();
        setCategoriesOptions(cats);
      };
      fetchCats();
    }
  }, [isCreator]);

  // Fetch location suggestions
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const suggestions = await fetchLocationSuggestions(locationQuery);

      setLocationOptions(suggestions);
    }, 300);
    return () => clearTimeout(timeout);
  }, [locationQuery]);

  // Fetch creator profile - plus besoin de token côté client
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let data;
        if (isCreator) {
          data = await fetchCreatorProfile();
          if (!data) return;
          setFormData({
            name: data.name,
            location: data.location || '',
            title: data.title,
            description: data.description,
            gender: data.gender,
          });
        } else {
          data = await fetchBrandProfile();
          if (!data) return;
          setFormData({
            location: data.location || '',
            description: data.description || '',
            categories: (data.categories || []).map((c: Category) => c.id),
          });
        }
      } catch {
        setError('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [isCreator]);
  const handleChange = useCallback((key: string, value: string | string[] | number[] | null) => {
    setFormData((prev: typeof formData) => ({ ...prev, [key]: value ?? '' }));
  }, []);

  const saveInfo = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      if (isCreator) {
        await updateCreatorProfile(formData as CreatorDetails);
      } else {
        const brandData = formData as detailsTab;
        const payload = {
          location: brandData.location,
          description: brandData.description,
          categoryIds: brandData.categories, // only IDs
        };

        //delete (payload as any).categories;
        await updateBrandProfile(payload);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
        <Typography variant="h6" ml={2}>
          Loading profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 800 }}>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {saveSuccess && (
        <Alert severity="success" onClose={() => setSaveSuccess(false)}>
          Profile updated successfully!
        </Alert>
      )}
      {/* CREATOR FIELDS */}
      {isCreator && (
        <>
          <Box>
            <Typography fontWeight={600} mb={1}>
              Display Name
            </Typography>
            <TextField
              fullWidth
              value={isCreator ? (formData as CreatorDetails).name : ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter your display name"
            />
          </Box>

          <Box>
            <Typography fontWeight={600} mb={1}>
              Title
            </Typography>
            <TextField
              fullWidth
              value={isCreator ? (formData as CreatorDetails).title : ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter your title"
            />
          </Box>

          <Box>
            <Typography fontWeight={600} mb={1}>
              Gender
            </Typography>
            <TextField
              select
              fullWidth
              value={isCreator ? (formData as CreatorDetails).gender : ''}
              onChange={(e) => handleChange('gender', e.target.value)}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Box>
        </>
      )}
      {/* COMMON LOCATION */}
      <Box>
        <Typography fontWeight={600} mb={1}>
          Location
        </Typography>
        <Autocomplete
          freeSolo
          options={locationOptions}
          value={formData.location}
          onInputChange={(_, value) => {
            setLocationQuery(value);
            handleChange('location', value);
          }}
          onChange={(_, newValue) => handleChange('location', newValue || '')}
          renderInput={(params) => (
            <TextField {...params} placeholder="Enter location" variant="outlined" />
          )}
        />
      </Box>

      {/* COMMON DESCRIPTION */}
      <Box>
        <Typography fontWeight={600} mb={1}>
          Description
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter description"
          multiline
          rows={5}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </Box>

      {/* BRAND CATEGORIES */}
      {!isCreator && (
        <Box>
          <Typography fontWeight={600} mb={1}>
            Categories
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {categoriesOptions.map((category) => {
              // Type guard to ensure categories exists
              const categories = (formData as detailsTab).categories;
              const isSelected = Array.isArray(categories) && categories.includes(category.id);
              return (
                <Chip
                  key={category.id}
                  label={category.label}
                  clickable
                  onClick={() => {
                    let newCategories;
                    if (isSelected) {
                      newCategories = categories.filter((id: number) => id !== category.id);
                    } else {
                      newCategories = [...categories, category.id];
                    }
                    handleChange('categories', newCategories);
                  }}
                  sx={{
                    borderRadius: '10px',
                    backgroundColor: isSelected ? '#1f1d1d' : 'transparent',
                    color: isSelected ? 'white' : 'black',
                    border: '1px solid #ddd',

                    fontWeight: isSelected ? 600 : 400,
                    '&:hover': {
                      backgroundColor: isSelected ? theme.palette.text.primary : '#1f1d1d',
                      color: 'white',
                    },
                  }}
                />
              );
            })}
          </Box>
        </Box>
      )}

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          onClick={saveInfo}
          disabled={saving}
          sx={{ backgroundColor: 'black', color: 'white' }}
        >
          {saving ? <CircularProgress size={24} color="inherit" /> : 'Save'}
        </Button>
      </Box>
    </Stack>
  );
}
