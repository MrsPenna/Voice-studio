import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = true
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      {label && <Typography variant="body2">{label}</Typography>}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          <LinearProgress variant="determinate" value={value} sx={{ height: 8, borderRadius: 4 }} />
        </Box>
        {showPercentage && <Typography variant="body2" sx={{ minWidth: 40 }}>{value}%</Typography>}
      </Box>
    </Box>
  );
};

export default ProgressBar;
