import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LanguageIcon from '@mui/icons-material/Language';
import InputAdornment from '@mui/material/InputAdornment';
import PlaceIcon from '@mui/icons-material/Place';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  maxHeight: 1000,
  bgcolor: 'background.paper',
  border: '1px solid #ccc',
  boxShadow: 24,
  p: 3,
  borderRadius: '4px',
  overflowY: 'auto',
};

const countries = [
  { code: 'US', label: 'United States' },
  { code: 'FR', label: 'France' },
  { code: 'DE', label: 'Germany' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'JP', label: 'Japan' },
  { code: 'CA', label: 'Canada' },
  { code: 'AU', label: 'Australia' },
];

interface LocationFilterProps {
  open: boolean;
  handleClose: () => void;
  onChange: (data: { country: string; city: string }) => void; // single country & city
  value: { country: string; city: string }; // current selection from parent
}

const LocationFilter: React.FC<LocationFilterProps> = ({ open, handleClose, onChange, value }) => {
  const [selectedCountry, setSelectedCountry] = React.useState<string>(value.country || '');
  const [cityInput, setCityInput] = React.useState<string>(value.city || '');
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);

  // Sync internal state with parent whenever modal opens
  React.useEffect(() => {
    if (open) {
      setSelectedCountry(value.country || '');
      setCityInput(value.city || '');
    }
  }, [open, value]);

  const handleClearCountry = () => setSelectedCountry('');
  const handleClearCity = () => setCityInput('');
  const toggleFilter = (filterName: string) =>
    setActiveFilter(activeFilter === filterName ? null : filterName);

  const handleSave = () => {
    onChange({ country: selectedCountry, city: cityInput });
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}
        >
          Location
        </Typography>

        {/* Country */}
        <Box
          onClick={() => toggleFilter('country')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': { backgroundColor: '#f5f5f5' },
          }}
        >
          <Typography sx={{ flexGrow: 1 }}>Filter by Country</Typography>
          <LanguageIcon sx={{ mr: 35 }} />
          <Typography>{activeFilter === 'country' ? '▲' : '▼'}</Typography>
        </Box>
        {activeFilter === 'country' && (
          <>
            <Autocomplete
              options={countries}
              getOptionLabel={(option) => option.label}
              value={countries.find((c) => c.code === selectedCountry) || null}
              onChange={(_event, newValue) => setSelectedCountry(newValue?.code || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Select country"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <LanguageIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: '100%', mt: 2 }}
                />
              )}
            />
            <Button variant="outlined" onClick={handleClearCountry} sx={{ mt: 1 }}>
              Clear
            </Button>
          </>
        )}

        {/* City */}
        <Box
          onClick={() => toggleFilter('city')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 3,
            cursor: 'pointer',
            '&:hover': { backgroundColor: '#f5f5f5' },
          }}
        >
          <Typography sx={{ flexGrow: 1 }}>Filter by City</Typography>
          <PlaceIcon sx={{ mr: 35 }} />
          <Typography>{activeFilter === 'city' ? '▲' : '▼'}</Typography>
        </Box>
        {activeFilter === 'city' && (
          <>
            <TextField
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              variant="outlined"
              placeholder="Enter city"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: '100%', mt: 2 }}
            />
            <Button variant="outlined" onClick={handleClearCity} sx={{ mt: 2 }}>
              Clear
            </Button>
          </>
        )}

        {/* Save Button */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleSave}
          sx={{
            mt: 3,
            py: 1.5,
            fontWeight: 'bold',
            bgcolor: 'black',
            color: 'white',
          }}
        >
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default LocationFilter;
