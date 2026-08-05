import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import React, { useState } from 'react';
import theme from '../../theme';

interface FQAProps {
  question: string;
  answer: React.ReactNode;
}

export default function FAQCard({ question, answer }: FQAProps) {
  const [expanded, setExpanded] = useState(false);

  const handleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion
      onClick={handleExpanded}
      sx={{
        my: 0,
        '&.Mui-expanded': {
          margin: '0 0 !important',
        },
      }}
    >
      <AccordionSummary
        sx={{
          '&:focus, &:focus-visible': {
            outline: 'none',
          },
          '&:hover': {
            borderColor: 'transparent',
          },
          '&:active': {
            outline: 'none',
            boxShadow: 'none',
          },
        }}
        expandIcon={
          expanded ? (
            <CloseIcon
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '1.25rem', // small icon size equivalent
              }}
            />
          ) : (
            <AddIcon
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '1.25rem', // small icon size equivalent
              }}
            />
          )
        }
      >
        <Typography variant="h5">{question}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ color: theme.palette.text.secondary }}>{answer}</AccordionDetails>
    </Accordion>
  );
}
