import React, { useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography, Button, Card, CardContent, CardActions } from '@mui/material';
import { useProjectStore } from '@store/projectStore';
import { useVoiceProfileStore } from '@store/voiceProfileStore';
import { useUIStore } from '@store/uiStore';
import AddIcon from '@mui/icons-material/Add';
import ProjectList from '@components/ProjectList';

const Dashboard: React.FC = () => {
  const { projects, loadProjects } = useProjectStore();
  const { profiles, loadProfiles } = useVoiceProfileStore();
  const { setShowCreateProjectDialog } = useUIStore();

  useEffect(() => {
    loadProjects();
    loadProfiles();
  }, [loadProjects, loadProfiles]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Welcome to Classroom Voice Studio
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Create and manage voice announcements for your classroom with professional voice profiles and scheduling.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4">{projects.length}</Typography>
            <Typography variant="body2" color="textSecondary">
              Projects
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4">{profiles.length}</Typography>
            <Typography variant="body2" color="textSecondary">
              Voice Profiles
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4">
              {projects.reduce((sum, p) => sum + p.announcements.length, 0)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Announcements
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowCreateProjectDialog(true)}
            sx={{ py: 1.5 }}
          >
            New Project
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <ProjectList />
      </Box>

      {/* Quick Start Guide */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Start
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  1. Create a Project
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Start by creating a new project to organize your announcements.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  2. Set Up Voice Profile
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Configure your voice profile with warmth, speed, and volume settings.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  3. Add Announcements
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Add announcements to your project and customize them with audio effects.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
