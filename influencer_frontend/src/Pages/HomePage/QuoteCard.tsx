import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
interface QuoteCardProps {
  title: string;
  description: string;
  author: string;
}
import { Box, Typography } from '@mui/material';

export default function QuoteCard({ title, description, author }: QuoteCardProps) {
  const styles = {
    BoxStyle: {
      width: '90%',
      height: '100%',
    },
  };
  return (
    <Box sx={styles.BoxStyle}>
      <FormatQuoteIcon
        sx={{
          fontSize: 50,
          color: 'secondary.main',
          mb: 2,
          transform: 'scaleX(1) rotate(-180deg)',
        }}
      />
      <Typography variant="h5" fontWeight={550} sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ mb: 2 }}>{description}</Box>
      <Typography variant="h6" fontWeight={550}>
        {author}
      </Typography>
    </Box>
  );
}
