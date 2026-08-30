import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useUIStore } from '@store/uiStore';
import { useProjectStore } from '@store/projectStore';
import { useVoiceProfileStore } from '@store/voiceProfileStore';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAutoSave } from '@hooks/useAutoSave';
import { useBeforeUnload } from '@hooks/useBeforeUnload';
import AppLayout from '@components/AppLayout';
import Toast from '@components/Toast';
import LoadingSpinner from '@components/LoadingSpinner';
import Dashboard from '@pages/Dashboard';
import ProjectEditor from '@pages/ProjectEditor';
import VoiceProfiles from '@pages/VoiceProfiles';
import Settings from '@pages/Settings';
import { Suspense } from 'react';

const App: React.FC = () => {
  const { initialize, isInitializing, toastMessage, toastSeverity, clearToast, setOnline } = useUIStore();
  const { loadProfiles } = useVoiceProfileStore();
  const { isOnline } = useOnlineStatus();
  const [appReady, setAppReady] = useState(false);

  // Update online status
  useEffect(() => {
    setOnline(isOnline);
  }, [isOnline, setOnline]);

  // Initialize app
  useEffect(() => {
    const initApp = async () => {
      try {
        await initialize();
        await loadProfiles();
        setAppReady(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setAppReady(true); // Still show app even if initialization fails
      }
    };

    initApp();
  }, [initialize, loadProfiles]);

  // Setup auto-save
  useAutoSave({ enabled: true, interval: 30000 });

  // Setup before unload handler
  useBeforeUnload();

  if (isInitializing) {
    return <LoadingSpinner isLoading={true} message="Initializing Classroom Voice Studio..." />;
  }

  return (
    <Router>
      <AppLayout>
        <Suspense fallback={<LoadingSpinner isLoading={true} />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects/:id" element={<ProjectEditor />} />
            <Route path="/voice-profiles" element={<VoiceProfiles />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AppLayout>

      {/* Global Toast Notification */}
      <Toast
        open={!!toastMessage}
        message={toastMessage || ''}
        severity={toastSeverity as any}
        onClose={clearToast}
      />
    </Router>
  );
};

export default App;
