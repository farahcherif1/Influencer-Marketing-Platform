import { Box, Grid, Link, Typography } from '@mui/material';
import CreatorCard from '../CreatorCard';
import theme from '../../theme';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import type { Price } from '../../Types/Creator';

interface contentCreator {
  imageUrl: string;
  name: string;
  rating: number;
  prices: Price[];
  title: string;
  location: string;
  username: string;
}

interface sectionInfluencerProps {
  title: string;
  minidescription: string;
  creatorTable: contentCreator[];
}

export default function SectionInfluencer({
  title,
  minidescription,
  creatorTable,
}: sectionInfluencerProps) {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation('homePage');

  const styles = {
    LinkStyle: {
      color: theme.palette.text.primary,
      fontWeight: 600,
      textDecoration: 'none',
      textAlign: 'right',
      mr: { md: 5, sx: 1 },
      ml: { md: 2, sx: 1 },
      cursor: 'pointer',
    },
    minDesc: {
      my: 1,
      ml: { md: 5, sx: 1 },
      color: theme.palette.text.secondary,
    },
  };

  // Show first 4 creators by default, or all if showAll is true
  const displayedCreators = showAll ? creatorTable : creatorTable.slice(0, 4);

  const handleSeeAllClick = () => {
    if (showAll) {
      // If showing all, scroll to top of section and collapse
      setShowAll(false);
    } else {
      // If showing limited, expand to show all
      setShowAll(true);
    }
  };

  return (
    <Box sx={{ mb: 6 }}>
      <Typography
        variant="h4"
        fontWeight={600}
        sx={{
          ml: { md: 5, sx: 1 },
        }}
      >
        {title}
      </Typography>
      <Box sx={{ display: 'flex', mb: 1, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={styles.minDesc}>{minidescription}</Typography>
        {creatorTable.length > 4 && (
          <Typography variant="h6" sx={styles.LinkStyle} onClick={handleSeeAllClick}>
            {showAll ? t('show_less') : t('see_all')}
          </Typography>
        )}
        {creatorTable.length <= 4 && (
          <Link href="/search" variant="h6" sx={styles.LinkStyle}>
            {t('see_all')}
          </Link>
        )}
      </Box>
      <Grid container spacing={2}>
        {displayedCreators.map((creator, index) => (
          <Grid
            key={index}
            size={{ xs: 12, sm: 6, md: 3 }}
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <CreatorCard
              imageUrl={creator.imageUrl}
              name={creator.name}
              prices={creator.prices}
              title={creator.title}
              location={creator.location}
              username={creator.username}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
