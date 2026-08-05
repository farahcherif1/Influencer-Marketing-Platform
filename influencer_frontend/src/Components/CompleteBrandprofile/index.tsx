import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import RoleStep from './RoleStep';
import IndustryStep from './IndustryStep';
import CategoriesStep from './CategoriesStep';
import TargetAudienceStep from './TargetAudienceStep';
import ContentPiecesStep from './ContentPiecesStep';
import AnnualBudgetStep from './AnnualBudgetStep';
import { Box } from '@mui/material';
import { setTokenAfterSignup } from '../../services/completeProfileService';
import { useUser } from '../../Context/useUser';
import { createReferral } from '../../services/brandService';
import { AxiosError } from 'axios';

interface BrandFormData {
  role: string;
  industry: string;
  categories: number[];
  targetAudience: string[];
  contentPieces: string;
  annualBudget: string;
}

export default function CompleteBrandProfile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser();

  const initialUserId = location.state?.userId;
  const [userId, setUserId] = useState<number | null>(initialUserId || null);
  const [step, setStep] = useState(Number(searchParams.get('section')) || 1);
  const referralCode = localStorage.getItem('referralCode');
  const referralSentRef = useRef(false);

  const [formData, setFormData] = useState<BrandFormData>({
    role: '',
    industry: '',
    categories: [],
    targetAudience: [],
    contentPieces: '',
    annualBudget: '',
  });

  const updateFormData = (field: keyof BrandFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    setUserId(user?.id || null);
  }, [user]);

  useEffect(() => {
    const sendReferral = async () => {
      if (referralSentRef.current || !referralCode || !userId) return;

      try {
        referralSentRef.current = true;
        await createReferral(referralCode, userId);
        localStorage.removeItem('referralCode');
        localStorage.setItem('signupCompleted', 'true');
      } catch (error) {
        referralSentRef.current = false;
        if (error instanceof AxiosError && error.response?.status === 409) {
          console.warn('Referral already exists');
        } else {
          console.error('Referral submission failed:', error);
        }
      }
    };

    sendReferral();
  }, [userId, referralCode]);

  useEffect(() => {
    navigate(`?section=${step}`, { replace: true });
  }, [step, navigate]);

  const handleNext = async () => {
    if (!userId) return;
    if (step === 6) {
      try {
        const { user, accessToken } = await setTokenAfterSignup(userId);
        setUser({ ...user, accessToken, profileComplete: true });
        navigate('/');
        localStorage.setItem('signupCompleted', 'true');
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
        <RoleStep
          onContinue={handleNext}
          userId={userId}
          initialRole={formData.role}
          onRoleChange={(role) => updateFormData('role', role)}
        />
      )}
      {step === 2 && (
        <IndustryStep
          onContinue={handleNext}
          onBack={handlePrev}
          userId={userId}
          initialIndustry={formData.industry}
          onIndustryChange={(industry) => updateFormData('industry', industry)}
        />
      )}
      {step === 3 && (
        <CategoriesStep
          onContinue={handleNext}
          onBack={handlePrev}
          userId={userId}
          initialCategories={formData.categories}
          onCategoriesChange={(categories) => updateFormData('categories', categories)}
        />
      )}
      {step === 4 && (
        <TargetAudienceStep
          onContinue={handleNext}
          onBack={handlePrev}
          userId={userId}
          initialSelectedPlatforms={formData.targetAudience}
          onSelectedPlatformsChange={(audience) => updateFormData('targetAudience', audience)}
        />
      )}
      {step === 5 && (
        <ContentPiecesStep
          onContinue={handleNext}
          onBack={handlePrev}
          userId={userId}
          initialContentPieces={formData.contentPieces}
          onContentPiecesChange={(pieces) => updateFormData('contentPieces', pieces)}
        />
      )}
      {step === 6 && (
        <AnnualBudgetStep
          onContinue={handleNext}
          onBack={handlePrev}
          userId={userId}
          initialAnnualBudget={formData.annualBudget}
          onAnnualBudgetChange={(budget) => updateFormData('annualBudget', budget)}
        />
      )}
    </Box>
  );
}
