import { Box, Grid, Typography } from '@mui/material';
import SubsectionHomePage from '../../Components/SubsectionHomePage';
import theme from '../../theme';
interface FeatureSectionProps {
  mintitle: string;
  title: string;
  imageUrl: string;
  imagePosition: 'left' | 'right';
  contentTable: ContentItem[];
}
interface ContentItem {
  title: string;
  description: string;
}
export default function FeatureSection({
  mintitle,
  title,
  imageUrl,
  imagePosition,
  contentTable,
}: FeatureSectionProps) {
  return (
    <Grid container spacing={8} sx={{ my: 8 }}>
      {imagePosition === 'left' && (
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <img
            src={imageUrl}
            alt="Feature"
            style={{
              width: '100%',
              maxWidth: '1000px',
              borderRadius: 16,
              marginTop: '14px',
              marginRight: '50px',
            }}
          />
        </Grid>
      )}
      <Grid size={{ md: 6, xs: 12, sm: 12 }}>
        <Typography
          variant="h4"
          fontWeight={600}
          sx={{
            mb: 2,
            backgroundImage: `linear-gradient(to right, ${theme.palette.secondary.dark}, ${theme.palette.primary.dark})`,

            padding: '4px 12px',
            display: 'inline-block',

            color: 'white',
            borderRadius: '30px',
          }}
        >
          {mintitle}
        </Typography>
        <Typography fontSize="1.9rem" fontWeight={550} sx={{ mt: 1 }}>
          {title}
        </Typography>
        <Box>
          {contentTable.map((content, index) => (
            <SubsectionHomePage
              key={index}
              title={content.title}
              description={content.description}
            ></SubsectionHomePage>
          ))}
        </Box>
      </Grid>

      {imagePosition === 'right' && (
        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
          <img src={imageUrl} alt="Feature" style={{ width: '100%', borderRadius: 16 }} />
        </Grid>
      )}
    </Grid>
  );
}
