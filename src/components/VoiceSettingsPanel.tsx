import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Slider,
  Button,
  Grid,
  Stack
} from '@mui/material';
import { VoiceProfile } from '@types/index';
import { useVoicePreset } from '@hooks/useVoicePreset';

interface VoiceSettingsPanelProps {
  profile: VoiceProfile | null;
  onSave?: (profile: VoiceProfile) => Promise<void>;
}

export const VoiceSettingsPanel: React.FC<VoiceSettingsPanelProps> = ({ profile, onSave }) => {
  const { updateProfile } = useVoicePreset();
  const [localProfile, setLocalProfile] = useState<VoiceProfile | null>(profile);
  const [isLoading, setIsLoading] = useState(false);

  if (!localProfile) {
    return (
      <Card>
        <CardContent>
          <Typography color="textSecondary">No voice profile selected</Typography>
        </CardContent>
      </Card>
    );
  }

  const handleWarmthChange = (value: number) => {
    setLocalProfile({ ...localProfile, warmth: value });
  };

  const handleSpeedChange = (value: number) => {
    setLocalProfile({ ...localProfile, speed: value });
  };

  const handleVolumeChange = (value: number) => {
    setLocalProfile({ ...localProfile, volume: value });
  };

  const handleSave = async () => {
    if (!localProfile) return;
    setIsLoading(true);
    try {
      await updateProfile(localProfile.id, localProfile);
      if (onSave) {
        await onSave(localProfile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Voice Settings: {localProfile.name}
        </Typography>

        <Stack spacing={3}>
          <Box>
            <Typography gutterBottom>
              Warmth: {localProfile.warmth}
            </Typography>
            <Slider
              min={50}
              max={150}
              value={localProfile.warmth}
              onChange={(_, value) => handleWarmthChange(value as number)}
              marks={[
                { value: 50, label: 'Cool' },
                { value: 100, label: 'Neutral' },
                { value: 150, label: 'Warm' }
              ]}
            />
          </Box>

          <Box>
            <Typography gutterBottom>
              Speed: {localProfile.speed}
            </Typography>
            <Slider
              min={50}
              max={150}
              value={localProfile.speed}
              onChange={(_, value) => handleSpeedChange(value as number)}
              marks={[
                { value: 50, label: 'Slow' },
                { value: 100, label: 'Normal' },
                { value: 150, label: 'Fast' }
              ]}
            />
          </Box>

          <Box>
            <Typography gutterBottom>
              Volume: {localProfile.volume}
            </Typography>
            <Slider
              min={0}
              max={200}
              value={localProfile.volume}
              onChange={(_, value) => handleVolumeChange(value as number)}
              marks={[
                { value: 0, label: 'Mute' },
                { value: 100, label: 'Normal' },
                { value: 200, label: 'Max' }
              ]}
            />
          </Box>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default VoiceSettingsPanel;
