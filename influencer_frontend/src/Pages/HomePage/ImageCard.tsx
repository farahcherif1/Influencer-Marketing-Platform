import { Card, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
interface imageCardProps {
  imageSrc: string;
  link: string;
}
export default function ImageCard({ imageSrc, link }: imageCardProps) {
  return (
    <Card
      sx={{
        width: { md: 250, xs: 200, sm: 200 },
        height: 350,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CardMedia
        component="img"
        sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
        image={imageSrc}
        alt="Image"
      />

      <Link to={link} style={{ textDecoration: 'none' }}></Link>
    </Card>
  );
}
