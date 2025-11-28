import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import{ createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

// Create the context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

// Theme configuration function
const getTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light Mode Colors
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
        }
      : {
          // Dark Mode Colors
          primary: {
            main: '#F8FAFC',
            light: '#FFFFFF',
            dark: '#E2E8F0',
            contrastText: '#0F172A',
          },
          secondary: {
            main: '#60A5FA',
            light: '#93C5FD',
            dark: '#3B82F6',
            contrastText: '#0F172A',
          },
          success: {
            main: '#34D399',
            light: '#6EE7B7',
            dark: '#10B981',
          },
          error: {
            main: '#F87171',
            light: '#FCA5A5',
            dark: '#EF4444',
          },
          warning: {
            main: '#FBBF24',
            light: '#FCD34D',
            dark: '#F59E0B',
          },
          info: {
            main: '#60A5FA',
            light: '#93C5FD',
            dark: '#3B82F6',
          },
          background: {
            default: '#0F172A',
            paper: '#1E293B',
          },
          text: {
            primary: '#F8FAFC',
            secondary: '#CBD5E1',
            disabled: '#64748B',
          },
          divider: '#334155',
        }),
  },

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
    },
  },

  shape: {
    borderRadius: 12,
  },

  spacing: 8,

  shadows: [
    'none',
    mode === 'light' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : '0 1px 2px rgba(0, 0, 0, 0.3)',
    mode === 'light' ? '0 2px 8px rgba(0, 0, 0, 0.06)' : '0 2px 8px rgba(0, 0, 0, 0.4)',
    mode === 'light' ? '0 4px 12px rgba(0, 0, 0, 0.08)' : '0 4px 12px rgba(0, 0, 0, 0.5)',
    mode === 'light' ? '0 6px 16px rgba(0, 0, 0, 0.10)' : '0 6px 16px rgba(0, 0, 0, 0.6)',
    mode === 'light' ? '0 8px 24px rgba(0, 0, 0, 0.10)' : '0 8px 24px rgba(0, 0, 0, 0.7)',
    mode === 'light' ? '0 12px 28px rgba(0, 0, 0, 0.12)' : '0 12px 28px rgba(0, 0, 0, 0.8)',
    mode === 'light' ? '0 16px 32px rgba(0, 0, 0, 0.14)' : '0 16px 32px rgba(0, 0, 0, 0.9)',
    mode === 'light' ? '0 20px 40px rgba(0, 0, 0, 0.15)' : '0 20px 40px rgba(0, 0, 0, 1)',
    mode === 'light' ? '0 24px 48px rgba(0, 0, 0, 0.16)' : '0 24px 48px rgba(0, 0, 0, 1)',
    ...Array(15).fill(mode === 'light' ? '0 20px 40px rgba(0, 0, 0, 0.15)' : '0 20px 40px rgba(0, 0, 0, 1)'),
  ],

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
            boxShadow: mode === 'light' ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.6)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: mode === 'light' ? '0 6px 16px rgba(0, 0, 0, 0.2)' : '0 6px 16px rgba(0, 0, 0, 0.7)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: mode === 'light' ? '#F8FAFC' : 'rgba(30, 41, 59, 0.5)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: mode === 'light' ? '#F1F5F9' : 'rgba(51, 65, 85, 0.5)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'light' ? '#94A3B8' : '#64748B',
                borderWidth: 2,
              },
            },
            '&.Mui-focused': {
              backgroundColor: mode === 'light' ? '#FFFFFF' : 'rgba(30, 41, 59, 0.8)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'light' ? '#0F172A' : '#60A5FA',
                borderWidth: 2,
              },
            },
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' ? '0 4px 20px rgba(0, 0, 0, 0.06)' : '0 4px 20px rgba(0, 0, 0, 0.4)',
          border: mode === 'light' ? '1px solid rgba(241, 245, 249, 0.8)' : '1px solid rgba(51, 65, 85, 0.5)',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.3s ease',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' ? '0 4px 20px rgba(0, 0, 0, 0.06)' : '0 4px 20px rgba(0, 0, 0, 0.4)',
          border: mode === 'light' ? '1px solid rgba(241, 245, 249, 0.8)' : '1px solid rgba(51, 65, 85, 0.5)',
          transition: 'all 0.3s ease',
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E293B',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: mode === 'light' ? '0 12px 30px rgba(0, 0, 0, 0.08)' : '0 12px 30px rgba(0, 0, 0, 0.6)',
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
            boxShadow: mode === 'light' ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 4px 12px rgba(0, 0, 0, 0.5)',
          },
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

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: mode === 'light' ? '4px 0 25px rgba(0, 0, 0, 0.08)' : '4px 0 25px rgba(0, 0, 0, 0.6)',
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E293B',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' ? '0 4px 30px rgba(0, 0, 0, 0.03)' : '0 4px 30px rgba(0, 0, 0, 0.4)',
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E293B',
        },
      },
    },
  },

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

// ThemeProvider Component
export const ThemeProvider = ({ children }) => {
  // Get saved theme from localStorage or default to 'light'
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    // Update the CSS custom property for dark mode
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  const value = {
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
