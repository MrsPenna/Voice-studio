import { create } from 'zustand';
import { VoiceProfile } from '@types/index';
import { voiceProfileDB } from '@services/database';

interface VoiceProfileState {
  profiles: VoiceProfile[];
  currentProfile: VoiceProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadProfiles: () => Promise<void>;
  loadProfile: (id: string) => Promise<void>;
  createProfile: (profile: VoiceProfile) => Promise<void>;
  updateProfile: (id: string, updates: Partial<VoiceProfile>) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  setCurrentProfile: (profile: VoiceProfile) => void;
  setDefaultProfile: (id: string) => Promise<void>;
  getDefaultProfile: () => Promise<VoiceProfile | undefined>;
  clearError: () => void;
}

export const useVoiceProfileStore = create<VoiceProfileState>((set, get) => ({
  profiles: [],
  currentProfile: null,
  isLoading: false,
  error: null,

  loadProfiles: async () => {
    set({ isLoading: true });
    try {
      const profiles = await voiceProfileDB.getAll();
      const convertedProfiles: VoiceProfile[] = profiles.map(p => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      }));
      set({ profiles: convertedProfiles, error: null });
    } catch (error) {
      set({ error: `Failed to load profiles: ${error}` });
    } finally {
      set({ isLoading: false });
    }
  },

  loadProfile: async (id: string) => {
    set({ isLoading: true });
    try {
      const profile = await voiceProfileDB.getById(id);
      if (profile) {
        const converted: VoiceProfile = {
          ...profile,
          createdAt: new Date(profile.createdAt),
          updatedAt: new Date(profile.updatedAt)
        };
        set({ currentProfile: converted, error: null });
      }
    } catch (error) {
      set({ error: `Failed to load profile: ${error}` });
    } finally {
      set({ isLoading: false });
    }
  },

  createProfile: async (profile: VoiceProfile) => {
    try {
      const now = Date.now();
      await voiceProfileDB.create({
        id: profile.id,
        name: profile.name,
        createdAt: now,
        updatedAt: now,
        warmth: profile.warmth,
        speed: profile.speed,
        volume: profile.volume,
        presetName: profile.presetName,
        recordingPath: profile.recordingPath,
        sampleText: profile.sampleText,
        gender: profile.gender,
        language: profile.language,
        isDefault: profile.isDefault
      });

      set(prev => ({
        profiles: [...prev.profiles, profile],
        currentProfile: profile,
        error: null
      }));
    } catch (error) {
      set({ error: `Failed to create profile: ${error}` });
    }
  },

  updateProfile: async (id: string, updates: Partial<VoiceProfile>) => {
    try {
      const now = Date.now();
      await voiceProfileDB.update(id, {
        ...updates,
        updatedAt: now
      });

      set(prev => ({
        profiles: prev.profiles.map(p =>
          p.id === id ? { ...p, ...updates, updatedAt: new Date(now) } : p
        ),
        currentProfile: prev.currentProfile?.id === id
          ? { ...prev.currentProfile, ...updates, updatedAt: new Date(now) }
          : prev.currentProfile,
        error: null
      }));
    } catch (error) {
      set({ error: `Failed to update profile: ${error}` });
    }
  },

  deleteProfile: async (id: string) => {
    try {
      await voiceProfileDB.delete(id);
      set(prev => ({
        profiles: prev.profiles.filter(p => p.id !== id),
        currentProfile: prev.currentProfile?.id === id ? null : prev.currentProfile,
        error: null
      }));
    } catch (error) {
      set({ error: `Failed to delete profile: ${error}` });
    }
  },

  setCurrentProfile: (profile: VoiceProfile) => {
    set({ currentProfile: profile });
  },

  setDefaultProfile: async (id: string) => {
    try {
      await voiceProfileDB.setDefault(id);
      await get().loadProfiles();
    } catch (error) {
      set({ error: `Failed to set default profile: ${error}` });
    }
  },

  getDefaultProfile: async () => {
    try {
      const profile = await voiceProfileDB.getDefault();
      if (profile) {
        return {
          ...profile,
          createdAt: new Date(profile.createdAt),
          updatedAt: new Date(profile.updatedAt)
        };
      }
      return undefined;
    } catch (error) {
      set({ error: `Failed to get default profile: ${error}` });
      return undefined;
    }
  },

  clearError: () => set({ error: null })
}));
