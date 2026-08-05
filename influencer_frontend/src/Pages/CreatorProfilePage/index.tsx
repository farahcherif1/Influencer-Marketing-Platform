import React from 'react';
import { Box, Divider, useMediaQuery, useTheme } from '@mui/material';
import PackagesSection from './packagesSection';
import PhotoGallery from './PhotoGallery';
import CreatorInfo from './creatorInfo';
import HeaderProfile from './HeaderProfile';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StickyCart from './stickyCart';
import type { Creator, CreatorService, Media, PackageItem } from '../../Types/Creator';
import { getCreatorByUsername } from '../../services/creator.service';
import PortfolioSection from './PortfolioSection';
import { useCart } from '../../Context/useCart';
import type { PortfolioItem } from '../../Types/Creator';
import { getPortfolioFiles } from '../../services/portfolioService';
import { getMediaByCreator } from '../../services/ImagesService';
import Reviews from '../../Components/Review';

const CreatorProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Creator | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [, setCreatorServices] = useState<PackageItem[]>([]);
  const { addToCart } = useCart();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [mediaItems, setMediaItems] = useState<Media[]>([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (!username) return;

    const loadProfile = async () => {
      try {
        const creator = await getCreatorByUsername(username);
        setProfile(creator);

        // Process creator services
        if (creator.creatorServices) {
          const packages = creator.creatorServices.map((cs: CreatorService) => ({
            id: cs.id.toString(),
            title: `${cs.quantity} ${cs.service?.name} (${cs.duration}${cs.durationUnit}) `,
            price: `$${cs.price}`,
            description: cs.description,
            platform: cs.service.platform,
            selected: false,
          }));
          setCreatorServices(packages);
          if (packages.length > 0) setSelectedPackage(packages[0].id);
        }

        // Fetch portfolio with presigned URLs
        const portfolio = await getPortfolioFiles(creator.id);
        setPortfolioItems(portfolio);

        const media = await getMediaByCreator(creator.id);
        setMediaItems(media);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error loading creator profile:', err.message);
        }
      }
    };

    loadProfile(); // call the async function
  }, [username]);

  const handleAddToCart = (item: { creatorServiceId: number; cartId: number }) => {
    addToCart(item);
  };
  const userProfile = {
    profileUrl: `https://example.com/${username}`,
  };
  const styles = {
    pageWrapper: {
      bgcolor: 'white',
    },
  };
  if (!profile) return <div>No profile found</div>;
  const profilePhoto = mediaItems.find((item) => item.type === 'PROFILE_PICTURE');
  const profilePhotoUrl = profilePhoto?.url ?? 'https://example.com/default-profile.jpg';
  return (
    <Box sx={styles.pageWrapper}>
      <Box px={{ xs: 0.5, md: 20 }} pb={8} mt={10}>
        <Box>
          <HeaderProfile title={profile?.title ?? ''} profileUrl={userProfile?.profileUrl ?? ''} />
          <PhotoGallery medias={mediaItems} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 4,
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ flex: 2 }}>
            {profile && <CreatorInfo creator={profile} profilePhotoUrl={profilePhotoUrl} />}

            {/* Mobile StickyCart */}
            {isMobile && (
              <Box
                sx={{
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1300,
                  bgcolor: 'white',
                  boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                  px: 2,
                  py: 1,
                  borderTop: '1px solid #eee',
                }}
              >
                <StickyCart
                  packages={profile.creatorServices}
                  selectedPackage={selectedPackage}
                  onPackageSelect={setSelectedPackage}
                  onAddToCart={handleAddToCart}
                  mobileMode={true}
                />
              </Box>
            )}

            {/* Packages and Portfolio */}
            <Box m={3}>
              <PackagesSection
                packages={profile.creatorServices}
                selectedPackage={selectedPackage}
                onPackageSelect={setSelectedPackage}
              />

              <Divider sx={{ my: 4 }} />

              {portfolioItems.length !== 0 ? (
                <PortfolioSection PortfolioItems={portfolioItems} />
              ) : null}
              <Reviews />
            </Box>
          </Box>

          {/* Right Side: Sticky Cart only on large screens */}
          <Box
            sx={{
              flex: 1,
              display: { xs: 'none', lg: 'block' },
              position: 'sticky',
              justifyContent: 'center',
              top: '30%',
              alignSelf: 'flex-start',
              mt: 10,
            }}
          >
            <StickyCart
              packages={profile.creatorServices}
              selectedPackage={selectedPackage}
              onPackageSelect={setSelectedPackage}
              onAddToCart={handleAddToCart}
              mobileMode={false}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default CreatorProfilePage;
