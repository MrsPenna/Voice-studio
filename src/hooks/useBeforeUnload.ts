import { useEffect } from 'react';
import { useUIStore } from '@store/uiStore';

export const useBeforeUnload = () => {
  const { currentProjectId } = useUIStore();
  const { currentProject } = useProjectStore();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentProject?.unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentProject?.unsavedChanges]);
};

import { useProjectStore } from '@store/projectStore';

export default useBeforeUnload;
