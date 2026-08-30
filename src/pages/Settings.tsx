import React, { useState } from 'react';
import { Container, Box, Paper, Tabs, Tab, Typography, Stack, Switch, FormControlLabel, Button } from '@mui/material';
import { useUIStore } from '@store/uiStore';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Settings: React.FC = () => {
  const { isDarkMode, setDarkMode, showToast } = useUIStore();
  const [tabValue, setTabValue] = useState(0);
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleDarkModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDarkMode(e.target.checked);
    showToast('Theme updated', 'success');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          aria-label="settings tabs"
        >
          <Tab label="Appearance" id="settings-tab-0" />
          <Tab label="Preferences" id="settings-tab-1" />
          <Tab label="About" id="settings-tab-2" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Stack spacing={3}>
            <Box>
              <FormControlLabel
                control=<Switch checked={isDarkMode} onChange={handleDarkModeChange} />
                label="Dark Mode"
              />
            </Box>
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Stack spacing={3}>
            <Box>
              <FormControlLabel
                control=<Switch checked={autoSave} onChange={(e) => setAutoSave(e.target.checked)} />
                label="Enable Auto-save"
              />
            </Box>
            <Box>
              <FormControlLabel
                control=<Switch checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
                label="Enable Notifications"
              />
            </Box>
          </Stack>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Stack spacing={2}>
            <Typography variant="body1">
              <strong>Classroom Voice Studio</strong> v1.0.0
            </Typography>
            <Typography variant="body2" color="textSecondary">
              A professional voice announcement system for educational settings.
            </Typography>
            <Button variant="outlined">
              Check for Updates
            </Button>
          </Stack>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Settings;
