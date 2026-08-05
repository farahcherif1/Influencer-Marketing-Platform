import FooterColumn from './FooterColumn';
import FooterContactColumn from './FooterContactColumn';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

export interface FooterColumnData {
  title: string;
  items: {
    text: string;
    link: string;
  }[];
}

export interface FooterLinkItem {
  title: string;
  items: FooterItem[];
}

export interface FooterItem {
  text: string;
  link: string;
}

export default function Footer() {
  const { t } = useTranslation('footer');
  const isRTL = i18n.language === 'ar';
  const styles = {
    footerContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      borderTop: '1px solid #e0e0e0',
      direction: isRTL ? 'rtl' : 'ltr',
      gap: 4,
      marginRight: 10,
      marginLeft: 10,

      paddingTop: 8,
    },
    columnsWrapper: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: { xs: 3, md: 4 },
      mb: 4,
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    columnBox: {
      flex: '1 1 30%',
      minWidth: 300,
      marginRight: 1,
      textAlign: isRTL ? 'right' : 'left',
    },
    copyright: {
      fontFamily: '"Helvetica Neue", Arial, sans-serif',
      fontWeight: 500,
      letterSpacing: '0.5px',
      textAlign: 'left',
      mt: { xs: 3, md: 2 },
    },
  };

  const contactInfo = {
    address: '123 Avenue des Champs-Élysées',
    email: 'contact@entreprise.com',
    phone: '+216 14 555 666',
  };

  const footerColumns: FooterColumnData[] = [
    {
      title: t('discover'),
      items: [
        { text: t('findInfluencers'), link: '#' },
        { text: t('topInfluencers'), link: '#' },
        { text: t('blog'), link: '#' },
        { text: t('affiliateProgram'), link: '#' },
      ],
    },
    {
      title: t('support'),
      items: [
        { text: t('contactUs'), link: '/contact' },
        { text: t('howItWorks'), link: '#' },
        { text: t('faq'), link: '/faq' },
        { text: t('privacy'), link: '/privacy' },
        { text: t('terms'), link: '/terms' },
      ],
    },
  ];

  return (
    <Box sx={styles.footerContainer}>
      <Box sx={styles.columnsWrapper}>
        <Box sx={styles.columnBox}>
          <FooterContactColumn {...contactInfo} />
          <Typography variant="body2" color="text.secondary" sx={styles.copyright}>
            © Collabios Inc.
          </Typography>
        </Box>

        <Box sx={styles.columnBox}>
          <FooterColumn columnData={footerColumns[0]} />
        </Box>

        <Box sx={styles.columnBox}>
          <FooterColumn columnData={footerColumns[1]} />
        </Box>
      </Box>
    </Box>
  );
}
