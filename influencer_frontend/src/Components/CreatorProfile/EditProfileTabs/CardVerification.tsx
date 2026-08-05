import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useState, useEffect } from 'react';
import axios from 'axios';

export function CardVerification() {
  const [open, setOpen] = useState(false);

  const [cardData, setCardData] = useState({
    brand: '',
    last4: '',
    expMonth: '',
    expYear: '',
  });

  const [formData, setFormData] = useState({
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  });

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/creators/card', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCardData(res.data);
      } catch (err) {
        console.error('Error loading card:', err);
      }
    };
    fetchCard();
  }, []);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/creators/card', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpen(false);
      window.location.reload();
    } catch {
      alert('Failed to update card.');
    }
  };

  return (
    <Box>
      <Typography fontWeight={600}>
        Card Verification{' '}
        <Button
          variant="text"
          onClick={() => setOpen(true)}
          disableRipple
          disableFocusRipple
          sx={{
            backgroundColor: 'transparent',
            color: 'blue',
            borderRadius: 2,
            py: 1,
            px: 1,
            margin: 2,
            boxShadow: 'none',
            outline: 'none',
            border: 'none',
            '&:hover': {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              textDecoration: 'underline',
            },
            '&:focus': {
              outline: 'none',
              border: 'none',
            },
          }}
        >
          Change
        </Button>
      </Typography>

      <Box display="flex" alignItems="center" mt={1}>
        <CreditCardIcon sx={{ mr: 1, color: 'gray' }} />
        <Typography>
          {cardData.brand || 'Card'} **** **** **** {cardData.last4} {cardData.expMonth}/
          {cardData.expYear}
        </Typography>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Update Card</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Card Number"
              fullWidth
              variant="outlined"
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            />
            <TextField
              label="Expiration Month"
              fullWidth
              variant="outlined"
              onChange={(e) => setFormData({ ...formData, expMonth: e.target.value })}
            />
            <TextField
              label="Expiration Year"
              fullWidth
              variant="outlined"
              onChange={(e) => setFormData({ ...formData, expYear: e.target.value })}
            />
            <TextField
              label="CVC"
              fullWidth
              variant="outlined"
              onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              color: 'black',
            }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            sx={{
              backgroundColor: 'black',
              color: 'white',
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
