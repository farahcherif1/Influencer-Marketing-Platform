import { Box, Button, Typography } from '@mui/material';

const styles = {
  container: {
    backgroundColor: '#1c1c1c',
    p: 3,
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mt: 6,
    mx: { sx: 0, md: 4 },
  },
  title: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'white',
    color: 'black',
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
  },
};

export default function CompletionBanner() {
  return (
    <Box sx={styles.container}>
      <Box>
        <Typography variant="h5" sx={styles.title}>
          Complete Your Profile
        </Typography>
        <Typography variant="body2">
          Your profile is the first thing creators view to learn about your brand. Having a
          complete, detailed profile helps creators decide if you're a fit to collaborate with.
        </Typography>
      </Box>
      <Button variant="contained" color="inherit" sx={styles.button}>
        Complete Profile
      </Button>
    </Box>
  );
}
