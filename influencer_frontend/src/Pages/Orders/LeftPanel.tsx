import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tabs,
  Tab,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { BookingItem, Creator, User } from '../../Types/Creator';
import type { Brand } from '../../entities/Brand';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

interface LeftPanelProps {
  user: User;
  tabValue: number;
  setTabValue: (value: number) => void;
  creators: Creator[];
  brands: Brand[];
  items: BookingItem[];
  selectedCreator: Creator | null;
  selectedBrand: Brand | null;
  mediaMap: { [creatorId: number]: string };
  logoMap: { [brandId: number]: string };
  onCreatorClick: (creator: Creator, orderId: number) => void;
  onBrandClick: (brand: Brand, orderId: number) => void;
}

export default function LeftPanel({
  user,
  tabValue,
  setTabValue,
  creators,
  brands,
  items,
  selectedCreator,
  selectedBrand,
  mediaMap,
  logoMap,
  onCreatorClick,
  onBrandClick,
}: LeftPanelProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('Orders');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  const getFilteredItems = () => {
    return items.filter((item) => {
      if (tabValue === 0) return item.status === 'Requested';
      if (tabValue === 1) return item.status === 'In Progress';
      if (tabValue === 2) return item.status === 'Completed';
      return false;
    });
  };

  const filteredItems = getFilteredItems();

  return (
    <Paper
      sx={{
        width: 320,
        height: '100%',
        borderRadius: 0,
        borderRight: 1,
        borderColor: 'grey.300',
        direction: direction,
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'grey.200' }}>
        <Typography variant="h6" fontWeight="bold">
          {t('leftPanel.title')}
        </Typography>
      </Box>

      <Tabs
        value={tabValue}
        onChange={(_event, newValue) => setTabValue(newValue)}
        variant="fullWidth"
        sx={{
          '& .MuiTabs-indicator': {
            display: 'none',
          },
          height: 48,
          minHeight: 0,
        }}
      >
        <Tab
          label={t('leftPanel.tabs.requests')}
          sx={{
            bgcolor: tabValue === 0 ? '#e91e63' : 'transparent',
            color: tabValue === 0 ? 'white' : '#666',
            fontWeight: 500,
            fontSize: '14px',
            textTransform: 'none',
            minHeight: 48,
            borderBottom: tabValue !== 0 ? '1px solid #e0e0e0' : 'none',
            '&.Mui-selected': {
              color: 'white',
              bgcolor: '#e91e63',
            },
            '&:hover': {
              bgcolor: tabValue === 0 ? '#e91e63' : '#f5f5f5',
            },
          }}
        />
        <Tab
          label={t('leftPanel.tabs.inProgress')}
          sx={{
            bgcolor: tabValue === 1 ? '#2196f3' : 'transparent',
            color: tabValue === 1 ? 'white' : '#666',
            fontWeight: 500,
            fontSize: '14px',
            textTransform: 'none',
            minHeight: 48,
            borderBottom: tabValue !== 1 ? '1px solid #e0e0e0' : 'none',
            '&.Mui-selected': {
              color: 'white',
              bgcolor: '#2196f3',
            },
            '&:hover': {
              bgcolor: tabValue === 1 ? '#2196f3' : '#f5f5f5',
            },
          }}
        />
        <Tab
          label={t('leftPanel.tabs.completed')}
          sx={{
            bgcolor: tabValue === 2 ? '#4caf50' : 'transparent',
            color: tabValue === 2 ? 'white' : '#666',
            fontWeight: 500,
            fontSize: '14px',
            textTransform: 'none',
            minHeight: 48,
            borderBottom: tabValue !== 2 ? '1px solid #e0e0e0' : 'none',
            '&.Mui-selected': {
              color: 'white',
              bgcolor: '#4caf50',
            },
            '&:hover': {
              bgcolor: tabValue === 2 ? '#4caf50' : '#f5f5f5',
            },
          }}
        />
      </Tabs>

      <List sx={{ p: 0 }}>
        {user.role === 'brand' && (
          <>
            {filteredItems
              .filter((item) =>
                creators.some((creator) => creator.id === item.creatorService.creatorId),
              )
              .map((item) => {
                const creator = creators.find((c) => c.id === item.creatorService.creatorId);
                if (!creator) return null;

                return (
                  <ListItem
                    key={`${creator.id}-${item.id}`}
                    component="button"
                    onClick={() => {
                      onCreatorClick(creator, item.id!);
                      navigate(`/orders/${item.id}`);
                    }}
                    sx={{
                      borderBottom: 1,
                      borderColor: 'grey.100',
                      bgcolor: selectedCreator?.id === creator.id ? 'grey.50' : 'white',
                      '&:hover': { bgcolor: 'grey.50' },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={mediaMap[creator.id] ?? 'https://example.com/default-profile.jpg'}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={creator.name || creator.username}
                      secondary={`${t('leftPanel.order')} ${item.id}`}
                      primaryTypographyProps={{ fontWeight: 500, fontSize: 14 }}
                      secondaryTypographyProps={{ color: 'grey.600', fontSize: 12 }}
                    />
                    <Typography variant="caption" color="grey.500">
                      {item.createdAt.toString().split('.')[0].replace('T', ' ')}
                    </Typography>
                  </ListItem>
                );
              })}
          </>
        )}

        {user.role === 'creator' && (
          <>
            {filteredItems
              .filter((item) => brands.some((brand) => brand.id === item.booking.brandId))
              .map((item) => {
                const brand = brands.find((b) => b.id === item.booking.brandId);
                if (!brand) return null;

                return (
                  <ListItem
                    key={`${brand.id}-${item.id}`}
                    component="button"
                    onClick={() => {
                      onBrandClick(brand, item.id!);
                      navigate(`/orders/${item.id}`);
                    }}
                    sx={{
                      borderBottom: 1,
                      borderColor: 'grey.100',
                      bgcolor: selectedBrand?.id === brand.id ? 'grey.50' : 'white',
                      '&:hover': { bgcolor: 'grey.50' },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={logoMap[brand.id] ?? 'https://example.com/default-profile.jpg'}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={brand.name || brand.username}
                      secondary={`${t('leftPanel.order')} ${item.id}`}
                      primaryTypographyProps={{ fontWeight: 500, fontSize: 14 }}
                      secondaryTypographyProps={{ color: 'grey.600', fontSize: 12 }}
                    />
                    <Typography variant="caption" color="grey.500">
                      {item.createdAt.toString().split('.')[0].replace('T', ' ')}
                    </Typography>
                  </ListItem>
                );
              })}
          </>
        )}
      </List>
    </Paper>
  );
}
