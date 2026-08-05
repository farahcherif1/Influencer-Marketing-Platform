// src/components/TermsSubsection.jsx
import { Typography, Box } from '@mui/material';
import type { TermsProps } from '../../Types/TermsProps';

const TermsSubsection = ({ title, children }: TermsProps) => (
  <Box mb={3} mt={2}>
    <Typography variant="h5" gutterBottom fontWeight="bold">
      {title}
    </Typography>
    {children}
  </Box>
);

export default TermsSubsection;
