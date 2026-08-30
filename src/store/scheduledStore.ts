import { create } from 'zustand';
import { ScheduledAnnouncement } from '@types/index';
import { scheduledAnnouncementDB } from '@services/database';

interface ScheduledState {
  scheduled: ScheduledAnnouncement[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadScheduled: () => Promise<void>;
  loadUpcoming: () => Promise<void>;
  createScheduled: (scheduled: ScheduledAnnouncement) => Promise<void>;
  updateScheduled: (id: string, updates: Partial<ScheduledAnnouncement>) => Promise<void>;
  deleteScheduled: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useScheduledStore = create<ScheduledState>((set, get) => ({
  scheduled: [],
  isLoading: false,
  error: null,

  loadScheduled: async () => {
    set({ isLoading: true });
    try {
      const scheduled = await scheduledAnnouncementDB.getByAnnouncementId('');
      set({ scheduled, error: null });
    } catch (error) {
      set({ error: `Failed to load scheduled: ${error}` });
    } finally {
      set({ isLoading: false });
    }
  },

  loadUpcoming: async () => {
    set({ isLoading: true });
    try {
      const scheduled = await scheduledAnnouncementDB.getUpcoming();
      set({ scheduled, error: null });
    } catch (error) {
      set({ error: `Failed to load upcoming: ${error}` });
    } finally {
      set({ isLoading: false });
    }
  },

  createScheduled: async (scheduled: ScheduledAnnouncement) => {
    try {
      await scheduledAnnouncementDB.create({
        id: scheduled.id,
        announcementId: scheduled.announcementId,
        scheduledTime: scheduled.scheduledTime.getTime(),
        recurrance: scheduled.recurrance,
        notificationEnabled: scheduled.notificationEnabled,
        notificationMinutesBefore: scheduled.notificationMinutesBefore,
        status: scheduled.status
      });

      set(prev => ({
        scheduled: [...prev.scheduled, scheduled],
        error: null
      }));
    } catch (error) {
      set({ error: `Failed to create scheduled: ${error}` });
    }
  },

  updateScheduled: async (id: string, updates: Partial<ScheduledAnnouncement>) => {
    try {
      const dbUpdates = {
        ...updates,
        scheduledTime: updates.scheduledTime?.getTime()
      };

      await scheduledAnnouncementDB.update(id, dbUpdates);

      set(prev => ({
        scheduled: prev.scheduled.map(s =>
          s.id === id ? { ...s, ...updates } : s
        ),
        error: null
      }));
    } catch (error) {
      set({ error: `Failed to update scheduled: ${error}` });
    }
  },

  deleteScheduled: async (id: string) => {
    try {
      await scheduledAnnouncementDB.delete(id);
      set(prev => ({
        scheduled: prev.scheduled.filter(s => s.id !== id),
        error: null
      }));
    } catch (error) {
      set({ error: `Failed to delete scheduled: ${error}` });
    }
  },

  clearError: () => set({ error: null })
}));
