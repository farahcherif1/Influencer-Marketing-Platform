import React, { useState, useEffect } from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Button,
  Paper,
  Popper,
  Divider,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { fetchServices } from '../../../services/creator.service';
import { useTheme } from '@mui/material';

interface ContentTypeFilterProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
  onChange: (val: string[]) => void; // callback to parent
}

const ContentTypeFilter: React.FC<ContentTypeFilterProps> = ({
  open,
  anchorEl,
  handleClose,
  selectedTypes,
  setSelectedTypes,
  onChange,
}) => {
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [tempTypes, setTempTypes] = useState<string[]>([]);
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      const services = await fetchServices();
      setContentTypes(services);
    })();
  }, []);

  useEffect(() => {
    if (open) {
      setTempTypes(selectedTypes);
    }
  }, [open, selectedTypes]);

  const handleApply = () => {
    setSelectedTypes(tempTypes);
    onChange(tempTypes); //  send data back to parent
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  const handleClear = () => {
    setTempTypes([]);
  };
  const handleToggle = (type: string) => {
    setTempTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      modifiers={[
        { name: 'offset', options: { offset: [0, 6] } },
        { name: 'preventOverflow', options: { padding: 8 } },
      ]}
      style={{ zIndex: 1300 }}
    >
      <Paper elevation={3} sx={{ p: 1, minWidth: 160, borderRadius: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            pl: 1,
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          {contentTypes.map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={tempTypes.includes(type)}
                  onChange={() => handleToggle(type)}
                  icon={
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        border: '1px solid #888',
                        borderRadius: 0.5,
                      }}
                    />
                  }
                  checkedIcon={
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        backgroundColor: '#000',
                        borderRadius: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckIcon sx={{ fontSize: 16, color: '#fff' }} />
                    </Box>
                  }
                />
              }
              label={type}
              sx={{
                '.MuiFormControlLabel-label': { fontSize: 15 },
                px: 0.5,
                py: 0.25,
              }}
            />
          ))}
        </Box>

        <Divider sx={{ my: 1, borderColor: 'grey' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            onClick={handleClear}
            sx={{
              color: '#666',
              fontSize: 12,
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Clear
          </Typography>

          <Box display="flex" gap={1}>
            <Button
              onClick={handleCancel}
              variant="outlined"
              size="small"
              sx={{
                backgroundColor: '#000',
                color: '#fff',
                fontSize: 12,
                textTransform: 'none',
                px: 2,
                py: 0.5,
                minWidth: 50,
                '&:hover': { backgroundColor: theme.palette.text.primary },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: '#000',
                color: '#fff',
                fontSize: 12,
                textTransform: 'none',
                px: 2,
                py: 0.5,
                minWidth: 50,
                '&:hover': { backgroundColor: theme.palette.text.primary },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Paper>
    </Popper>
  );
};

export default ContentTypeFilter;
