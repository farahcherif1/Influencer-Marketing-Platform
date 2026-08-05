import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ReferralBanner = () => {
  const navigate = useNavigate();

  return (
    <Button
      fullWidth
      variant="contained"
      onClick={() => {
        navigate('/signup?role=brand');
      }}
      sx={{
        backgroundColor: '#2d2d2d',
        color: 'white',
        fontWeight: 600,
        letterSpacing: '0.5px',
        borderRadius: 0,
        position: 'fixed',
        top: '85px',
        zIndex: 1000,
        boxShadow: 'none',
        marginTop: 0,
        margin: '0 ',
        '&:hover': {
          backgroundColor: '#1f1f1f',
          boxShadow: 'none',
        },
      }}
    >
      GET $10 OFF YOUR FIRST ORDER - CLAIM NOW
    </Button>
  );
};

export default ReferralBanner;
