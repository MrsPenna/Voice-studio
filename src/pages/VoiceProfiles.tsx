import React, { useEffect } from 'react';
import { Container, Box, Button, Grid, Card, CardContent, Typography, Stack } from '@mui/material';
import { useVoiceProfileStore } from '@store/voiceProfileStore';
import { useUIStore } from '@store/uiStore';
import AddIcon from '@mui/icons-material/Add';
import VoiceSettingsPanel from '@components/VoiceSettingsPanel';

const VoiceProfiles: React.FC = () => {
  const { profiles, loadProfiles, currentProfile, setCurrentProfile } = useVoiceProfileStore();
  const { showToast } = useUIStore();

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Voice Profiles</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          New Profile
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Available Profiles
          </Typography>
          <Stack spacing={2}>
            {profiles.map(profile => (
              <Card
                key={profile.id}
                onClick={() => setCurrentProfile(profile)}
                sx={{
                  cursor: 'pointer',
                  border: currentProfile?.id === profile.id ? '2px solid' : '1px solid',
                  borderColor: currentProfile?.id === profile.id ? 'primary.main' : 'divider',
                  backgroundColor: currentProfile?.id === profile.id ? 'action.selected' : 'background.paper'
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1">{profile.name}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {profile.gender} • {profile.language}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={8}>
          {currentProfile && <VoiceSettingsPanel profile={currentProfile} />}
        </Grid>
      </Grid>
    </Container>
  );
};

export default VoiceProfiles;
