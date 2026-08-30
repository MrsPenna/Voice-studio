import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VoiceProfile, Project, Announcement } from '@types/index';
import { voiceProfileDB, projectDB, announcementDB } from '@services/database';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadProjects: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  createProject: (name: string, voiceProfileId: string) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  addAnnouncement: (announcement: Announcement) => Promise<void>;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  reorderAnnouncements: (announcements: Announcement[]) => Promise<void>;
  markUnsavedChanges: () => void;
  saveProject: () => Promise<void>;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>()()
  ((set, get) => ({
    projects: [],
    currentProject: null,
    isLoading: false,
    error: null,

    loadProjects: async () => {
      set({ isLoading: true });
      try {
        const projects = await projectDB.getRecent();
        set({ projects, error: null });
      } catch (error) {
        set({ error: `Failed to load projects: ${error}` });
      } finally {
        set({ isLoading: false });
      }
    },

    loadProject: async (id: string) => {
      set({ isLoading: true });
      try {
        const project = await projectDB.getById(id);
        if (project) {
          const announcements = await announcementDB.getByProjectId(id);
          const fullProject: Project = {
            ...project,
            createdAt: new Date(project.createdAt),
            updatedAt: new Date(project.updatedAt),
            announcements: announcements.map(a => ({
              ...a,
              createdAt: new Date(a.createdAt),
              updatedAt: new Date(a.updatedAt)
            }))
          };
          set({ currentProject: fullProject, error: null });
        }
      } catch (error) {
        set({ error: `Failed to load project: ${error}` });
      } finally {
        set({ isLoading: false });
      }
    },

    createProject: async (name: string, voiceProfileId: string) => {
      try {
        const now = Date.now();
        const project: Project = {
          id: `project-${Date.now()}`,
          name,
          voiceProfileId,
          createdAt: new Date(now),
          updatedAt: new Date(now),
          announcements: [],
          autosaveEnabled: true,
          unsavedChanges: false,
          version: 1
        };

        await projectDB.create({
          id: project.id,
          name: project.name,
          voiceProfileId: project.voiceProfileId,
          createdAt: now,
          updatedAt: now,
          autosaveEnabled: project.autosaveEnabled,
          unsavedChanges: project.unsavedChanges,
          version: project.version
        });

        set({ currentProject: project, error: null });
        return project;
      } catch (error) {
        set({ error: `Failed to create project: ${error}` });
        throw error;
      }
    },

    updateProject: async (id: string, updates: Partial<Project>) => {
      try {
        const now = Date.now();
        await projectDB.update(id, {
          ...updates,
          updatedAt: now,
          lastSavedAt: updates.unsavedChanges === false ? now : undefined
        });

        const current = get().currentProject;
        if (current && current.id === id) {
          set({
            currentProject: {
              ...current,
              ...updates,
              updatedAt: new Date(now)
            }
          });
        }
      } catch (error) {
        set({ error: `Failed to update project: ${error}` });
      }
    },

    deleteProject: async (id: string) => {
      try {
        await projectDB.delete(id);
        const projects = get().projects.filter(p => p.id !== id);
        set({ projects });

        if (get().currentProject?.id === id) {
          set({ currentProject: null });
        }
      } catch (error) {
        set({ error: `Failed to delete project: ${error}` });
      }
    },

    setCurrentProject: (project: Project | null) => {
      set({ currentProject: project });
    },

    addAnnouncement: async (announcement: Announcement) => {
      try {
        const now = Date.now();
        const current = get().currentProject;
        if (!current) throw new Error('No project selected');

        await announcementDB.create({
          id: announcement.id,
          projectId: announcement.projectId,
          text: announcement.text,
          voiceProfileId: announcement.voiceProfileId,
          order: announcement.order,
          createdAt: now,
          updatedAt: now,
          audioPath: announcement.audioPath,
          duration: announcement.duration,
          warmth: announcement.settings?.warmth,
          speed: announcement.settings?.speed,
          volume: announcement.settings?.volume
        });

        set({
          currentProject: {
            ...current,
            announcements: [...current.announcements, announcement],
            unsavedChanges: true,
            updatedAt: new Date(now)
          }
        });
      } catch (error) {
        set({ error: `Failed to add announcement: ${error}` });
      }
    },

    updateAnnouncement: async (id: string, updates: Partial<Announcement>) => {
      try {
        const now = Date.now();
        await announcementDB.update(id, {
          ...updates,
          updatedAt: now
        });

        const current = get().currentProject;
        if (current) {
          set({
            currentProject: {
              ...current,
              announcements: current.announcements.map(a =>
                a.id === id ? { ...a, ...updates, updatedAt: new Date(now) } : a
              ),
              unsavedChanges: true,
              updatedAt: new Date(now)
            }
          });
        }
      } catch (error) {
        set({ error: `Failed to update announcement: ${error}` });
      }
    },

    deleteAnnouncement: async (id: string) => {
      try {
        const now = Date.now();
        await announcementDB.delete(id);

        const current = get().currentProject;
        if (current) {
          set({
            currentProject: {
              ...current,
              announcements: current.announcements.filter(a => a.id !== id),
              unsavedChanges: true,
              updatedAt: new Date(now)
            }
          });
        }
      } catch (error) {
        set({ error: `Failed to delete announcement: ${error}` });
      }
    },

    reorderAnnouncements: async (announcements: Announcement[]) => {
      try {
        const now = Date.now();
        const dbAnnouncements = announcements.map((a, index) => ({
          id: a.id,
          projectId: a.projectId,
          text: a.text,
          voiceProfileId: a.voiceProfileId,
          order: index,
          createdAt: a.createdAt.getTime(),
          updatedAt: now,
          audioPath: a.audioPath,
          duration: a.duration,
          warmth: a.settings?.warmth,
          speed: a.settings?.speed,
          volume: a.settings?.volume
        }));

        await announcementDB.updateOrder(announcements[0].projectId, dbAnnouncements);

        const current = get().currentProject;
        if (current) {
          set({
            currentProject: {
              ...current,
              announcements: announcements.map((a, index) => ({
                ...a,
                order: index,
                updatedAt: new Date(now)
              })),
              unsavedChanges: true,
              updatedAt: new Date(now)
            }
          });
        }
      } catch (error) {
        set({ error: `Failed to reorder announcements: ${error}` });
      }
    },

    markUnsavedChanges: () => {
      const current = get().currentProject;
      if (current) {
        set({
          currentProject: {
            ...current,
            unsavedChanges: true
          }
        });
      }
    },

    saveProject: async () => {
      const current = get().currentProject;
      if (!current) return;

      try {
        const now = Date.now();
        await projectDB.update(current.id, {
          unsavedChanges: false,
          lastSavedAt: now
        });

        set({
          currentProject: {
            ...current,
            unsavedChanges: false,
            lastSavedAt: new Date(now)
          }
        });
      } catch (error) {
        set({ error: `Failed to save project: ${error}` });
      }
    },

    clearError: () => set({ error: null })
  }));
