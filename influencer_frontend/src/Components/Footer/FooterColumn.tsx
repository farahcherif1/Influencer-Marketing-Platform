import { Box, List, ListItem, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import type { FooterColumnData } from '.';
import i18n from '../../i18n';

interface FooterColumnProps {
  columnData: FooterColumnData;
}

// Styles regroupés

export default function FooterColumn({ columnData }: FooterColumnProps) {
  const theme = useTheme();
  const isRTL = i18n.language === 'ar';
  const styles = {
    container: {
      transition: 'transform 0.3s ease',
    },
    title: {
      fontWeight: 'bold',
      color: 'text.primary',
      pb: 2,
      mb: 2,
      position: 'relative',
      textAlign: isRTL ? 'right' : 'left',
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    listItem: {
      py: 0.5,
      position: 'relative',
      justifyContent: isRTL ? 'flex-end' : 'flex-start',

      '&:before': {
        color: theme.palette.primary.main,
      },
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.text.primary,

      width: '100%',
      textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left',
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" sx={styles.title}>
        {columnData.title}
      </Typography>

      <List disablePadding dense sx={styles.list}>
        {columnData.items.map((item, index) => (
          <ListItem key={index} disableGutters sx={styles.listItem}>
            <Link to={item.link} style={styles.link}>
              {item.text}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
