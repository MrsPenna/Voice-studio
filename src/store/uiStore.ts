import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState } from '@types/index';
import { appStateDB } from '@services/database';

interface UIState extends AppState {
  // Loading states
  isInitializing: boolean;
  isSaving: boolean;
  isExporting: boolean;
  isImporting: boolean;

  // Dialog states
  showCreateProjectDialog: boolean;
  showImportDialog: boolean;
  showExportDialog: boolean;
  showScheduleDialog: boolean;
  showSettingsDialog: boolean;

  // Toast/Snackbar
  toastMessage: string | null;
  toastSeverity: 'success' | 'error' | 'warning' | 'info';

  // Actions
  setCurrentProject: (id: string | undefined) => void;
  setCurrentVoiceProfile: (id: string | undefined) => void;
  setOnline: (online: boolean) => void;
  setDarkMode: (dark: boolean) => void;
  setInitializing: (initializing: boolean) => void;
  setSaving: (saving: boolean) => void;
  setExporting: (exporting: boolean) => void;
  setImporting: (importing: boolean) => void;
  setShowCreateProjectDialog: (show: boolean) => void;
  setShowImportDialog: (show: boolean) => void;
  setShowExportDialog: (show: boolean) => void;
  setShowScheduleDialog: (show: boolean) => void;
  setShowSettingsDialog: (show: boolean) => void;
  showToast: (message: string, severity?: 'success' | 'error' | 'warning' | 'info') => void;
  clearToast: () => void;
  initialize: () => Promise<void>;
}

export const useUIStore = create<UIState>()()
  (persist(
    (set, get) => ({
      currentProjectId: undefined,
      currentVoiceProfileId: undefined,
      isOnline: navigator.onLine,
      isDarkMode: false,
      lastSyncAt: undefined,

      // Loading states
      isInitializing: false,
      isSaving: false,
      isExporting: false,
      isImporting: false,

      // Dialog states
      showCreateProjectDialog: false,
      showImportDialog: false,
      showExportDialog: false,
      showScheduleDialog: false,
      showSettingsDialog: false,

      // Toast
      toastMessage: null,
      toastSeverity: 'info',

      // Actions
      setCurrentProject: (id: string | undefined) => {
        set({ currentProjectId: id });
        appStateDB.update({ currentProjectId: id });
      },

      setCurrentVoiceProfile: (id: string | undefined) => {
        set({ currentVoiceProfileId: id });
        appStateDB.update({ currentVoiceProfileId: id });
      },

      setOnline: (online: boolean) => {
        set({ isOnline: online });
      },

      setDarkMode: (dark: boolean) => {
        set({ isDarkMode: dark });
        appStateDB.update({ isDarkMode: dark });
      },

      setInitializing: (initializing: boolean) => {
        set({ isInitializing: initializing });
      },

      setSaving: (saving: boolean) => {
        set({ isSaving: saving });
      },

      setExporting: (exporting: boolean) => {
        set({ isExporting: exporting });
      },

      setImporting: (importing: boolean) => {
        set({ isImporting: importing });
      },

      setShowCreateProjectDialog: (show: boolean) => {
        set({ showCreateProjectDialog: show });
      },

      setShowImportDialog: (show: boolean) => {
        set({ showImportDialog: show });
      },

      setShowExportDialog: (show: boolean) => {
        set({ showExportDialog: show });
      },

      setShowScheduleDialog: (show: boolean) => {
        set({ showScheduleDialog: show });
      },

      setShowSettingsDialog: (show: boolean) => {
        set({ showSettingsDialog: show });
      },

      showToast: (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        set({ toastMessage: message, toastSeverity: severity });
      },

      clearToast: () => {
        set({ toastMessage: null });
      },

      initialize: async () => {
        set({ isInitializing: true });
        try {
          const state = await appStateDB.get();
          if (state) {
            set(state);
          }
        } catch (error) {
          console.error('Failed to initialize UI state:', error);
        } finally {
          set({ isInitializing: false });
        }
      }
    }),
    {
      name: 'cvs-ui-state',
      partialize: (state) => ({
        currentProjectId: state.currentProjectId,
        currentVoiceProfileId: state.currentVoiceProfileId,
        isDarkMode: state.isDarkMode,
        isOnline: state.isOnline
      })
    }
  ));
