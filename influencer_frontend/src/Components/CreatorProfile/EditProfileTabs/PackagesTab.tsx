import { useEffect, useState } from 'react';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import {
  fetchCreatorPackage,
  addCreatorPackage,
  fetchServices,
  removePackage,
  getServiceId,
} from '../../../services/creator.service';
import { Package } from './PackageCard';
import type { PackageData } from '../../../Types/Creator';
import { validatePackage } from '../../../utils/packageValidation';
import { serviceIdsWithDuration } from '../../../utils/ServiceWithDuration';

export const PackagesTab = () => {
  const [creatorPackages, setCreatorPackages] = useState<PackageData[]>([]);
  const [newPackage, setNewPackage] = useState<PackageData | null>(null);
  const [contentTypesOptions, setContentTypesOptions] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [removeSuccess, setRemoveSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedPackages, fetchedContentTypes] = await Promise.all([
          fetchCreatorPackage(),
          fetchServices(),
        ]);
        setCreatorPackages(fetchedPackages);
        setContentTypesOptions(fetchedContentTypes);
      } catch (error) {
        console.error('Error loading packages or content types:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddPackage = () => {
    setNewPackage({
      id: Date.now(),
      contentType: '',
      quantity: '',
      duration: '',
      durationUnit: '',
      price: '',
      description: '',
    });
  };

  const handleRemovePackage = async (id: number) => {
    try {
      await removePackage(id);
      setCreatorPackages((prev) => prev.filter((p) => p.id !== id));
      setRemoveSuccess(true);
      setTimeout(() => setRemoveSuccess(false), 4000);
    } catch (error) {
      console.error(`Failed to remove package with id ${id}:`, error);
    }
  };

  const handleChange = (id: number, field: keyof PackageData, value: string | boolean) => {
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });

    const updatePackage = (pkg: PackageData) => (pkg.id === id ? { ...pkg, [field]: value } : pkg);

    if (newPackage && newPackage.id === id) {
      setNewPackage((prev) => prev && { ...prev, [field]: value });
    } else {
      setCreatorPackages((prev) => prev.map(updatePackage));
    }
  };

  const handleSave = async () => {
    if (!newPackage) return;
    const serviceId = newPackage.contentType ? await getServiceId(newPackage.contentType) : 0;

    const requireDuration = serviceIdsWithDuration.includes(serviceId);
    const errors = validatePackage(newPackage, requireDuration);

    if (Object.keys(errors).length) {
      const errorMessage = Object.values(errors).join('\n');
      window.alert(errorMessage);

      setValidationErrors(errors);
      return;
    }

    try {
      const response = await addCreatorPackage(newPackage);
      setCreatorPackages((prev) => [...prev, response]);
      setNewPackage(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save package:', error);
      window.alert('An error occurred while saving the package.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
        <Typography variant="h6" ml={2}>
          Loading profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: '10px', md: '20px' }, py: { xs: '32px', md: '60px' } }}>
      {saveSuccess && <Alert severity="success">Package added successfully!</Alert>}
      {removeSuccess && <Alert severity="success">Package removed successfully!</Alert>}

      {Object.keys(validationErrors).length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Please fix the following errors:
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {Object.entries(validationErrors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </Alert>
      )}
      <Box sx={{ mb: 1, mt: '15px', display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {creatorPackages.map((pkg, index) => (
          <Box
            key={pkg.id}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 48%', md: '1 1 30%' },
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Package
              pkg={pkg}
              index={index}
              onChange={handleChange}
              onRemove={() => handleRemovePackage(pkg.id)}
              contentTypesOptions={contentTypesOptions}
            />
          </Box>
        ))}

        {newPackage && (
          <Box
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 48%', md: '1 1 30%' },
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {' '}
            <Package
              pkg={newPackage}
              index={creatorPackages.length}
              onChange={handleChange}
              onRemove={() => setNewPackage(null)}
              contentTypesOptions={contentTypesOptions}
              errors={validationErrors}
            />
          </Box>
        )}
      </Box>

      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Typography
          variant="body1"
          sx={{ cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
          onClick={handleAddPackage}
        >
          + Add package
        </Typography>
      </Box>

      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          onClick={handleSave}
          sx={{
            backgroundColor: 'black',
            color: 'white',
            textTransform: 'none',
            fontWeight: 600,
            px: 15,
            py: 1.5,
            borderRadius: 2,
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};
