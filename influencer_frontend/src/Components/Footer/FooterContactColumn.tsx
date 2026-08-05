import { Box, List, ListItem, SvgIcon, Typography, type SvgIconProps } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import theme from '../../theme';
import { useTranslation } from 'react-i18next';
import { Link as MuiLink } from '@mui/material';
const TikTokIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 448 512">
    <path
      fill="currentColor"
      d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14z"
    />
  </SvgIcon>
);

interface ContactDetailsProps {
  address: string;
  email: string;
  phone: string;
}

export default function FooterContactColumn({ address, email, phone }: ContactDetailsProps) {
  const { t } = useTranslation('footer');
  // const isRTL = i18n.language === 'ar';
  const styles = {
    sectionTitle: {
      fontWeight: 'bold',
      color: 'text.primary',
      pb: 2,
      mb: 2,
    },
    listItemAddress: {
      alignItems: 'flex-start',
      mb: 1.5,
    },
    listItemLine: {
      alignItems: 'center',
      mb: 1.5,
    },
    listItemLast: {
      alignItems: 'center',
    },
    label: {
      minWidth: 50,
      fontWeight: 'bold',
      mr: 1,
    },
    value: {
      color: theme.palette.text.primary,
    },
    iconWrapper: {
      py: 2,
      px: 0,
    },
    icon: {
      pr: 0.5,
      mr: 1,
      width: '8%',
    },
    tiktokIcon: {
      px: 0.5,
      width: '8%',
      height: '15%',
    },
    link: {
      textDecoration: 'none',

      color: theme.palette.text.primary,
    },
  };
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={styles.sectionTitle}>
        {t('contactDetails')}
      </Typography>

      <List disablePadding>
        <ListItem disableGutters sx={styles.listItemAddress}>
          <Typography variant="body1" sx={styles.label}>
            {t('address')}:
          </Typography>
          <Typography component="div" variant="body2" sx={styles.value}>
            {address}
          </Typography>
        </ListItem>

        <ListItem disableGutters sx={styles.listItemLine}>
          <Typography variant="body1" sx={styles.label}>
            {t('email')}:
          </Typography>
          <MuiLink href={`mailto:${email}`} variant="body2" style={styles.link}>
            {email}
          </MuiLink>
        </ListItem>

        <ListItem disableGutters sx={styles.listItemLast}>
          <Typography variant="body1" sx={styles.label}>
            {t('phone')}:
          </Typography>
          <MuiLink href={`tel:${phone}`} variant="body2" style={styles.link}>
            {phone}
          </MuiLink>
        </ListItem>
      </List>

      <Box sx={styles.iconWrapper}>
        <InstagramIcon sx={styles.icon} fontSize="large" />
        <FacebookIcon sx={styles.icon} fontSize="large" />
        <TikTokIcon sx={styles.tiktokIcon} />
      </Box>
    </Box>
  );
}
