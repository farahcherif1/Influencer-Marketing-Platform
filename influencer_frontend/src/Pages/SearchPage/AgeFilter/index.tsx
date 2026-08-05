import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';

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
  return `${value} yrs`;
}

type AgeFilterProps = {
  open: boolean;
  handleClose: () => void;
  value?: [number, number];
  onChange: (val: [number, number]) => void;
};

const AgeFilter: React.FC<AgeFilterProps> = ({
  open,
  handleClose,
  value: parentValue = [18, 60],
  onChange,
}) => {
  const theme = useTheme();
  const [value, setValue] = React.useState<[number, number]>(parentValue);

  React.useEffect(() => {
    if (open) setValue(parentValue);
  }, [open, parentValue]);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as [number, number]);
  };

  const handleSave = () => {
    onChange(value);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box sx={{ position: 'relative', textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Age
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 0,
              top: '-8px',
              color: 'text.secondary',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography>{value[0]} yrs</Typography>
          <Typography>{value[1]} yrs</Typography>
        </Box>

        <Slider
          value={value}
          onChange={handleSliderChange}
          valueLabelDisplay="off"
          min={18}
          max={100}
          getAriaValueText={valuetext}
          sx={{ mb: 4, color: 'black', '& .MuiSlider-thumb': { height: 24, width: 24 } }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleSave}
          sx={{
            py: 1.5,
            fontWeight: 'bold',
            bgcolor: 'black',
            '&:hover': { bgcolor: theme.palette.text.primary },
          }}
        >
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default AgeFilter;
