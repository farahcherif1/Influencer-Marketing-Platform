import React, { useCallback, useEffect, useState } from 'react';
import SearchBar from '../../Components/SearchBar';
import { Box, Chip, Button, Grid } from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import CreatorCard from '../../Components/CreatorCard';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import GenderFilter from './GenderFilter';
import LocationFilter from './LocationFilter';
import PriceFilter from './PriceFilter';
import FollowersFilter from './FollowerFilter';
import { useSearchParams } from 'react-router-dom';
import ContentTypeFilter from './ContentTypeFilter';
import AgeFilter from './AgeFilter';
import EthnicityFilter from './EthnicityFilter';
import LanguageFilter from './LanguageFilter';
import { fetchCreators } from '../../services/creator.service';
import type { CreatorSearchData } from '../../Types/Creator';
import type { CreatorSearchResponse } from '../../Types/Creator';
import FilterNavigation from '../HomePage/FilterNavigation';
import { isRtl } from '../../i18n/isRtl';
import i18n from '../../i18n';
// import { StarIcon } from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();

  const pParam = searchParams.get('p') ?? 'all';
  const cParam = searchParams.get('c') ?? 'all';

  const platform = pParam === 'all' ? 'All' : pParam;
  const category = cParam === 'all' ? 'All' : cParam;

  const basicFilters = [
    {
      title: 'Followers',
    },
    {
      title: 'Location',
    },
    {
      title: 'Content Type',
    },
    {
      title: 'Gender',
    },
    {
      title: 'Age',
    },
    {
      title: 'Ethnicity',
    },
    {
      title: 'Language',
    },
  ];

  // const premiumFilters = ['Age', 'Ethnicity', 'Language'];

  const [open, setOpen] = React.useState(false);
  const [selectedFilter, setSelectedFilter] = React.useState<string | null>(null);

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);

  const handleOpen = (option: string) => {
    setSelectedFilter(option);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFilter(null);
  };

  // const handleFilterClick = (option: string) => {
  //   console.log(`Filter clicked: ${option}`);
  // };

  // const handlePremiumClick = (option: string) => {
  //   console.log(`Premium clicked for ${option}`);
  // };
  const handleOpenContentType = (option: string, event: React.MouseEvent<HTMLElement>) => {
    setSelectedFilter(option);
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  type Gender = 'Male' | 'Female' | 'Other' | '';
  const [gender, setGender] = useState<Gender>('');
  const [location, setLocation] = React.useState<{ country: string; city: string }>({
    country: '',
    city: '',
  });
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [followersRange, setFollowersRange] = useState<[number, number] | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<string[]>([]);
  const [ageRange, setAgeRange] = React.useState<[number, number] | null>(null);
  const [selectedEthnicities, setSelectedEthnicities] = React.useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>([]);
  const [page, setPage] = useState(1); // current page
  const limit = 8; // number of creators per page

  const [creators, setCreators] = useState<CreatorSearchResponse[]>([]);

  const handleSearch = useCallback(async () => {
    try {
      const filters: CreatorSearchData = {
        platform: platform !== 'All' ? platform : undefined,
        category: category !== 'All' ? category : undefined,
        country: location.country || undefined,
        city: location.city || undefined,
        ageMin: ageRange?.[0],
        ageMax: ageRange?.[1],
        priceMin: priceRange?.[0],
        priceMax: priceRange?.[1],
        gender: gender || undefined,
        ethnicity: selectedEthnicities.join(',') || undefined,
        contentType: selectedContentType.join(',') || undefined,
        followersMin: followersRange?.[0],
        followersMax: followersRange?.[1],
        page,
        limit,
      };
      const response = await fetchCreators(filters);
      setCreators(response.data);
    } catch (error) {
      console.error('Error fetching creators:', error);
    }
    // list every state value used inside the function:
  }, [
    platform,
    category,
    location,
    ageRange,
    priceRange,
    gender,
    selectedEthnicities,
    selectedContentType,
    followersRange,
    page,
    limit,
  ]);

  useEffect(() => {
    handleSearch();
  }, [page, handleSearch]);

  const handleClearAll = () => {
    setGender('');
    setLocation({ country: '', city: '' });
    setPriceRange(null);
    setFollowersRange(null);
    setSelectedContentType([]);
    setAgeRange(null);
    setSelectedEthnicities([]);
    setSelectedLanguages([]);
    setCreators([]);
  };

  const renderFilterComponent = () => {
    switch (selectedFilter) {
      case 'Location':
        return (
          <LocationFilter
            open={open}
            handleClose={handleClose}
            onChange={setLocation}
            value={location}
          />
        );
      case 'Price':
        return (
          <PriceFilter
            open={open}
            handleClose={handleClose}
            onChange={setPriceRange}
            value={priceRange ?? [50, 3000]}
          />
        );
      case 'Gender':
        return (
          <GenderFilter open={open} handleClose={handleClose} onChange={setGender} value={gender} />
        );
      case 'Followers':
        return (
          <FollowersFilter
            open={open}
            handleClose={handleClose}
            onChange={setFollowersRange}
            value={followersRange ?? [1, 1000000]}
          />
        );
      case 'Content Type':
        return (
          <ContentTypeFilter
            open={open}
            anchorEl={anchorEl}
            handleClose={handleClose}
            selectedTypes={selectedContentTypes}
            setSelectedTypes={setSelectedContentTypes}
            onChange={setSelectedContentType}
          />
        );

      case 'Age':
        return (
          <AgeFilter
            open={open}
            handleClose={handleClose}
            value={ageRange ?? [18, 60]}
            onChange={setAgeRange}
          />
        );
      case 'Ethnicity':
        return (
          <EthnicityFilter
            open={open}
            handleClose={handleClose}
            value={selectedEthnicities}
            onChange={setSelectedEthnicities}
          />
        );
      case 'Language':
        return (
          <LanguageFilter
            open={open}
            handleClose={handleClose}
            value={selectedLanguages}
            onChange={setSelectedLanguages}
          />
        );

      default:
        return null;
    }
  };
  const styles = {
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
    filterItem: {
      flex: '0 0 auto', // do not shrink
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
  };
  const currentLang = i18n.language;

  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

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
        <Box sx={{ display: 'flex', justifyContent: 'left', alignItems: 'center', my: 2, mt: 14 }}>
          <SearchBar
            initialPlatform={platform}
            initialCategory={category}
            onSearch={handleSearch}
          ></SearchBar>
        </Box>
        {/* Filters */}
        {
          <Grid sx={{ padding: 0 }}>
            <Grid sx={styles.scrollerBtn}>
              {basicFilters.map((option, index) => (
                <Grid key={index} sx={{ flex: '0 0 auto', marginRight: '2px', marginLeft: '2px' }}>
                  <FilterNavigation
                    title={option.title}
                    onClick={
                      option.title === 'Content Type'
                        ? (e) => handleOpenContentType(option.title, e)
                        : () => handleOpen(option.title)
                    }
                  />
                </Grid>
              ))}
              <Chip
                label="Clear All"
                icon={<ClearAllIcon sx={{ fontSize: 16 }} />}
                onClick={handleClearAll}
                sx={{
                  color: '#666',
                  bgcolor: 'transparent',
                  '&:hover': { bgcolor: '#f5f5f5' },
                  cursor: 'pointer',
                  flex: '0 0 auto',
                }}
              />
            </Grid>
          </Grid>
        }

        {/* Creators */}
        <Box
          sx={{
            display: 'grid',
            gap: 2, // spacing between cards
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Grid container spacing={4} sx={{ paddingTop: 3 }}>
            <Grid sx={styles.scroller}>
              {creators.map((creator) => (
                <Grid sx={{ flex: '0 0 auto', marginRight: '9px', marginLeft: '9px' }}>
                  <CreatorCard
                    imageUrl={creator.imageUrls}
                    name={creator.name}
                    username={creator.username}
                    prices={creator.prices}
                    title={creator.title}
                    location={creator.location}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Box>

        {/* Pagination */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: 1200,
            mb: 5,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIosIcon />}
            onClick={() => setPage(page - 1)}
            sx={{
              color: 'black',
              borderColor: 'black',
              borderRadius: 2,
              textTransform: 'none',
              fontSize: 16,
              fontWeight: 500,
              width: 'auto',
              px: 2,
              py: 1,
              '&:hover': { borderColor: 'black', backgroundColor: '#f5f5f5' },
            }}
          >
            Previous Page
          </Button>

          <Button
            variant="outlined"
            endIcon={<ArrowForwardIosIcon />}
            onClick={() => setPage(page + 1)}
            sx={{
              color: 'black',
              borderColor: 'black',
              borderRadius: 2,
              textTransform: 'none',
              fontSize: 16,
              fontWeight: 500,
              px: 2,
              py: 1,
              '&:hover': { borderColor: 'black', backgroundColor: '#f5f5f5' },
            }}
          >
            Next Page
          </Button>
        </Box>
        {/* Filter Modal */}
        {renderFilterComponent()}
      </Box>
    </Box>
  );
};

export default SearchPage;
