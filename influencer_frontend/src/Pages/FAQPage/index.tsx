import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { isRtl } from '../../i18n/isRtl';
import FAQCard from '../../Components/FAQCard';

export interface FAQCategory {
  question: string;
  answer: React.ReactNode;
}

export default function FAQPage() {
  const { t } = useTranslation('faq');
  const currentLang = i18n.language;

  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  const styles = {
    pageWrapper: {
      bgcolor: 'white',
    },
    contentBox: {
      width: '80%',
      mx: 'auto',
      direction: direction,
    },
    sectionTitle: {
      fontWeight: 600,
      mt: 0,
      pt: 20,
      mb: 4,
    },
    brandTitle: {
      fontWeight: 600,
      my: 4,
    },
    brandSection: {
      mb: 12,
    },
    link: {
      color: '#1976d2',
      textDecorationColor: '#1976d2',
    },
  };

  const influencerFAQs: FAQCategory[] = [
    {
      question: t('influencerFAQs.howDoesItWork.question'),
      answer: t('influencerFAQs.howDoesItWork.answer'),
    },
    {
      question: t('influencerFAQs.howGetPaid.question'),
      answer: (
        <Trans
          i18nKey="influencerFAQs.howGetPaid.answer"
          ns="faq"
          components={[<MuiLink href="#" sx={styles.link} underline="always" />]}
        />
      ),
    },
    {
      question: t('influencerFAQs.howMuchCost.question'),
      answer: t('influencerFAQs.howMuchCost.answer'),
    },
    {
      question: t('influencerFAQs.paymentGuaranteed.question'),
      answer: t('influencerFAQs.paymentGuaranteed.answer'),
    },
    {
      question: t('influencerFAQs.declineOrders.question'),
      answer: t('influencerFAQs.declineOrders.answer'),
    },
    {
      question: t('influencerFAQs.supportedPlatforms.question'),
      answer: t('influencerFAQs.supportedPlatforms.answer'),
    },
    {
      question: t('influencerFAQs.supportedCountries.question'),
      answer: (
        <Trans
          i18nKey="influencerFAQs.supportedCountries.answer"
          ns="faq"
          components={[<MuiLink href="#" sx={styles.link} underline="always" />]}
        />
      ),
    },
    {
      question: t('influencerFAQs.bindingContracts.question'),
      answer: t('influencerFAQs.bindingContracts.answer'),
    },
    {
      question: t('influencerFAQs.agencyQuestion.question'),
      answer: t('influencerFAQs.agencyQuestion.answer'),
    },
  ];

  const brandFAQs: FAQCategory[] = [
    {
      question: t('brandFAQs.howDoesItWork.question'),
      answer: t('brandFAQs.howDoesItWork.answer'),
    },
    {
      question: t('brandFAQs.whatIsCollabios.question'),
      answer: t('brandFAQs.whatIsCollabios.answer'),
    },
    {
      question: t('brandFAQs.influencersVetted.question'),
      answer: t('brandFAQs.influencersVetted.answer'),
    },
    {
      question: t('brandFAQs.shippingWork.question'),
      answer: t('brandFAQs.shippingWork.answer'),
    },
    {
      question: t('brandFAQs.customOffers.question'),
      answer: t('brandFAQs.customOffers.answer'),
    },
    {
      question: t('brandFAQs.acceptTime.question'),
      answer: t('brandFAQs.acceptTime.answer'),
    },
    {
      question: t('brandFAQs.declinedOrder.question'),
      answer: t('brandFAQs.declinedOrder.answer'),
    },
    {
      question: t('brandFAQs.receiveWork.question'),
      answer: t('brandFAQs.receiveWork.answer'),
    },
    {
      question: t('brandFAQs.paymentTypes.question'),
      answer: (
        <Trans
          i18nKey="brandFAQs.paymentTypes.answer"
          ns="faq"
          components={[<MuiLink href="#" sx={styles.link} underline="always" />]}
        />
      ),
    },
  ];

  return (
    <Box sx={styles.pageWrapper}>
      <Box sx={styles.contentBox}>
        <Typography variant="h3" sx={styles.sectionTitle}>
          {t('titleInfluencer')}
        </Typography>
        {influencerFAQs.map((faq, index) => (
          <FAQCard key={index} question={faq.question} answer={faq.answer} />
        ))}

        <Typography variant="h3" sx={styles.brandTitle}>
          {t('titleBrand')}
        </Typography>
        <Box sx={styles.brandSection}>
          {brandFAQs.map((faq, index) => (
            <FAQCard key={index} question={faq.question} answer={faq.answer} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
