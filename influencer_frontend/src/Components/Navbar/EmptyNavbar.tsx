import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

export default function EmptyNavbar() {
  const navigate = useNavigate();
  const theme = useTheme();

  const styles = {
    appBar: {
      backgroundColor: 'white',
      position: 'fixed',
      elevation: 0,
      boxShadow: 'none',
    },
    toolbar: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '85px',
      px: { xs: 2, sm: 3, md: 6 },
    },
    brandBox: {
      flexGrow: 1,
      textAlign: 'left',
      cursor: 'pointer',
    },
  };

  return (
    <AppBar sx={styles.appBar}>
      <Toolbar sx={styles.toolbar}>
        <Box sx={styles.brandBox} onClick={() => navigate('/')}>
          <Typography variant="h4" sx={{ color: theme.palette.text.primary }}>
            Collabios
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
