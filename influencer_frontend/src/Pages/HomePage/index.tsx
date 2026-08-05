import { Box, Grid, Typography, Link as MuiLink } from '@mui/material';
import { useEffect, useState } from 'react';
import CardComponent from './CardComponent';
import FAQCard from '../../Components/FAQCard';
import QuoteCard from './QuoteCard';
import FeatureSection from './FeatureSection';
import marketplaceImg from '../../assets/marketplace.png';
import CategoryCard from './CategoryCard';
import fashion from '../../assets/fashion.png';
import musicDance from '../../assets/musicdance.png';
import beauty from '../../assets/beauty.jpg';
import travel from '../../assets/travel.png';
import SearchBar from '../../Components/SearchBar';
import theme from '../../theme';
import SectionInfluencer from '../../Components/SectionInfluencer';
// import creator from '../../assets/creator.jpg';
// import creator1 from '../../assets/creator1.jpg';
// import creator2 from '../../assets/creator2.webp';
// import creator3 from '../../assets/creator3.jpg';
import numi from '../../assets/Numi.jpg';
import team from '../../assets/team.jpg';
import header from '../../assets/header.jpg';
import money from '../../assets/money.svg';
import secure from '../../assets/secure.svg';
import check from '../../assets/check.svg';
import chat from '../../assets/chat.svg';
import { Trans, useTranslation } from 'react-i18next';
import TrustedInfluencerSection from './TrustedInfluencerSection';
import i18n from '../../i18n';
import { isRtl } from '../../i18n/isRtl';
import FindInfluencerCard from './FindInfluencerSection';
import api from '../../api/axios';

// Types for the API response
interface Creator {
  id: number;
  name: string;
  username: string;
  title: string;
  location: string | null;
  rating: number;
  coverPhoto: string;
  followers: number | null;
  price: number | null;
  platform: string;
}

interface HomePageCreatorsResponse {
  resultat: {
    featured: Creator[];
    instagram: Creator[];
    tiktok: Creator[];
    youtube: Creator[];
    UGC: Creator[];
  };
}

// Function to fetch homepage creators
const fetchHomePageCreators = async (): Promise<HomePageCreatorsResponse> => {
  const response = await api.get('/creator/homePage');
  return response.data;
};

// Transform backend creator data to match the expected format for SectionInfluencer
const transformCreatorData = (creators: Creator[]) => {
  return creators.map((creator) => ({
    imageUrl: creator.coverPhoto || creator.id.toString(), // fallback to ID if no cover photo
    name: creator.name,
    username: creator.username,
    rating: creator.rating,
    prices: [
      {
        price: creator.price || 0,
        platform: creator.platform,
        contentType: 'Sponsored Post', // Default content type
      },
    ],
    title: creator.title,
    location: creator.location || 'Location not specified',
    followers: [
      {
        platform: creator.platform,
        followers: creator.followers || 0,
      },
    ],
  }));
};

// Helper function to check if a category has at least 4 creators
// const categoryHasMinimumCreators = (creators: Creator[] | undefined): boolean => {
//   return (creators?.length || 0) >= 4;
// };

