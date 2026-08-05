import { Button } from '@mui/material';

import theme from '../../theme';
interface buttonProps {
  title: string;
}
export default function CategoryNavigation({ title }: buttonProps) {
  return (
    <>
      <Button
        variant="outlined"
        sx={{
          color: theme.palette.text.primary,

          border: 'none',
          bgcolor: 'white',
          boxShadow: '0px 2px 10px 0px rgba(120, 120, 170, 0.3)',
          borderRadius: '16px',
          height: '70%',
          width: 'auto',
          padding: '12px',
          fontSize: theme.typography.h6,
          fontWeight: 550,
          '& .MuiButton-startIcon': {
            marginLeft: '4px',
            marginRight: '1px',
          },
        }}
      >
        {title}
      </Button>
    </>
  );
}
