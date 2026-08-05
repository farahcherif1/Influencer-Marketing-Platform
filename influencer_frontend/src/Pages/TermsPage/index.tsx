// src/pages/TermsOfUseFromJSON.jsx
import { Container, Typography, Box, Link } from '@mui/material';
import TermsSubsection from './TermsSubsection';
import TermsSection from '../PrivacyPage/TermsSection';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

interface Subsection {
  title: string;
  content?: string[];
}

interface Section {
  title: string;
  content?: string[];
  subsections?: Subsection[];
}

interface TermsTable {
  title: string;
  last_updated: string;
  sections: Section[];
}

const TermsOfUseFromJSON = () => {
  const currentLanguage = i18n.language;
  const isRTL = currentLanguage === 'ar';

  const { t } = useTranslation('terms');

  const table: TermsTable = {
    title: t('title'),
    last_updated: t('lastUpdated'),
    sections: [
      {
        title: t('sections.agreementToTerms.title'),
        content: [
          t('sections.agreementToTerms.content.0'),
          t('sections.agreementToTerms.content.1'),
          t('sections.agreementToTerms.content.2'),
          t('sections.agreementToTerms.content.3'),
          t('sections.agreementToTerms.content.4'),
        ],
      },
      {
        title: t('sections.intellectualPropertyRights.title'),
        content: [
          t('sections.intellectualPropertyRights.content.0'),
          t('sections.intellectualPropertyRights.content.1'),
          t('sections.intellectualPropertyRights.content.2'),
        ],
      },
      {
        title: t('sections.userRepresentations.title'),
        content: [
          t('sections.userRepresentations.content.0'),
          t('sections.userRepresentations.content.1'),
          t('sections.userRepresentations.content.2'),
          t('sections.userRepresentations.content.3'),
        ],
      },
      {
        title: t('sections.userRegistration.title'),
        content: [t('sections.userRegistration.content.0')],
      },
      {
        title: t('sections.marketplaceOfferings.title'),
        content: [t('sections.marketplaceOfferings.content.0')],
      },
      {
        title: t('sections.purchasesAndPayment.title'),
        content: [
          t('sections.purchasesAndPayment.content.0'),
          t('sections.purchasesAndPayment.content.1'),
          t('sections.purchasesAndPayment.content.2'),
        ],
      },
      {
        title: t('sections.refundPolicy.title'),
        content: [
          t('sections.refundPolicy.content.0'),
          t('sections.refundPolicy.content.1'),
          t('sections.refundPolicy.content.2'),
        ],
      },
      {
        title: t('sections.prohibitedActivities.title'),
        content: [
          t('sections.prohibitedActivities.content.0'),
          t('sections.prohibitedActivities.content.1'),
        ],
      },
      {
        title: t('sections.userGeneratedContributions.title'),
        content: [
          t('sections.userGeneratedContributions.content.0'),
          t('sections.userGeneratedContributions.content.1'),
          t('sections.userGeneratedContributions.content.2'),
        ],
      },
      {
        title: t('sections.contributionLicense.title'),
        content: [
          t('sections.contributionLicense.content.0'),
          t('sections.contributionLicense.content.1'),
          t('sections.contributionLicense.content.2'),
          t('sections.contributionLicense.content.3'),
        ],
      },
      {
        title: t('sections.guidelinesForReviews.title'),
        content: [
          t('sections.guidelinesForReviews.content.0'),
          t('sections.guidelinesForReviews.content.1'),
        ],
      },
      {
        title: t('sections.mobileApplicationLicense.title'),
        subsections: Object.values(
          t('sections.mobileApplicationLicense.subsections', { returnObjects: true }),
        ).map((subsection) => ({
          title: subsection.title,
          content: Object.values(subsection.content),
        })),
      },
      {
        title: t('sections.thirdPartyWebsitesAndContent.title'),
        content: [
          t('sections.thirdPartyWebsitesAndContent.content.0'),
          t('sections.thirdPartyWebsitesAndContent.content.1'),
          t('sections.thirdPartyWebsitesAndContent.content.2'),
        ],
      },
      {
        title: t('sections.advertisers.title'),
        content: [t('sections.advertisers.content.0')],
      },
      {
        title: t('sections.siteManagement.title'),
        content: [t('sections.siteManagement.content.0')],
      },
      {
        title: t('sections.privacyPolicy.title'),
        content: [t('sections.privacyPolicy.content.0')],
      },
      {
        title: t('sections.digitalMillenniumCopyrightAct.title'),
        subsections: [
          {
            title: t('sections.digitalMillenniumCopyrightAct.subsections.notifications.title'),
            content: [
              t('sections.digitalMillenniumCopyrightAct.subsections.notifications.content.0'),
              t('sections.digitalMillenniumCopyrightAct.subsections.notifications.content.1'),
            ],
          },
          {
            title: t(
              'sections.digitalMillenniumCopyrightAct.subsections.counterNotification.title',
            ),
            content: [
              t('sections.digitalMillenniumCopyrightAct.subsections.counterNotification.content.0'),
              t('sections.digitalMillenniumCopyrightAct.subsections.counterNotification.content.1'),
              t('sections.digitalMillenniumCopyrightAct.subsections.counterNotification.content.2'),
            ],
          },
        ],
      },
      {
        title: t('sections.termAndTermination.title'),
        content: [
          t('sections.termAndTermination.content.0'),
          t('sections.termAndTermination.content.1'),
        ],
      },
      {
        title: t('sections.modificationsAndInterruptions.title'),
        content: [
          t('sections.modificationsAndInterruptions.content.0'),
          t('sections.modificationsAndInterruptions.content.1'),
        ],
      },
      {
        title: t('sections.governingLaw.title'),
        content: [t('sections.governingLaw.content.0')],
      },
      {
        title: t('sections.disputeResolution.title'),
        subsections: [
          {
            title: t('sections.disputeResolution.subsections.bindingArbitration.title'),
            content: [t('sections.disputeResolution.subsections.bindingArbitration.content.0')],
          },
          {
            title: t('sections.disputeResolution.subsections.restrictions.title'),
            content: [t('sections.disputeResolution.subsections.restrictions.content.0')],
          },
          {
            title: t('sections.disputeResolution.subsections.exceptions.title'),
            content: [t('sections.disputeResolution.subsections.exceptions.content.0')],
          },
        ],
      },
      {
        title: t('sections.corrections.title'),
        content: [t('sections.corrections.content.0')],
      },
      {
        title: t('sections.disclaimer.title'),
        content: [t('sections.disclaimer.content.0')],
      },
      {
        title: t('sections.limitationsOfLiability.title'),
        content: [t('sections.limitationsOfLiability.content.0')],
      },
      {
        title: t('sections.indemnification.title'),
        content: [t('sections.indemnification.content.0')],
      },
      {
        title: t('sections.userData.title'),
        content: [t('sections.userData.content.0')],
      },
      {
        title: t('sections.electronicCommunications.title'),
        content: [t('sections.electronicCommunications.content.0')],
      },
      {
        title: t('sections.californiaUsersAndResidents.title'),
        content: [t('sections.californiaUsersAndResidents.content.0')],
      },
      {
        title: t('sections.miscellaneous.title'),
        content: [t('sections.miscellaneous.content.0')],
      },
      {
        title: t('sections.influencerMarketplace.title'),
        content: [
          t('sections.influencerMarketplace.content.0'),
          t('sections.influencerMarketplace.content.1'),
          t('sections.influencerMarketplace.content.2'),
          t('sections.influencerMarketplace.content.3'),
        ],
      },
      {
        title: t('sections.influencerContractGenerator.title'),
        content: [t('sections.influencerContractGenerator.content.0')],
      },
      {
        title: t('sections.contactUs.title'),
        content: [
          t('sections.contactUs.content.0'),
          t('sections.contactUs.content.1'),
          t('sections.contactUs.content.2'),
          t('sections.contactUs.content.3'),
          t('sections.contactUs.content.4'),
          t('sections.contactUs.content.5'),
          t('sections.contactUs.content.6'),
        ],
      },
    ],
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, mt: 12, direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          {table.title}
        </Typography>
        <Typography variant="subtitle1" color="text.primary">
          {t('lastUpdatedLabel')}: {table.last_updated}
        </Typography>
      </Box>

      {/* Sections */}
      {table.sections.map((section, index) => (
        <TermsSection key={index} title={section.title}>
          {section.content && section.content.length > 0 ? (
            section.content.map((contentItem, contentIndex) => (
              <Box key={contentIndex}>
                {section.title === 'Contact Us' ? (
                  <Typography>{contentItem}</Typography>
                ) : contentItem === 'Contact Us' ? (
                  <Link
                    href="#"
                    sx={{
                      textDecoration: 'underline',
                      color: 'primary.main',
                      '&:hover': { color: 'primary.dark' },
                    }}
                  >
                    {contentItem}
                  </Link>
                ) : (
                  <Typography paragraph>{contentItem}</Typography>
                )}
              </Box>
            ))
          ) : (
            <Typography paragraph></Typography>
          )}
          {section.subsections &&
            section.subsections.map((subsection, subIndex) => (
              <TermsSubsection key={subIndex} title={subsection.title}>
                {subsection.content &&
                  subsection.content.map((subContentItem, subContentIndex) => (
                    <Box key={subContentIndex}>
                      <Typography paragraph>{subContentItem}</Typography>
                    </Box>
                  ))}
              </TermsSubsection>
            ))}
        </TermsSection>
      ))}

      <Typography variant="body2" color="text.secondary" textAlign="center"></Typography>
    </Container>
  );
};

export default TermsOfUseFromJSON;
