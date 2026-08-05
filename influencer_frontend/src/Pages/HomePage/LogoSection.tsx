import { Box, Grid } from '@mui/material';
interface LogoSectionProps {
  name: string;
  imageUrl: string;
}
export default function LogoSection({ name, imageUrl }: LogoSectionProps) {
  return (
    <>
      <Grid size={{ md: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            height: 100,
            width: 220,
            filter: 'grayscale(100%)',
            opacity: 0.8,
            transition: 'all 0.3s ease',
            '&:hover': {
              filter: 'none',
              opacity: 1,
            },
            mx: { md: 10, xs: 1, sm: 1 },
          }}
        >
          <img
            src={imageUrl}
            alt={name}
            style={{ maxHeight: '100%', maxWidth: '100%', width: 180, height: 80 }}
          />
        </Box>
      </Grid>
    </>
  );
}
