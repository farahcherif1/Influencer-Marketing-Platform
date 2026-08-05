import { TextField, Box, Typography, MenuItem } from '@mui/material';
import { durationUnits } from '../../../enums/Creator-enums';
import type { PackageData } from '../../../Types/Creator';
import { useEffect, useState } from 'react';
import { getServiceId } from '../../../services/creator.service';
import { serviceIdsWithDuration } from '../../../utils/ServiceWithDuration';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../../i18n/isRtl';
interface PackageCardProps {
  pkg: PackageData;
  index: number;
  onChange: (id: number, field: keyof PackageData, value: string | boolean) => void;
  onRemove: (id: number) => void;
  contentTypesOptions: string[];
  errors?: { [key: string]: string };
}

const INPUT_HEIGHT = 40;
const FONT_SIZE = 14;

export const Package = ({
  pkg,
  onChange,
  onRemove,
  contentTypesOptions,
  errors,
}: PackageCardProps) => {
  const [showDescription, setShowDescription] = useState(!!pkg.description);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const { t, i18n } = useTranslation('creatorSteps');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  const handleToggleDescription = () => {
    if (showDescription) onChange(pkg.id, 'description', '');
    setShowDescription(!showDescription);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      if (!pkg.contentType) return setServiceId(null);
      try {
        const id = await getServiceId(pkg.contentType);
        if (active) setServiceId(id);
      } catch {
        if (active) setServiceId(null);
      }
    })();
    return () => {
      active = false;
    };
  }, [pkg.contentType]);

  const handleFieldChange =
    (field: keyof PackageData) => (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(pkg.id, field, e.target.value);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid black',
        borderRadius: 1,
        backgroundColor: '#fafafa',
        width: 380,
        padding: '8px',
        direction: direction,
      }}
    >
      {/* Content Type + Quantity */}
      <Box display="flex" gap={1} mb={2}>
        <TextField
          select
          required={!!serviceId}
          value={pkg.contentType || ''}
          error={!!errors?.contentType}
          onChange={(e) => onChange(pkg.id, 'contentType', e.target.value)}
          fullWidth
          SelectProps={{
            displayEmpty: true,
            renderValue: (selected) =>
              selected ? String(selected) : <span style={{ color: '#aaa' }}>Content Type</span>,
          }}
          sx={{ width: 250, '& .MuiInputBase-root': { height: INPUT_HEIGHT, fontSize: FONT_SIZE } }}
        >
          {contentTypesOptions.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          placeholder="Quantity"
          required={!!serviceId}
          type="number"
          value={pkg.quantity}
          onChange={handleFieldChange('quantity')}
          fullWidth
          error={!!errors?.quantity}
          sx={{ width: 100, '& .MuiInputBase-root': { height: INPUT_HEIGHT, fontSize: FONT_SIZE } }}
        />
      </Box>

      {/* Duration + Unit */}
      {serviceId && serviceIdsWithDuration.includes(serviceId) && (
        <Box display="flex" gap={1} mb={2}>
          <TextField
            placeholder="Duration (Optional)"
            type="number"
            required={!!serviceId}
            value={pkg.duration}
            onChange={handleFieldChange('duration')}
            fullWidth
            error={!!errors?.duration}
            sx={{
              width: 250,
              '& .MuiInputBase-root': { height: INPUT_HEIGHT, fontSize: FONT_SIZE },
            }}
          />
          <TextField
            select
            label="Unit"
            required={!!serviceId}
            value={pkg.durationUnit}
            InputLabelProps={{ required: false }}
            onChange={handleFieldChange('durationUnit')}
            fullWidth
            error={!!errors?.durationUnit}
            sx={{
              width: 100,
              '& .MuiInputBase-root': { height: INPUT_HEIGHT, fontSize: FONT_SIZE },
            }}
          >
            {durationUnits.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {t(`contentPackageStep.durationUnits.${label}`)}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}

      {/* Price */}
      <TextField
        placeholder="Price (USD)"
        type="number"
        required={!!serviceId}
        value={pkg.price}
        onChange={(e) => {
          onChange(pkg.id, 'price', e.target.value);
        }}
        onBlur={(e) => {
          const val = Number(e.target.value);
          if (!isNaN(val) && val < 50) {
            onChange(pkg.id, 'price', e.target.value);
          }
        }}
        inputProps={{ min: 50 }}
        fullWidth
        error={!!errors?.price || (pkg.price !== '' && Number(pkg.price) < 50)}
        helperText={pkg.price !== '' && Number(pkg.price) < 50 ? 'Minimum price is $50' : ''}
        sx={{
          width: 360,
          '& .MuiInputBase-root': { height: INPUT_HEIGHT, fontSize: FONT_SIZE },
          mb: '10px',
        }}
      />

      {/* Description */}
      {showDescription && (
        <TextField
          placeholder="Description"
          multiline
          rows={2}
          value={pkg.description}
          onChange={handleFieldChange('description')}
          sx={{ '& .MuiInputBase-root': { fontSize: FONT_SIZE }, mb: 1 }}
        />
      )}

      {/* Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 'auto',
          pt: 1,
          borderTop: '1px solid #ddd',
        }}
      >
        <Typography
          variant="body2"
          sx={{ cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}
          onClick={handleToggleDescription}
        >
          {showDescription ? 'Remove description' : 'Add a Description'}
        </Typography>

        <Typography
          component="span"
          sx={{ fontSize: '0.75rem', color: '#5cb85c', fontWeight: 500 }}
        >
          +20% Improvement
        </Typography>

        <Typography
          sx={{ cursor: 'pointer', fontWeight: 'normal', fontSize: '0.75rem', color: 'grey' }}
          onClick={() => onRemove(pkg.id)}
        >
          Remove
        </Typography>
      </Box>
    </Box>
  );
};
