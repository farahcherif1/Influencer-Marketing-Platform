import { useEffect, useState } from 'react';
import ProfileHeader from './ProfileHeader';
import { Box } from '@mui/material';
import Reviews from '../../Components/Review';
import type { Brand } from '../../entities/Brand';
import Footer from '../../Components/Footer';
import { useParams } from 'react-router-dom';
import { getBrandByUsername } from '../../services/brandService';
export default function BrandProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Brand | null>(null);

  useEffect(() => {
    const getDataProfile = async () => {
      try {
        if (!username) {
          console.error('Username is undefined');
          return;
        }
        const brand = await getBrandByUsername(username);
        setProfile(brand);
      } catch (err) {
        console.error('Erreur API :', err);
      }
    };
    getDataProfile();
  }, [username]);
  return (
    <>
      {profile && <ProfileHeader brand={profile} />}

      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, sm: 5, md: 0 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 3,
        }}
      >
        {!(profile?.coverPhotoUrl && profile?.logoUrl && profile?.description)}

        <Reviews></Reviews>
        <Footer />
      </Box>
    </>
  );
}
