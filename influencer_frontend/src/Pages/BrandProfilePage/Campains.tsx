import { Box, Card, CardContent, Typography } from '@mui/material';

const styles = {
  container: {
    mt: 5,
  },
  title: {
    mb: 2,
  },
  card: {
    width: { sm: '100%', md: 400 },
    mt: 2,
    backgroundImage: `linear-gradient(
      45deg,
      #3a3a3a 0%,
      #6e6e6e 40%,
      #c0c0c0 100%
    )`,
  },
  imageBox: {
    height: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  descriptionText: {
    color: 'white',
  },
};

export default function Campains() {
  return (
    <Box sx={styles.container}>
      <Typography variant="h4" sx={styles.title}>
        Campaigns
      </Typography>
      <Card sx={styles.card}>
        <CardContent>
          <Box sx={styles.imageBox}></Box>
          <Typography variant="subtitle2" sx={styles.statusText}>
            In-progress
          </Typography>
          <Typography variant="body2" sx={styles.descriptionText}>
            Instagram Campaign
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
