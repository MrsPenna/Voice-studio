import { create } from 'zustand';
import { OneDriveFile } from '@types/index';
import { oneDriveFileDB } from '@services/database';

interface OneDriveState {
  files: OneDriveFile[];
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  loadFiles: () => Promise<void>;
  addFile: (file: OneDriveFile) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  setAuthenticated: (authenticated: boolean) => void;
  clearError: () => void;
}

export const useOneDriveStore = create<OneDriveState>((set, get) => ({
  files: [],
  isLoading: false,
  isAuthenticated: false,
  error: null,

  loadFiles: async () => {
    set({ isLoading: true });
    try {
      const files = await oneDriveFileDB.getAll();
      const converted: OneDriveFile[] = files.map(f => ({
        ...f,
        createdAt: new Date(f.createdAt),
        modifiedAt: new Date(f.modifiedAt)
      }));
      set({ files: converted, error: null });
    } catch (error) {
      set({ error: `Failed to load files: ${error}` });
    } finally {
      set({ isLoading: false });
    }
  },

  addFile: async (file: OneDriveFile) => {
    try {
      await oneDriveFileDB.create({
        id: file.id,
        driveItemId: file.id,
        name: file.name,
        path: file.path,
        size: file.size,
        createdAt: file.createdAt.getTime(),
        modifiedAt: file.modifiedAt.getTime(),
        webUrl: file.webUrl
      });

      set(prev => ({
        files: [...prev.files, file],
        error: null
      }));
    } catch (error) {
      set({ error: `Failed to add file: ${error}` });
    }
  },

  deleteFile: async (id: string) => {
    try {
      await oneDriveFileDB.delete(id);
      set(prev => ({
        files: prev.files.filter(f => f.id !== id),
        error: null
      }));
    } catch (error) {
      set({ error: `Failed to delete file: ${error}` });
    }
  },

  setAuthenticated: (authenticated: boolean) => {
    set({ isAuthenticated: authenticated });
  },

  clearError: () => set({ error: null })
}));
