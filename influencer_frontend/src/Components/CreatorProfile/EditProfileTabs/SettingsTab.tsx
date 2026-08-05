import { useState, useEffect } from 'react';
import {
  Stack,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { CardVerification } from './CardVerification';
import type { CreatorSettings } from '../../../Types/Creator';
import {
  deleteCreatorAccount,
  fetchCreatorProfile,
  updateAccount,
  verify,
} from '../../../services/creator.service';
import { deleteBrandAccount } from '../../../services/brandService';
import { useNavigate } from 'react-router';
import { handleLogout } from '../../../services/authService';
import { useUser } from '../../../Context/useUser';

type Role = 'creator' | 'brand';
interface SettingsTabProps {
  role: Role;
}

const defaultDetails: CreatorSettings = {
  email: '',
  password: '',
};

export function SettingsTab({ role }: SettingsTabProps) {
  const isCreator = role === 'creator';
  const [formData, setFormData] = useState<CreatorSettings>(defaultDetails);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [sameEmail, setSameEmail] = useState(false);
  const [samePassword, setSamePassword] = useState(false);

  // Password edit state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const theme = useTheme();
  const navigate = useNavigate();
  const { setUser } = useUser();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isCreator) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCreatorProfile();
        if (data) {
          setFormData({
            email: data.email,
            password: '',
          });
        }
      } catch {
        setError('Failed to load profile details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [isCreator]);

  const handleChange = (key: keyof CreatorSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const editCreatorInfo = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const updatedData = { ...formData };

      const hasCurrent = currentPassword.trim() !== '';
      const hasNew = newPassword.trim() !== '';

      // Case 1: No password change : allow update
      if (!hasCurrent && !hasNew) {
        const res = await updateAccount(updatedData);
        if (res.message === 'Same email provided') {
          setSameEmail(true);
          setTimeout(() => setSameEmail(false), 3000);
        } else {
          setSaveSuccess(true);
        }
      }
      // Case 2: Both fields filled :  verify before updating
      else if (hasCurrent && hasNew) {
        const isValid = await verify(currentPassword);
        if (!isValid) {
          setError('Current password is incorrect. Please try again.');
          return;
        }
        updatedData.password = newPassword;
        const res = await updateAccount(updatedData);
        if (res.message === 'Same password provided') {
          setSamePassword(true);
          setTimeout(() => setSamePassword(false), 3000);
        } else {
          setSaveSuccess(true);
        }
      }
      // Case 3: One field filled : error
      else {
        setError('Please fill in all required fields.');
        return;
      }

      // Reset fields after success
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (isCreator) {
        await deleteCreatorAccount();
        setUser(null);
        localStorage.clear();
      } else {
        await deleteBrandAccount();
        setUser(null);
        localStorage.clear();
      }
      setOpenDeleteDialog(false);
      navigate('/login');
    } catch (err) {
      console.error('Failed to delete account:', err);
      setError('Failed to delete account. Please try again.');
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

  // BRAND VIEW - Simple Sign Out and Delete Account
  if (!isCreator) {
    return (
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 800 }}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Log Out Section */}
        <Box sx={{ maxWidth: 300 }}>
          <Typography fontWeight={600} mb={2}>
            Log Out
          </Typography>
          <Button
            fullWidth
            onClick={() => {
              handleLogout(setUser, navigate);
            }}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              py: 1.5,
              borderRadius: 2,
              '&:hover': { backgroundColor: theme.palette.text.primary },
            }}
          >
            Sign Out
          </Button>
        </Box>

        {/* Delete Account Section */}
        <Box>
          <Typography
            fontWeight={600}
            sx={{ cursor: 'pointer', color: theme.palette.grey[600] }}
            onClick={() => setOpenDeleteDialog(true)}
          >
            Delete Account
          </Typography>
        </Box>

        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete your account?</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              sx={{
                backgroundColor: 'white',
                color: 'black',
                borderColor: 'black',
                '&:hover': { backgroundColor: '#F2F2F2' },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              sx={{
                backgroundColor: 'black',
                color: 'white',
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    );
  }

  // CREATOR VIEW - Full settings functionality
  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 800 }}>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {saveSuccess && (
        <Alert severity="success" onClose={() => setSaveSuccess(false)}>
          Profile updated successfully!
        </Alert>
      )}

      {sameEmail && (
        <Alert severity="warning" onClose={() => setSameEmail(false)}>
          You have provided the same email.
        </Alert>
      )}
      {samePassword && (
        <Alert severity="warning" onClose={() => setSamePassword(false)}>
          You have provided the same password.
        </Alert>
      )}

      <Box>
        <Typography fontWeight={600} mb={1}>
          Email
        </Typography>
        <TextField
          type="email"
          fullWidth
          variant="outlined"
          placeholder="Enter your email"
          value={formData.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          sx={{
            '&:hover': { backgroundColor: '#F2F2F2' },
            '& .MuiOutlinedInput-root.Mui-focused fieldset': {
              borderColor: 'black',
            },
          }}
        />
      </Box>

      {/* Password Edit Section */}
      {!showPasswordForm ? (
        <Button
          variant="outlined"
          onClick={() => setShowPasswordForm(true)}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderColor: 'black',
            color: 'black',
          }}
        >
          Edit Password
        </Button>
      ) : (
        <Stack spacing={2}>
          {/* Current Password */}
          <TextField
            label="Enter current password"
            type={showCurrentPassword ? 'text' : 'password'}
            fullWidth
            value={currentPassword || ''}
            onChange={(e) => setCurrentPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowCurrentPassword((prev) => !prev)}>
                    {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* New Password */}
          <TextField
            label="Enter new password"
            type={showNewPassword ? 'text' : 'password'}
            fullWidth
            value={newPassword || ''}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPassword((prev) => !prev)}>
                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      )}
      {/* Cancel & Save */}
      <Stack direction="row" spacing={2}>
        <Button
          onClick={editCreatorInfo}
          disabled={saving}
          sx={{
            backgroundColor: 'black',
            color: 'white',
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            '&:hover': { backgroundColor: theme.palette.text.primary },
          }}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: 'white',
            color: 'black',
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            borderRadius: 2,
            borderColor: 'black',
            '&:hover': { backgroundColor: '#F2F2F2' },
          }}
          onClick={() => {
            window.location.reload();
          }}
        >
          Cancel
        </Button>
      </Stack>
      <CardVerification />

      {/* Delete Account Section */}
      <Typography
        color="error"
        sx={{ cursor: 'pointer', fontWeight: 600, mt: 4, color: theme.palette.text.secondary }}
        onClick={() => setOpenDeleteDialog(true)}
      >
        Delete Account
      </Typography>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete your account?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              backgroundColor: 'white',
              color: 'black',
              borderColor: 'black',
              '&:hover': { backgroundColor: '#F2F2F2' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            sx={{
              backgroundColor: 'black',
              color: 'white',
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
