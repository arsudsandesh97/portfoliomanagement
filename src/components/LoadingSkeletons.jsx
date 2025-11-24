import React from 'react';
import { Box, Skeleton, Stack, Paper } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Shimmer animation
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const ShimmerBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(
    90deg,
    ${theme.palette.background.default} 0%,
    ${theme.palette.grey[100]} 50%,
    ${theme.palette.background.default} 100%
  )`,
  backgroundSize: '1000px 100%',
  animation: `${shimmer} 2s infinite linear`,
}));

// Card Skeleton
export const CardSkeleton = ({ count = 1, height = 200 }) => {
  return (
    <Stack spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Paper
          key={index}
          sx={{
            p: 3,
            height,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Stack spacing={2}>
            <Skeleton
              variant="rectangular"
              height={40}
              sx={{ borderRadius: 2 }}
              animation="wave"
            />
            <Skeleton
              variant="rectangular"
              height={height - 100}
              sx={{ borderRadius: 2 }}
              animation="wave"
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton
                variant="rectangular"
                width={100}
                height={36}
                sx={{ borderRadius: 2 }}
                animation="wave"
              />
              <Skeleton
                variant="rectangular"
                width={100}
                height={36}
                sx={{ borderRadius: 2 }}
                animation="wave"
              />
            </Box>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

// Form Skeleton
export const FormSkeleton = () => {
  return (
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Skeleton
            variant="rectangular"
            height={50}
            sx={{ borderRadius: 2, mb: 1 }}
            animation="wave"
          />
          <Skeleton
            variant="rectangular"
            height={20}
            width="60%"
            sx={{ borderRadius: 2 }}
            animation="wave"
          />
        </Box>

        {/* Form Fields */}
        {Array.from({ length: 4 }).map((_, index) => (
          <Box key={index}>
            <Skeleton
              variant="rectangular"
              height={56}
              sx={{ borderRadius: 2 }}
              animation="wave"
            />
          </Box>
        ))}

        {/* Buttons */}
        <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
          <Skeleton
            variant="rectangular"
            width={120}
            height={46}
            sx={{ borderRadius: 2 }}
            animation="wave"
          />
          <Skeleton
            variant="rectangular"
            width={120}
            height={46}
            sx={{ borderRadius: 2 }}
            animation="wave"
          />
        </Box>
      </Stack>
    </Paper>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stack spacing={2}>
        {/* Header Row */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={40}
              sx={{ flex: 1, borderRadius: 2 }}
              animation="wave"
            />
          ))}
        </Box>

        {/* Data Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Box key={rowIndex} sx={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                variant="rectangular"
                height={50}
                sx={{ flex: 1, borderRadius: 2 }}
                animation="wave"
              />
            ))}
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

// List Skeleton
export const ListSkeleton = ({ items = 5 }) => {
  return (
    <Stack spacing={2}>
      {Array.from({ length: items }).map((_, index) => (
        <Paper
          key={index}
          sx={{
            p: 2,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Skeleton
            variant="circular"
            width={48}
            height={48}
            animation="wave"
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton
              variant="rectangular"
              height={20}
              sx={{ borderRadius: 1, mb: 1 }}
              animation="wave"
            />
            <Skeleton
              variant="rectangular"
              height={16}
              width="70%"
              sx={{ borderRadius: 1 }}
              animation="wave"
            />
          </Box>
        </Paper>
      ))}
    </Stack>
  );
};

// Profile Skeleton
export const ProfileSkeleton = () => {
  return (
    <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
      <Stack spacing={3} alignItems="center">
        <Skeleton
          variant="circular"
          width={140}
          height={140}
          animation="wave"
        />
        <Box sx={{ width: '100%' }}>
          <Skeleton
            variant="rectangular"
            height={32}
            sx={{ borderRadius: 2, mb: 1, mx: 'auto', maxWidth: 250 }}
            animation="wave"
          />
          <Skeleton
            variant="rectangular"
            height={20}
            sx={{ borderRadius: 1, mx: 'auto', maxWidth: 350 }}
            animation="wave"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width={80}
              height={32}
              sx={{ borderRadius: 2 }}
              animation="wave"
            />
          ))}
        </Box>
      </Stack>
    </Paper>
  );
};

// Dashboard Skeleton
export const DashboardSkeleton = () => {
  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Skeleton
          variant="rectangular"
          height={60}
          sx={{ borderRadius: 2 }}
          animation="wave"
        />
      </Paper>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 3 }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Paper key={index} sx={{ p: 3, borderRadius: 3 }}>
            <Stack spacing={2}>
              <Skeleton
                variant="rectangular"
                height={24}
                width="60%"
                sx={{ borderRadius: 1 }}
                animation="wave"
              />
              <Skeleton
                variant="rectangular"
                height={48}
                sx={{ borderRadius: 2 }}
                animation="wave"
              />
            </Stack>
          </Paper>
        ))}
      </Box>

      {/* Main Content */}
      <CardSkeleton count={2} height={300} />
    </Box>
  );
};

// Custom Shimmer Loader
export const ShimmerLoader = ({ width = '100%', height = 100, borderRadius = 2 }) => {
  return (
    <ShimmerBox
      sx={{
        width,
        height,
        borderRadius,
      }}
    />
  );
};

export default {
  CardSkeleton,
  FormSkeleton,
  TableSkeleton,
  ListSkeleton,
  ProfileSkeleton,
  DashboardSkeleton,
  ShimmerLoader,
};
