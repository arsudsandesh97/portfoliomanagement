import React from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import {
  ErrorOutline as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
            p: 3,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              sx={{
                maxWidth: 600,
                p: 5,
                textAlign: 'center',
                borderRadius: 4,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
                }}
              >
                <ErrorIcon sx={{ fontSize: 48, color: 'white' }} />
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#0F172A',
                  mb: 2,
                }}
              >
                Oops! Something went wrong
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: '#64748B',
                  mb: 4,
                  lineHeight: 1.7,
                }}
              >
                We encountered an unexpected error. Don't worry, your data is safe. 
                Please try refreshing the page or return to the home page.
              </Typography>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box
                  sx={{
                    p: 2,
                    mb: 4,
                    borderRadius: 2,
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FEE2E2',
                    textAlign: 'left',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Fira Code', monospace",
                      fontSize: '0.875rem',
                      color: '#DC2626',
                      wordBreak: 'break-word',
                    }}
                  >
                    {this.state.error.toString()}
                  </Typography>
                </Box>
              )}

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleReset}
                  sx={{
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(15, 23, 42, 0.3)',
                    },
                  }}
                >
                  Try Again
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={this.handleHome}
                  sx={{
                    borderColor: '#E2E8F0',
                    color: '#64748B',
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: '#CBD5E1',
                      backgroundColor: '#F8FAFC',
                      borderWidth: 2,
                    },
                  }}
                >
                  Go Home
                </Button>
              </Stack>
            </Paper>
          </motion.div>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
