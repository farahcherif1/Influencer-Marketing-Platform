import { Box, Typography } from '@mui/material';
import PolicySubsection from './PolicySubsection';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const PrivacyPolicy = () => {
  const { t } = useTranslation('privacy');
  const currentLanguage = i18n.language;
  const isRTL = currentLanguage === 'ar';
  const privacyData = {
    title: t('privacyPolicy.title'),
    lastUpdated: t('privacyPolicy.lastUpdated'),
    sections: [
      {
        title: t('privacyPolicy.sections.0.title'),
        content: [t('privacyPolicy.sections.0.content.0')],
      },
      {
        title: t('privacyPolicy.sections.1.title'),
        subsections: [
          {
            title: t('privacyPolicy.sections.1.subsections.0.title'),
            content: [t('privacyPolicy.sections.1.subsections.0.content.0')],
          },
          {
            title: t('privacyPolicy.sections.1.subsections.1.title'),
            content: [t('privacyPolicy.sections.1.subsections.1.content.0')],
          },
        ],
      },
      {
        title: t('privacyPolicy.sections.2.title'),
        content: [t('privacyPolicy.sections.2.content.0'), t('privacyPolicy.sections.2.content.1')],
        subsections: [
          {
            content: [
              {
                list: [
                  t('privacyPolicy.sections.2.subsections.0.content.0.list.0'),
                  t('privacyPolicy.sections.2.subsections.0.content.0.list.1'),
                  t('privacyPolicy.sections.2.subsections.0.content.0.list.2'),
                  t('privacyPolicy.sections.2.subsections.0.content.0.list.3'),
                  t('privacyPolicy.sections.2.subsections.0.content.0.list.4'),
                  t('privacyPolicy.sections.2.subsections.0.content.0.list.5'),
                ],
              },
            ],
          },
          {
            title: t('privacyPolicy.sections.2.subsections.1.title'),
            content: [t('privacyPolicy.sections.2.subsections.1.content.0')],
          },
          {
            title: t('privacyPolicy.sections.2.subsections.2.title'),
            content: [t('privacyPolicy.sections.2.subsections.2.content.0')],
          },
          {
            title: t('privacyPolicy.sections.2.subsections.3.title'),
            content: [t('privacyPolicy.sections.2.subsections.3.content.0')],
          },
          {
            title: t('privacyPolicy.sections.2.subsections.4.title'),
            content: [t('privacyPolicy.sections.2.subsections.4.content.0')],
          },
        ],
      },
      {
        title: t('privacyPolicy.sections.3.title'),
        subsections: [
          {
            title: t('privacyPolicy.sections.3.subsections.0.title'),
            content: [
              t('privacyPolicy.sections.3.subsections.0.content.0'),
              t('privacyPolicy.sections.3.subsections.0.content.1'),
            ],
          },
          {
            title: t('privacyPolicy.sections.3.subsections.1.title'),
            content: [t('privacyPolicy.sections.3.subsections.1.content.0')],
          },
          {
            title: t('privacyPolicy.sections.3.subsections.2.title'),
            content: [t('privacyPolicy.sections.3.subsections.2.content.0')],
          },
          {
            title: t('privacyPolicy.sections.3.subsections.3.title'),
            content: [t('privacyPolicy.sections.3.subsections.3.content.0')],
          },
          {
            title: t('privacyPolicy.sections.3.subsections.4.title'),
            content: [t('privacyPolicy.sections.3.subsections.4.content.0')],
          },
          {
            title: t('privacyPolicy.sections.3.subsections.5.title'),
            content: [t('privacyPolicy.sections.3.subsections.5.content.0')],
          },
          {
            title: t('privacyPolicy.sections.3.subsections.6.title'),
            content: [t('privacyPolicy.sections.3.subsections.6.content.0')],
          },
          {
            title: t('privacyPolicy.sections.3.subsections.7.title'),
            content: [t('privacyPolicy.sections.3.subsections.7.content.0')],
          },
        ],
      },
      {
        title: t('privacyPolicy.sections.4.title'),
        content: [
          t('privacyPolicy.sections.4.content.0'),
          {
            list: [t('privacyPolicy.sections.4.content.1.list.0')],
          },
          t('privacyPolicy.sections.4.content.2'),
          {
            list: [
              t('privacyPolicy.sections.4.content.3.list.0'),
              t('privacyPolicy.sections.4.content.3.list.1'),
              t('privacyPolicy.sections.4.content.3.list.2'),
              t('privacyPolicy.sections.4.content.3.list.3'),
              t('privacyPolicy.sections.4.content.3.list.4'),
              t('privacyPolicy.sections.4.content.3.list.5'),
              t('privacyPolicy.sections.4.content.3.list.6'),
              t('privacyPolicy.sections.4.content.3.list.7'),
              t('privacyPolicy.sections.4.content.3.list.8'),
            ],
          },
        ],
      },
      {
        title: t('privacyPolicy.sections.5.title'),
        content: [
          t('privacyPolicy.sections.5.content.0'),
          {
            list: [
              t('privacyPolicy.sections.5.content.1.list.0'),
              t('privacyPolicy.sections.5.content.1.list.1'),
              t('privacyPolicy.sections.5.content.1.list.2'),
            ],
          },
          t('privacyPolicy.sections.5.content.2'),
        ],
      },
      {
        title: t('privacyPolicy.sections.6.title'),
        content: [t('privacyPolicy.sections.6.content.0'), t('privacyPolicy.sections.6.content.1')],
      },
      {
        title: t('privacyPolicy.sections.7.title'),
        content: [t('privacyPolicy.sections.7.content.0')],
      },
      {
        title: t('privacyPolicy.sections.8.title'),
        content: [t('privacyPolicy.sections.8.content.0')],
      },
      {
        title: t('privacyPolicy.sections.9.title'),
        content: [t('privacyPolicy.sections.9.content.0')],
      },
      {
        title: t('privacyPolicy.sections.10.title'),
        content: [t('privacyPolicy.sections.10.content.0')],
      },
      {
        title: t('privacyPolicy.sections.11.title'),
        content: [
          {
            list: [
              t('privacyPolicy.sections.11.content.0.list.0'),
              t('privacyPolicy.sections.11.content.0.list.1'),
              t('privacyPolicy.sections.11.content.0.list.2'),
              t('privacyPolicy.sections.11.content.0.list.3'),
              t('privacyPolicy.sections.11.content.0.list.4'),
            ],
          },
          t('privacyPolicy.sections.11.content.1'),
        ],
      },
      {
        title: t('privacyPolicy.sections.12.title'),
        content: [t('privacyPolicy.sections.12.content.0')],
      },
      {
        title: t('privacyPolicy.sections.13.title'),
        content: [t('privacyPolicy.sections.13.content.0')],
      },
    ],
  };
  const styles = {
    title: {
      textAlign: 'center',
    },
    boxStyle: {
      maxWidth: 800,
      mx: 'auto',
      p: 3,
      mt: 10,
      direction: isRTL ? 'rtl' : 'ltr',
    },
  };

  return (
    <Box sx={styles.boxStyle}>
      <Typography variant="h3" sx={styles.title} gutterBottom>
        {privacyData.title}
      </Typography>
      <Typography variant="subtitle1" sx={styles.title} gutterBottom>
        Last Updated: {privacyData.lastUpdated}
      </Typography>

      {privacyData.sections.map((section, index) => (
        <PolicySubsection key={index} section={section} />
      ))}
    </Box>
  );
};

export default PrivacyPolicy;
