import { useEffect, useCallback } from 'react';
import { useProjectStore } from '@store/projectStore';

interface UseAutoSaveOptions {
  enabled: boolean;
  interval: number; // milliseconds
}

export const useAutoSave = (options: UseAutoSaveOptions = { enabled: true, interval: 30000 }) => {
  const { currentProject, saveProject, markUnsavedChanges } = useProjectStore();

  useEffect(() => {
    if (!options.enabled || !currentProject) return;

    const interval = setInterval(async () => {
      if (currentProject.unsavedChanges) {
        await saveProject();
      }
    }, options.interval);

    return () => clearInterval(interval);
  }, [currentProject, options.enabled, options.interval, saveProject]);

  const markDirty = useCallback(() => {
    markUnsavedChanges();
  }, [markUnsavedChanges]);

  return {
    hasUnsavedChanges: currentProject?.unsavedChanges || false,
    markDirty
  };
};

export default useAutoSave;
