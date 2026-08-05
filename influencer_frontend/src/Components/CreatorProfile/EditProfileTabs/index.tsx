import { Box, Tabs, Tab, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState, type SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailsTab } from './DetailsTab';
import { ImagesTab } from './ImagesTab';
import { PackagesTab } from './PackagesTab';
import { PortfolioTab } from './PortfolioTab';
import { SettingsTab } from './SettingsTab';
import { useUser } from '../../../Context/useUser';
import SocialMediaTab from './SocialMediaTab';
import { getSocialChannels } from '../../../services/socialChannelService';
import type { SocialChannel } from '../../../Types/Creator';
import { BrandImagesTab } from './brandImagesTab';

export default function EditProfileTabs() {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const navigate = useNavigate();
  const { user } = useUser();
  const [socials, setSocials] = useState<SocialChannel[]>([]);

  const handleTabChange = (_event: SyntheticEvent, newIndex: number): void => {
    setTabIndex(newIndex);
  };

  useEffect(() => {
    if (!user) return;
    const fetchSocials = async () => {
      const data = await getSocialChannels(user.id.toString(), user.role);
      setSocials(data);
    };
    fetchSocials();
  }, [user]);
  if (!user) return null;
  const tabs =
    user.role === 'creator'
      ? [
          { label: 'Details', component: <DetailsTab role={user.role} /> },
          {
            label: 'Social Media',
            component: (
              <SocialMediaTab initialChannels={socials} userId={user.id} role={user.role} />
            ),
          },
          { label: 'Images', component: <ImagesTab /> },
          { label: 'Packages', component: <PackagesTab /> },
          { label: 'Portfolio', component: <PortfolioTab /> },
          { label: 'Settings', component: <SettingsTab role={user.role} /> },
        ]
      : [
          { label: 'Details', component: <DetailsTab role={user.role} /> },
          {
            label: 'Social Media',
            component: (
              <SocialMediaTab initialChannels={socials} userId={user.id} role={user.role} />
            ),
          },
          {
            label: 'Images',
            component: <BrandImagesTab />,
          },
          { label: 'Settings', component: <SettingsTab role={user.role} /> },
        ];

  return (
    <Box sx={{ width: '100%', px: { xs: 2, md: 4 }, pt: 2 }}>
      <Box sx={{ mb: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            fontSize: 14,
            color: 'black',
            backgroundColor: '#F2F2F2',
            borderRadius: '5px',
            px: 1,
            py: 0,
            mb: 5,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#e0e0e0',
              boxShadow: 'none',
            },
            '&:focus': {
              outline: 'none',
            },
          }}
          onClick={() => navigate(`/${user?.username}`)}
        >
          Back to Profile
        </Button>
      </Box>

      <Typography variant="h3" fontWeight={600} fontSize={28} color="black" mb={4} mt={-2}>
        Edit Profile
      </Typography>

      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        scrollButtons="auto"
        variant="scrollable"
        sx={{
          borderBottom: 'none',
          '& .MuiTabs-indicator': {
            backgroundColor: 'black',
          },
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              color: 'gray',
              '&.Mui-selected': {
                color: 'black',
              },
              '&:hover': {
                color: 'black',
              },
              '&:focus': {
                outline: 'none',
              },
              pr: '40px',
            }}
          />
        ))}
      </Tabs>

      <Box mt={2} ml={-2}>
        {tabs[tabIndex]?.component}
      </Box>
    </Box>
  );
}
