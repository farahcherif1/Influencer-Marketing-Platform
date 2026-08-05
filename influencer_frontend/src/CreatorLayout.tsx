import { Outlet } from 'react-router-dom';
import Navbar from './Components/Navbar';
import { Box } from '@mui/material';
import { useUser } from './Context/useUser';

const CreatorLayout = () => {
  const { user } = useUser();

  return (
    <Box>
      <Navbar user={user} />
      <Box sx={{ padding: 15, paddingTop: 10, minHeight: '100vh' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default CreatorLayout;
