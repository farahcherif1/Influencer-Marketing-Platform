import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  height: 300,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

function valuetext(value: number) {
  return `${value}`;
}

type FollowersFilterProps = {
  open: boolean;
  handleClose: () => void;
  value?: [number, number];
  onChange: (val: [number, number]) => void;
};

const FollowersFilter: React.FC<FollowersFilterProps> = ({
  open,
  handleClose,
  value: initialValue = [1, 1000000],
  onChange,
}) => {
  const [value, setValue] = React.useState<[number, number]>(initialValue);

  // Sync internal state with parent whenever modal opens

  React.useEffect(() => {
    if (open) {
      setValue(initialValue);
    }
  }, [open, initialValue]);
  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as [number, number]);
  };

  const handleSave = () => {
    onChange(value); //  send chosen value back to parent
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* Header */}
        <Box sx={{ position: 'relative', textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Followers
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

        {/* Min/Max Labels */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            Min Followers
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            Max Followers
          </Typography>
        </Box>

        {/* Values */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
            {value[0]}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
            {value[1]}+
          </Typography>
        </Box>

        {/* Slider */}
        <Slider
          getAriaLabel={() => 'Followers range'}
          value={value}
          onChange={handleSliderChange}
          valueLabelDisplay="off"
          getAriaValueText={valuetext}
          min={1000}
          max={1000000}
          sx={{
            mb: 4,
            color: 'black',
            '& .MuiSlider-thumb': { height: 24, width: 24 },
          }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSave}
          sx={{ py: 1.5, fontWeight: 'bold', bgcolor: 'black', color: 'white' }}
        >
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default FollowersFilter;
