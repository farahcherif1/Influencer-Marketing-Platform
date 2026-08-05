import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
  overflowY: 'auto',
};

const languages = ['English', 'French', 'Spanish', 'German', 'Chinese', 'Japanese', 'Other'];

type LanguageFilterProps = {
  open: boolean;
  handleClose: () => void;
  value?: string[];
  onChange: (val: string[]) => void;
};

const LanguageFilter: React.FC<LanguageFilterProps> = ({
  open,
  handleClose,
  value: parentValue = [],
  onChange,
}) => {
  const [selected, setSelected] = React.useState<string[]>(parentValue);
  const theme = useTheme();

  React.useEffect(() => {
    if (open) setSelected(parentValue);
  }, [open, parentValue]);

  const handleToggle = (lang: string) => {
    setSelected((prev) => (prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]));
  };

  const handleSave = () => {
    onChange(selected);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box sx={{ position: 'relative', textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Language
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

        {languages.map((lang) => (
          <FormControlLabel
            key={lang}
            control={
              <Checkbox checked={selected.includes(lang)} onChange={() => handleToggle(lang)} />
            }
            label={lang}
          />
        ))}

        <Button
          variant="contained"
          fullWidth
          onClick={handleSave}
          sx={{
            mt: 3,
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

export default LanguageFilter;
