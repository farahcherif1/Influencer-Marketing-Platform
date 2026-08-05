// import Header from '../CreatorHeader/index';
import { Box } from '@mui/material';

export default function EditPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box>
      {/* <Header /> */}
      <Box sx={{ padding: 15, paddingTop: 10, minHeight: '100vh' }}>{children}</Box>
    </Box>
  );
}
