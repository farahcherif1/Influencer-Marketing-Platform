import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import LocationStep from './LocationStep';
import TitleStep from './TitleStep';
import DescriptionStep from './DescriptionStep';
import GenderStep from './GenderStep';
import SocialChannelsStep from './SocialChannelsStep';
import CategoriesStep from '../CompleteBrandprofile/CategoriesStep';
import ImageUploadStep from './ImageUploadStep';
import ContentPackageStep from './ContentPackageStep';
import PhoneNumberStep from './PhoneNumberStep';
import LastStep from './LastStep';
import { setTokenAfterSignup } from '../../services/completeProfileService';
import { useUser } from '../../Context/useUser';
import UsernameStep from './UsernameStep';
import type { CreatePackage } from '../../Types/Creator';

interface CreatorFormData {
  username: string;
  location: string;
  title: string;
  description: string;
  gender: string;
  socialChannels: { usernames: { [key: string]: string }; followers: { [key: string]: string } };
  categories: number[];
  images: string[] | null;
  contentPackages: CreatePackage[];
  phoneNumber: string;
}

export default function CompleteCreatorProfile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser();

  const initialUserId = location.state?.userId;
  const [userId, setUserId] = useState<number | null>(initialUserId || null);
  const [step, setStep] = useState(Number(searchParams.get('section')) || 1);

  // Centralized form data state
  const [formData, setFormData] = useState<CreatorFormData>({
    username: '',
    location: '',
    title: '',
    description: '',
    gender: '',
    socialChannels: {
      usernames: {},
      followers: {},
    },
    categories: [],
    images: null,
    contentPackages: [],
    phoneNumber: '',
  });

  useEffect(() => {
    setUserId(user?.id || null);
  }, [user]);

  useEffect(() => {
    navigate(`?section=${step}`, { replace: true });
  }, [step, navigate]);

  // Generic update function for form data
  const updateFormData = (field: keyof CreatorFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (!userId) return;
    if (step === 11) {
      try {
        const { user, accessToken } = await setTokenAfterSignup(userId);
        setUser({ ...user, accessToken, profileComplete: true });
        navigate('/');
      } catch (error) {
        console.error('Token after signup error:', error);
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  if (!userId) {
    return <p>Loading profile...</p>;
  }

  return (
    <Box>
      {step === 1 && (
        <UsernameStep
          onContinue={handleNext}
          userId={userId}
          initialUsername={formData.username}
          onUsernameChange={(username) => updateFormData('username', username)}
        />
      )}
      {step === 2 && (
        <LocationStep
          onContinue={handleNext}
          onBack={handlePrev}
          userId={userId}
          initialLocation={formData.location}
          onLocationChange={(location) => updateFormData('location', location)}
        />
      )}
      {step === 3 && (
        <TitleStep
          onContinue={handleNext}
          onBack={handlePrev}
          userId={userId}
          initialTitle={formData.title}
          onTitleChange={(title) => updateFormData('title', title)}
        />
      )}
      {step === 4 && (
        <DescriptionStep
          onContinue={handleNext}
          onBack={handlePrev}
          userId={userId}
          initialDescription={formData.description}
          onDescriptionChange={(description) => updateFormData('description', description)}
        />
      )}
      {step === 5 && (
        <GenderStep
          onContinue={handleNext}
          onBack={handlePrev}
          userId={userId}
          initialGender={formData.gender}
          onGenderChange={(gender) => updateFormData('gender', gender)}
        />
      )}
      {step === 6 && (
        <SocialChannelsStep
          onContinue={handleNext}
          onBack={handlePrev}
          userId={userId}
          initialChannels={formData.socialChannels}
          onChannelsChange={(channels) => updateFormData('socialChannels', channels)}
        />
      )}
      {step === 7 && (
        <CategoriesStep
          onContinue={handleNext}
          onBack={handlePrev}
          userId={userId}
          initialCategories={formData.categories}
          onCategoriesChange={(categories) => updateFormData('categories', categories)}
        />
      )}
      {step === 8 && (
        <ImageUploadStep
          onContinue={handleNext}
          onBack={handlePrev}
          userId={userId}
          initialImages={formData.images ?? []}
          onImagesChange={(images) => updateFormData('images', images)}
        />
      )}
      {step === 9 && (
        <ContentPackageStep
          onContinue={handleNext}
          onBack={handlePrev}
          userId={userId}
          initialPackages={formData.contentPackages}
          onPackagesChange={(packages) => updateFormData('contentPackages', packages)}
        />
      )}
      {step === 10 && (
        <PhoneNumberStep
          onContinue={handleNext}
          onBack={handlePrev}
          userId={userId}
          initialPhoneNumber={formData.phoneNumber}
          onPhoneNumberChange={(phone) => updateFormData('phoneNumber', phone)}
        />
      )}
      {step === 11 && <LastStep onContinue={handleNext} onBack={handlePrev} userId={userId} />}
    </Box>
  );
}
