import { CardActionArea, CardMedia, Typography, Box } from '@mui/material';

interface CategoryProps {
  title: string;
  image: string;
  width: number;
  height: number;
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  username?: string;
}

export default function CategoryCard({ title, image, width, height, variant }: CategoryProps) {
  return (
    <CardActionArea sx={{ display: 'block', cursor: 'pointer', width, height }}>
      <Box position="relative" width={width} height={height}>
        {image && (
          <CardMedia
            component="img"
            image={image}
            alt={title}
            sx={{
              objectFit: 'cover',
              borderRadius: 2,
              width: '100%',
              height: '100%',
              filter: 'brightness(70%)',
            }}
          />
        )}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          color="white"
          p={1}
          sx={{ width: '100%', pointerEvents: 'none' }}
        >
          <Typography variant={variant} component="div" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      </Box>
    </CardActionArea>
  );
}
