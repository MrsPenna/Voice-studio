import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Tabs, Tab, Paper, Button, Stack } from '@mui/material';
import { useProjectStore } from '@store/projectStore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AnnouncementList from '@components/AnnouncementList';
import VoiceSettingsPanel from '@components/VoiceSettingsPanel';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProjectEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProject, loadProject, saveProject } = useProjectStore();
  const [tabValue, setTabValue] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id, loadProject]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveProject();
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!currentProject) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back to Projects
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={isSaving || !currentProject.unsavedChanges}
        >
          {isSaving ? 'Saving...' : 'Save Project'}
        </Button>
      </Stack>

      <Paper>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          aria-label="project tabs"
        >
          <Tab label="Announcements" id="project-tab-0" />
          <Tab label="Voice Settings" id="project-tab-1" />
          <Tab label="Schedule" id="project-tab-2" />
          <Tab label="Export" id="project-tab-3" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <AnnouncementList projectId={currentProject.id} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <VoiceSettingsPanel profile={null} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Schedule component */}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {/* Export component */}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ProjectEditor;
