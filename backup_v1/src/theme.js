import { createTheme } from '@mui/material/styles';

// Define the custom theme
const theme = createTheme({
  // Color Palette
  palette: {
    mode: 'light',
    primary: {
      main: '#0F172A',
      light: '#1E293B',
      dark: '#020617',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
      disabled: '#94A3B8',
    },
    divider: '#E2E8F0',
  },

  // Typography
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,
    fontWeightExtraBold: 800,
    
    h1: {
      fontSize: '2.5rem',
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      lineHeight: 1.3,
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: '#64748B',
    },
  },

  // Shape
  shape: {
    borderRadius: 12,
  },

  // Spacing
  spacing: 8, // Base spacing unit (1 = 8px)

  // Shadows
  shadows: [
    'none',
    '0 1px 2px rgba(0, 0, 0, 0.05)',
    '0 2px 8px rgba(0, 0, 0, 0.06)',
    '0 4px 12px rgba(0, 0, 0, 0.08)',
    '0 6px 16px rgba(0, 0, 0, 0.10)',
    '0 8px 24px rgba(0, 0, 0, 0.10)',
    '0 12px 28px rgba(0, 0, 0, 0.12)',
    '0 16px 32px rgba(0, 0, 0, 0.14)',
    '0 20px 40px rgba(0, 0, 0, 0.15)',
    '0 24px 48px rgba(0, 0, 0, 0.16)',
    // ... extend to 25 items as MUI expects
    ...Array(15).fill('0 20px 40px rgba(0, 0, 0, 0.15)'),
  ],

  // Transitions
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },

  // Component Overrides
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.95rem',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
        sizeLarge: {
          padding: '14px 32px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.875rem',
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#F8FAFC',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#F1F5F9',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#94A3B8',
                borderWidth: 2,
              },
            },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#0F172A',
                borderWidth: 2,
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: '#64748B',
            '&.Mui-focused': {
              color: '#0F172A',
            },
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(241, 245, 249, 0.8)',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.3s ease',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.10)',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(241, 245, 249, 0.8)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 600,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(241, 245, 249, 0.1)',
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(8px)',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: '0.875rem',
          fontWeight: 500,
        },
        arrow: {
          color: 'rgba(15, 23, 42, 0.95)',
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6,
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '4px 0 25px rgba(0, 0, 0, 0.08)',
        },
      },
    },

    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          marginBottom: 4,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateX(4px)',
          },
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid',
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgba(16, 185, 129, 0.3)',
        },
        standardError: {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
        },
        standardWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderColor: 'rgba(245, 158, 11, 0.3)',
        },
        standardInfo: {
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgba(59, 130, 246, 0.3)',
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '3px solid white',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#E2E8F0',
        },
      },
    },
  },

  // Breakpoints (responsive design)
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;
