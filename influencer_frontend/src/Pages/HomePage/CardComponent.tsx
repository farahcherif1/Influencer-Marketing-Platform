import { Card, CardContent, Typography } from '@mui/material';
import theme from '../../theme';

type CardProps = {
  link: string;
  title: string;
  description: string;
};

export default function CardComponent({ link, title, description }: CardProps) {
  const styles = {
    card: {
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      borderLeft: `1px solid ${theme.palette.secondary.main}`,
      flexDirection: 'column',
      mb: 3,
    },
    icon: {
      width: '25px',
      marginTop: '20px',
      marginLeft: '15px',
      marginRight: '15px',
    },

    description: {
      fontSize: '0.875rem',
      color: theme.palette.text.secondary,
      mx: 2,
      mb: 2,
      flex: 1,
    },
  };

  return (
    <Card sx={styles.card}>
      <img src={link} style={styles.icon} />{' '}
      <CardContent>
        <Typography variant="h4">{title}</Typography>
      </CardContent>
      <Typography sx={styles.description}>{description}</Typography>
    </Card>
  );
}
