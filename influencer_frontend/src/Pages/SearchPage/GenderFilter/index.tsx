import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

export type Gender = 'Male' | 'Female' | 'Other' | '';

interface GenderFilterProps {
  open: boolean;
  handleClose: () => void;
  onChange: (gender: Gender) => void; // send gender to parent
  value?: Gender; // controlled value from parent
}

const GenderFilter: React.FC<GenderFilterProps> = ({ open, handleClose, onChange, value }) => {
  const [gender, setGender] = React.useState<Gender>(value || '');

  // Sync internal state with parent when modal opens
  React.useEffect(() => {
    if (open) {
      setGender(value || '');
    }
  }, [open, value]);

  const handleChange = (event: SelectChangeEvent<Gender>) => {
    setGender(event.target.value as Gender);
  };

  const handleSave = () => {
    onChange(gender); // send value back to parent only when Save is clicked
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* Header */}
        <Box sx={{ position: 'relative', textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Gender
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 0,
              top: '-8px',
              color: 'text.secondary',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Gender Selector */}
        <Box sx={{ minWidth: 120, mb: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="gender-select-label">Gender</InputLabel>
            <Select
              labelId="gender-select-label"
              id="gender-select"
              value={gender}
              label="Gender"
              onChange={handleChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
              <MenuItem value="">Prefer not to say</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSave}
          sx={{
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

export default GenderFilter;
