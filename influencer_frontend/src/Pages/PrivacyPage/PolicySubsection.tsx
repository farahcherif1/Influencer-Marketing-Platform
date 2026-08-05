import { Box, Typography } from '@mui/material';
import FormattedText from './FormattedText';
import PolicyList from './PolicyList';

type ContentItem = string | { list: string[] };

export interface Subsection {
  title?: string;
  content: ContentItem[];
  subsections?: Subsection[];
}

export interface Section {
  title?: string;
  content?: ContentItem[];
  subsections?: Subsection[];
}

interface PolicySubsectionProps {
  section: Section;
}

const PolicySubsection = ({ section }: PolicySubsectionProps) => (
  <Box sx={{ mt: 2, pl: 2 }}>
    {section.title && (
      <Typography variant="h6" fontWeight="600" gutterBottom>
        {section.title}
      </Typography>
    )}

    {section.content &&
      section.content.map((content, index) => {
        if (typeof content === 'string') {
          return (
            <Typography key={index} paragraph>
              <FormattedText text={content} />
            </Typography>
          );
        }
        if ('list' in content) {
          return <PolicyList key={index} items={content.list} />;
        }
        return null;
      })}

    {section.subsections &&
      section.subsections.map((subsection, idx) => (
        <Box key={idx} sx={{ mt: 2, pl: 2 }}>
          <PolicySubsection section={subsection} />
        </Box>
      ))}
  </Box>
);

export default PolicySubsection;
