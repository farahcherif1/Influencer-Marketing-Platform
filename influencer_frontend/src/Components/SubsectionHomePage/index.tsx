import { Box, Typography } from '@mui/material';
interface subsectionProps {
  title: string;
  description: string;
}
export default function SubsectionHomePage({ title, description }: subsectionProps) {
  return (
    <Box sx={{ width: '90%' }}>
      <Typography variant="h6" sx={{ mt: 4 }} fontWeight={550}>
        {title}
      </Typography>
      <Box sx={{ my: 1, color: 'gray' }}>{description}</Box>
    </Box>
  );
}
