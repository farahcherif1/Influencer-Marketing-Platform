import type { Components, Theme } from '@mui/material/styles';

export const components: Components<Omit<Theme, 'components'>> = {
  // Button components
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
        padding: '12px 24px',
        fontSize: '0.875rem',
        fontWeight: 600,
        textTransform: 'none',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
        },
      },
    },
  },

  // Card components
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.08)',
        '&:hover': {
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
  },

  // Input components
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          '& fieldset': {
            borderColor: '#E5E7EB',
          },
          '&:hover fieldset': {
            borderColor: '#D1D5DB',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#8B5CF6',
            borderWidth: '1px',
          },
        },
      },
    },
  },

  // Chip components
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        fontWeight: 500,
      },
      colorPrimary: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        color: '#7C3AED',
        '&:hover': {
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
        },
      },
    },
  },

  // Avatar components
  MuiAvatar: {
    styleOverrides: {
      root: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },

  // Dialog components
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: '16px',
        padding: '8px',
      },
    },
  },

  // Paper components
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: '12px',
      },
      elevation1: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
      },
      elevation2: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
      },
      elevation3: {
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.14)',
      },
    },
  },

  // Menu components
  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: '12px',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
        marginTop: '8px',
      },
    },
  },
};