export default function HomePage() {
  const { t } = useTranslation('homePage');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  // State for storing creators data
  const [creatorsData, setCreatorsData] = useState<HomePageCreatorsResponse['resultat'] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch creators data on component mount
  useEffect(() => {
    const loadCreators = async () => {
      try {
        setLoading(true);
        const data = await fetchHomePageCreators();
        setCreatorsData(data.resultat);
      } catch (err) {
        console.error('Error fetching homepage creators:', err);
        setError('Failed to load creators');
      } finally {
        setLoading(false);
      }
    };

    loadCreators();
  }, []);

  const styles = {
    link: {
      color: '#1976d2',
      textDecorationColor: '#1976d2',
    },
    scroller: {
      display: 'flex',
      flexWrap: 'nowrap',
      overflowX: 'scroll',
      width: '100%',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    scrollerBtn: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'nowrap',
      overflowX: 'scroll',
      width: '100%',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  };

  const cardData = [
    {
      link: money,
      title: t('no_upfront_cost.title'),
      description: t('no_upfront_cost.description'),
    },
    {
      link: check,
      title: t('vetted_influencers.title'),
      description: t('vetted_influencers.description'),
    },
    {
      link: chat,
      title: t('instant_chat.title'),
      description: t('instant_chat.description'),
    },
    {
      link: secure,
      title: t('secure_purchases.title'),
      description: t('secure_purchases.description'),
    },
  ];

  const influencerMarketingFAQ = [
    {
      question: t('MarketinFAQ.0.question'),
      answer: t('MarketinFAQ.0.answer'),
    },
    {
      question: t('MarketinFAQ.1.question'),
      answer: (
        <Trans i18nKey="MarketinFAQ.1.answer" ns="homePage">
          Influencer marketing operates by identifying suitable influencers for your brand,
          establishing a partnership, and creating and distributing content through the influencer's
          channels. This content can take various forms, including sponsored posts, reviews,
          tutorials, or endorsements. The influencer shares this content with their audience,
          effectively introducing your brand or product to a potentially receptive and
          <MuiLink> engaged audience</MuiLink>. The key to successful influencer marketing lies in
          crafting authentic and relevant content that resonates with both the influencer's
          followers and your brand's message.
        </Trans>
      ),
    },
    {
      question: t('MarketinFAQ.2.question'),
      answer: t('MarketinFAQ.2.answer'),
    },
    {
      question: t('MarketinFAQ.3.question'),
      answer: (
        <Trans
          i18nKey="MarketinFAQ.3.answer"
          ns="homePage"
          components={[<MuiLink href="#" sx={styles.link} underline="always" />]}
        />
      ),
    },
    {
      question: t('MarketinFAQ.4.question'),
      answer: t('MarketinFAQ.4.answer'),
    },
    {
      question: t('MarketinFAQ.5.question'),
      answer: (
        <Trans
          i18nKey="MarketinFAQ.5.answer"
          ns="homePage"
          components={[<MuiLink href="#" sx={styles.link} underline="always" />]}
        />
      ),
    },
    {
      question: t('MarketinFAQ.6.question'),
      answer: (
        <Trans
          i18nKey="MarketinFAQ.6.answer"
          ns="homePage"
          components={[<MuiLink href="#" sx={styles.link} underline="always" />]}
        />
      ),
    },
    {
      question: t('MarketinFAQ.7.question'),
      answer: t('MarketinFAQ.7.answer'),
    },
    {
      question: t('MarketinFAQ.8.question'),
      answer: t('MarketinFAQ.8.answer'),
    },
  ];

  const testimonials = [
    {
      subtitle: t('testimonials.0.subtitle'),
      content: t('testimonials.0.content'),
      author: t('testimonials.0.author'),
    },
    {
      subtitle: t('testimonials.1.subtitle'),
      content: t('testimonials.1.content'),
      author: t('testimonials.1.author'),
    },
    {
      subtitle: t('testimonials.2.subtitle'),
      content: t('testimonials.2.content'),
      author: t('testimonials.2.author'),
    },
  ];

  const searchTable = [
    {
      title: t('search_table_title_1'),
      description: t('search_table_description_1'),
    },
    {
      title: t('search_table_title_2'),
      description: t('search_table_description_2'),
    },
    {
      title: t('search_table_title_3'),
      description: t('search_table_description_3'),
    },
  ];

  const categories = [
    { title: t('categories.Fashion'), image: fashion, username: 'fashionguru' },
    { title: t('categories.Music & Dance'), image: musicDance, username: 'musicdancer' },
    { title: t('categories.Beauty'), image: beauty, username: 'beautyqueen' },
    { title: t('categories.Travel'), image: travel, username: 'travelblogger' },
  ];

  const CaseStudiesTable = [
    {
      title: t('case_studies.wealthsimple_title'),
      image: header,
      href: '',
    },
    {
      title: t('case_studies.numi_title'),
      image: numi,
      href: '#',
    },
    {
      title: t('case_studies.team_title'),
      image: team,
      href: '',
    },
  ];

  // Fallback creator data (your original static data)
  // const fallbackCreatorTable = [
  //   {
  //     imageUrl: creator,
  //     name: t('creatorTable.0.name'),
  //     username: 'user1',
  //     rating: 5.0,
  //     prices: [
  //       {
  //         price: 50,
  //         platform: 'Instagram',
  //         contentType: 'Sponsored Post',
  //       },
  //     ],
  //     description: t('creatorTable.0.description'),
  //     location: t('creatorTable.0.location'),
  //     followers: [
  //       {
  //         platform: 'Instagram',
  //         followers: 50000,
  //       },
  //     ],
  //   },
  //   {
  //     imageUrl: creator1,
  //     name: t('creatorTable.1.name'),
  //     username: 'user2',
  //     rating: 5.0,
  //     prices: [
  //       {
  //         price: 40,
  //         platform: 'TikTok',
  //         contentType: 'Sponsored Post',
  //       },
  //     ],
  //     description: t('creatorTable.1.description'),
  //     location: t('creatorTable.1.location'),
  //     followers: [
  //       {
  //         platform: 'TikTok',
  //         followers: 1000000,
  //       },
  //     ],
  //   },
  //   {
  //     imageUrl: creator2,
  //     name: t('creatorTable.2.name'),
  //     username: 'user3',
  //     rating: 5.0,
  //     prices: [
  //       {
  //         price: 40,
  //         platform: 'YouTube',
  //         contentType: 'Video Mention',
  //       },
  //     ],
  //     description: t('creatorTable.2.description'),
  //     location: t('creatorTable.2.location'),
  //     followers: [
  //       {
  //         platform: 'YouTube',
  //         followers: 1000000,
  //       },
  //     ],
  //   },
  //   {
  //     imageUrl: creator3,
  //     name: t('creatorTable.3.name'),
  //     username: 'user4',
  //     rating: 5.0,
  //     prices: [
  //       {
  //         price: 40,
  //         platform: 'Instagram',
  //         contentType: 'Story Post',
  //       },
  //     ],
  //     description: t('creatorTable.3.description'),
  //     location: t('creatorTable.3.location'),
  //     followers: [
  //       {
  //         platform: 'Instagram',
  //         followers: 1000000,
  //       },
  //     ],
  //   },
  // ];

  // Show loading state
  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <Typography>Loading creators...</Typography>
      </Box>
    );
  }

  if (error) {
    console.warn('Using fallback creator data due to error:', error);
    // Continue with fallback data instead of showing error
  }

  // Get creator data (from API or fallback for each category)
  const featuredCreators = creatorsData ? transformCreatorData(creatorsData.featured) : [];
  const instagramCreators = creatorsData ? transformCreatorData(creatorsData.instagram) : [];
  const tiktokCreators = creatorsData ? transformCreatorData(creatorsData.tiktok) : [];
  const youtubeCreators = creatorsData ? transformCreatorData(creatorsData.youtube) : [];
  const ugcCreators = creatorsData ? transformCreatorData(creatorsData.UGC) : [];

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        overflowX: 'hidden',
        direction: direction,
        width: '100%',
        margin: 0,
        padding: 0,
      }}
    >
      <Box sx={{ px: { xs: 2, sm: 3, md: 10 } }}>
        <Typography
          variant="h1"
          sx={{
            textAlign: 'center',
            mt: 14,
            fontSize: '260%',
            color: theme.palette.primary.main,
          }}
        >
          {t('influencer_marketing_made_easy')}
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            mt: 2,
            mb: 3,
            color: '#808080',
            fontWeight: 400,
            fontSize: '18px',
          }}
        >
          {t('find_and_hire_influencers')}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
          <SearchBar></SearchBar>
        </Box>

        {/* Creator sections with API data or fallback for each category */}
        <SectionInfluencer
          title={t('sections.featured.title')}
          minidescription={t('sections.featured.minidescription')}
          creatorTable={featuredCreators}
        />
        <SectionInfluencer
          title={t('sections.instagram.title')}
          minidescription={t('sections.instagram.minidescription')}
          creatorTable={instagramCreators}
        />
        <SectionInfluencer
          title={t('sections.tiktok.title')}
          minidescription={t('sections.tiktok.minidescription')}
          creatorTable={tiktokCreators}
        />

        <Box>
          <Typography variant="h4"> {t('categorie')}</Typography>
          <Box
            sx={{ display: 'flex', overflowX: 'auto', cursor: 'pointer', paddingTop: 3, gap: 2 }}
          >
            {categories.map((category, index) => (
              <Box key={index} sx={{ flex: '0 0 auto' }}>
                <CategoryCard
                  title={category.title}
                  image={category.image}
                  width={310}
                  height={190}
                  variant="h5"
                  username={category.username}
                />
              </Box>
            ))}
          </Box>
        </Box>

        <FeatureSection
          mintitle={t('feature_search_mintitle')}
          title={t('feature_search_title')}
          imageUrl={marketplaceImg}
          imagePosition="right"
          contentTable={searchTable}
        />

        <Grid container spacing={4} justifyContent="center">
          {cardData.map((card, index) => (
            <Grid size={{ xs: 12, sm: 12, md: 3 }} key={index} sx={{ height: '100%' }}>
              <CardComponent link={card.link} title={card.title} description={card.description} />
            </Grid>
          ))}
        </Grid>

        <TrustedInfluencerSection></TrustedInfluencerSection>

        <Grid
          container
          spacing={4}
          sx={{
            padding: 2,
            mb: 2,
            justifyContent: {
              xs: 'center',
              sm: 'center',
              md: 'flex-start',
            },
            flexWrap: 'wrap',
          }}
        ></Grid>

        <Typography variant="h4"> {t('case')}</Typography>
        <Grid container spacing={4} sx={{ paddingTop: 3 }}>
          <Grid sx={styles.scroller}>
            {CaseStudiesTable.map((category, index) => (
              <Grid sx={{ flex: '0 0 auto', marginRight: '14px', marginLeft: '14px' }} key={index}>
                <CategoryCard
                  title={category.title}
                  image={category.image}
                  width={410}
                  height={250}
                  variant="h6"
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Typography sx={{ mt: 8 }} variant="h4">
          {t('brands_work_with_influencers')}
        </Typography>
        <Grid container sx={{ mt: 3, mb: 9 }} spacing={2} justifyContent="center">
          {testimonials.map((testimonial, index) => (
            <Grid size={{ xs: 12, sm: 12, md: 4 }} key={index} sx={{ height: '100%' }}>
              <QuoteCard
                key={index}
                title={testimonial.subtitle}
                description={testimonial.content}
                author={testimonial.author}
              />
            </Grid>
          ))}
        </Grid>

        <SectionInfluencer
          title={t('sections.youtube.title')}
          minidescription={t('sections.youtube.minidescription')}
          creatorTable={youtubeCreators}
        />
        <SectionInfluencer
          title={t('sections.ugc.title')}
          minidescription={t('sections.ugc.minidescription')}
          creatorTable={ugcCreators}
        />

        {influencerMarketingFAQ.map((faq, index) => (
          <FAQCard key={index} question={faq.question} answer={faq.answer} />
        ))}

        <FindInfluencerCard></FindInfluencerCard>
      </Box>
    </Box>
  );
}
