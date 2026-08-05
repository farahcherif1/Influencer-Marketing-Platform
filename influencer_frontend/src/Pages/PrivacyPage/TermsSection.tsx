// src/components/TermsSection.jsx
import { Typography, Box } from '@mui/material';
import type { TermsProps } from '../../Types/TermsProps';

const TermsSection = ({ title, children }: TermsProps) => (
  <Box mb={4}>
    <Typography variant="h4" gutterBottom fontWeight="bold">
      {title}
    </Typography>
    {children}
  </Box>
);

export default TermsSection;
